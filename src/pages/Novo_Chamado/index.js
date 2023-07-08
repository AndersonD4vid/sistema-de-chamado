import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiClipboard } from "react-icons/fi";
import { Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { db } from '../../services/conexaoFirebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';


const listRef = collection(db, "clientes");

export default function NovoChamado() {
   const { user } = useContext(AuthContext);
   const { id } = useParams();
   const navigate = useNavigate();

   const [clientes, setClientes] = useState([]);
   const [loadingCliente, setLoadingCliente] = useState(true);
   const [clienteSelected, setClienteSelected] = useState(0);

   const [observacao, setObservacao] = useState('');
   const [assunto, setAssunto] = useState('Suporte');
   const [status, setStatus] = useState('Aberto');
   const [idCliente, setIdCliente] = useState(false);

   const [showBotao, setShowBotao] = useState(false);


   // Buscando dados dos clientes
   useEffect(() => {
      async function setLoadingClientes() {
         const querySnapshot = await getDocs(listRef)
            .then((snapshot) => {
               let lista = [];

               snapshot.forEach((doc) => {
                  lista.push({
                     id: doc.id,
                     nomeFantasia: doc.data().nomeFantasia,
                     email: doc.data().email,
                     telefone: doc.data().telefone,
                     cnpj: doc.data().cnpj,
                     endereco: doc.data().endereco,
                  })
               })

               if (snapshot.docs.size === 0) {
                  console.log("Nenhuma empresa encontrada!");
                  setClientes([{ id: 1, nomeFantasia: 'Empresa Teste' }]);
                  return;
               }

               setClientes(lista);
               setLoadingCliente(false);

               if (id) {
                  loadId(lista);
               }

            }).catch((error) => {
               console.log('Erro ao buscar os clientes', error);
               loadingCliente(false);
               setClientes([{ id: 1, nomeFantasia: 'Empresa Teste' }]);
            })
      }

      setLoadingClientes();
   }, [id])

   async function loadId(lista) {
      const docRef = doc(db, "chamados", id);
      await getDoc(docRef)
         .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setObservacao(snapshot.data().observacao);

            // Buscando o id do mesmo cliente
            let index = lista.findIndex(item => item.id === snapshot.data().clienteID);
            // Setando
            setClienteSelected(index);
            setIdCliente(true); // informa que estar de fato na tela de edição, e não a tela de novo chamado
         }).catch((error) => {
            console.log('Erro: Algo deu errado,' + error);
            setIdCliente(false);
         })
   }

   function handleOptionChange(e) {
      setStatus(e.target.value);
   }

   function handleChangeSelect(e) {
      setAssunto(e.target.value);
   }

   function handleChangeCliente(e) {
      setClienteSelected(e.target.value);
      //console.log(clientes[e.target.value].nomeFantasia)
   }

   async function handleSubmit(e) {
      e.preventDefault();

      if (idCliente) {
         // Atualizando chamado
         const docRef = doc(db, "chamados", id);
         await updateDoc(docRef, {
            cliente: clientes[clienteSelected].nomeFantasia,
            clienteID: clientes[clienteSelected].id,
            assunto: assunto,
            status: status,
            observacao: observacao,
            userId: user.uid
         }).then(() => {
            if (status === 'Atendido') {
               const docRef = doc(db, 'chamados', id);
               deleteDoc(docRef).then(() => {
                  toast.success('Sucesso: Chamado deletado!');
                  setTimeout(() => {
                     window.location.reload();
                  }, 500);
               }).catch((error) => {
                  toast.error('Erro: Algo deu errado! Tente mais tarde!', error);
               })
               return;
            }
            toast.success('Sucesso: Chamado atualizado!');
            setClienteSelected(0);
            setObservacao('');
            navigate('/dashboard');
         }).catch((error) => {
            toast.error('Erro: Algo deu errado! Tente mais tarde!', error);
         })
         return;
      }

      await addDoc(collection(db, "chamados"), {
         created: new Date(),
         cliente: clientes[clienteSelected].nomeFantasia,
         clienteID: clientes[clienteSelected].id,
         assunto: assunto,
         status: status,
         observacao: observacao,
         userId: user.uid
      })
         .then(() => {
            toast.success('Sucesso: Chamado criado!');
            setObservacao('');
            setClienteSelected(0);
            navigate('/dashboard');
         }).catch((error) => {
            toast.error('Erro: Algo deu errado! Tente mais tarde!', error);
         })
   }


   return (
      <div className='content'>
         <Header />
         <div className='contentDash'>
            <Title name={id ? 'Editando chamado' : 'Novo chamado'}>
               <FiClipboard color='#333' size={24} />
            </Title>

            <div className='areaFormulario'>
               <form onSubmit={handleSubmit}>
                  <FormGroup>
                     <Label for="select">Cliente</Label>
                     {
                        loadingCliente ?
                           (
                              <Input type="text" disabled={true} value="Carregando..." />
                           )

                           :
                           (
                              <Input type="select" value={clienteSelected} onChange={handleChangeCliente}>

                                 {clientes.map((item, index) => {
                                    return (
                                       <option key={index} value={index}>{item.nomeFantasia}</option>
                                    );
                                 })}
                              </Input>
                           )
                     }
                  </FormGroup>

                  <FormGroup>
                     <Label for="select">Assunto</Label>
                     <Input type="select" name="select" value={assunto} onChange={handleChangeSelect} >
                        <option value="Suporte">Suporte</option>
                        <option value="Visita Técnica">Visita Técnica</option>
                        <option value="Financeiro">Financeiro</option>
                        <option value="Marketing">Marketing</option>
                     </Input>
                  </FormGroup>

                  <Row>
                     <Col sm={1} md={2}>
                        <FormGroup check>
                           <Label check>
                              <Input type="radio"
                                 value="Aberto"
                                 name="radio1"
                                 checked={status === 'Aberto'}
                                 onChange={handleOptionChange}
                              />
                              Em aberto
                           </Label>
                        </FormGroup>

                     </Col>

                     <Col sm={1} md={2}>
                        <FormGroup check>
                           <Label check>
                              <Input
                                 type="radio"
                                 value="Atendido"
                                 name="radio2"
                                 checked={status === 'Atendido'}
                                 onChange={handleOptionChange}
                              />
                              Atendido
                           </Label>
                        </FormGroup>
                     </Col>

                     <Col sm={1} md={2}>
                        <FormGroup check>
                           <Label check>
                              <Input
                                 type="radio"
                                 name="radio3"
                                 value="Em progresso"
                                 checked={status === 'Em progresso'}
                                 onChange={handleOptionChange}
                              />
                              Em progresso
                           </Label>
                        </FormGroup>
                     </Col>

                     <Col sm={1} md={2}>
                        <FormGroup check>
                           <Label check>
                              <Input
                                 type="radio"
                                 name="radio4"
                                 value="Pago"
                                 checked={status === 'Pago'}
                                 onChange={handleOptionChange}
                              />
                              Pago
                           </Label>
                        </FormGroup>
                     </Col>

                     <Col sm={1} md={2}>
                        <FormGroup check>
                           <Label check>
                              <Input
                                 type="radio"
                                 name="radio5"
                                 value="Pagamento pendente"
                                 checked={status === 'Pagamento pendente'}
                                 onChange={handleOptionChange}
                              />
                              Pagamento pendente
                           </Label>
                        </FormGroup>
                     </Col>

                     <Col sm={1} md={12}>
                        <FormGroup>
                           <Label for="exampleText" sm={2}>Observação</Label>
                           <Col sm={12}>
                              <Input
                                 type="textarea"
                                 name="text"
                                 value={observacao}
                                 maxLength={1000}
                                 placeholder='Descreva um pouco sobre o chamado...'
                                 onChange={(e) => setObservacao(e.target.value)}

                              />
                           </Col>
                        </FormGroup>
                     </Col>


                  </Row>

                  <Button color="success" type='submit'>
                     {id ? 'Atualizar' : 'Criar chamado'}
                  </Button>

               </form>
            </div>
         </div>

      </div>
   );
}