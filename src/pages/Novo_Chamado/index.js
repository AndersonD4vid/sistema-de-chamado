import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiClipboard } from "react-icons/fi";
import { Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { db } from '../../services/conexaoFirebase';
import { collection, getDocs, getDoc, doc, addDoc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';


const listRef = collection(db, "clientes");

export default function NovoChamado() {
   const { user } = useContext(AuthContext);

   const [clientes, setClientes] = useState([]);
   const [loadingCliente, setLoadingCliente] = useState(true);
   const [clienteSelected, setClienteSelected] = useState(0);

   const [observacao, setObservacao] = useState('');
   const [assunto, setAssunto] = useState('Suporte');
   const [status, setStatus] = useState('Aberto');


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

            }).catch((error) => {
               console.log('Erro ao buscar os clientes', error);
               loadingCliente(false);
               setClientes([{ id: 1, nomeFantasia: 'Empresa Teste' }]);
            })
      }

      setLoadingClientes();
   }, [])

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
         }).catch((error) => {
            toast.error('Erro: Algo deu errado! Tente mais tarde!', error);
         })
   }


   return (
      <div className='content'>
         <Header />
         <div className='contentDash'>
            <Title name="Novo chamado">
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
                                 value="Aguardando pagamento"
                                 checked={status === 'Aguardando pagamento'}
                                 onChange={handleOptionChange}
                              />
                              Aguardando pagamento
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
                                 placeholder='Descreva um pouco sobre o chamado...'
                                 onChange={(e) => setObservacao(e.target.value)}

                              />
                           </Col>
                        </FormGroup>
                     </Col>


                  </Row>

                  <Button color="success" type='submit'>
                     Criar chamado
                  </Button>

               </form>
            </div>
         </div>

      </div>
   );
}