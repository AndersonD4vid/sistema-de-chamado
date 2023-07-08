import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiClipboard, FiEdit, FiMaximize2, FiTrash } from "react-icons/fi";
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { db } from '../../services/conexaoFirebase';
import firebase from '../../services/conexaoFirebase';
import { collection, getDocs, doc, orderBy, limit, startAfter, query, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ModalDetalhes from '../../components/Modal';

const listRef = collection(db, "chamados");


export default function Dashboard() {
   const [chamados, setChamados] = useState([]);
   const [loading, setLoading] = useState(true);

   const [modal, setModal] = useState(false);
   const [modalRemove, setModalRemove] = useState(false);
   const [detalhes, setDetalhes] = useState();

   const [isEmpty, setIsEmpty] = useState(false);
   const [lastDocs, setLastDocs] = useState();
   const [loadingMore, setLoadingMore] = useState(false);

   const [showBotao, setShowBotao] = useState(false);


   useEffect(() => {
      async function loadChamados() {
         const q = query(listRef, orderBy('created', 'desc'), limit(5)); // busca os 5 ultimos itens cadastrado

         const querySnapshot = await getDocs(q);
         setChamados([]);

         await updateState(querySnapshot);

         setLoading(false);
      }
      loadChamados();
      return () => { }
   }, [])

   async function updateState(querySnapshot) {
      const isCollectionEmpty = querySnapshot.size === 0;

      if (!isCollectionEmpty) {
         let lista = [];

         querySnapshot.forEach((doc) => {
            lista.push({
               id: doc.id,
               cliente: doc.data().cliente,
               clienteID: doc.data().clienteID,
               assunto: doc.data().assunto,
               status: doc.data().status,
               created: doc.data().created,
               createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
               observacao: doc.data().observacao,
            })
         })

         // Acessando todos os documentos
         const lastDocs = querySnapshot.docs[querySnapshot.docs.length - 1]; // Pegando o ultimo item
         setLastDocs(lastDocs);

         setChamados(chamados => [...chamados, ...lista]);


      } else {
         setIsEmpty(true);
      }
      setLoadingMore(false);
   }


   async function handleMore() {
      setLoadingMore(true);


      // Devolve mais 5 itens após o ultimo item da lista
      const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
      // Fazendo a requisição
      const querySnapshot = await getDocs(q);
      await updateState(querySnapshot);

   }


   function toggleModal(item) {
      setModal(!modal);
      setDetalhes(item);
   }

   function toggleBotao() {
      setShowBotao(!showBotao);
   }


   async function deletarChamado(item) {
      const docRef = doc(db, 'chamados', item.id);
      await deleteDoc(docRef).then(() => {
         toast.success('Sucesso: Chamado deletado!');
         setTimeout(() => {
            window.location.reload();
         }, 500);
      }).catch((error) => {
         toast.error('Erro: Algo deu errado! Tente mais tarde!', error);
      })

   }



   if (loading) {
      return (
         <div className='content'>
            <Header />
            <div className='contentDash'>
               <h3>Buscando chamados...</h3>
            </div>
         </div>
      );
   }

   return (
      <div className='content'>
         <Header />
         <div className='contentDash'>
            <Title name="Chamados">
               <FiClipboard color='#333' size={24} />
            </Title>

            <div className='areaBotao' style={{ display: 'flex', gap: 15 }}>
               <Link to="/novo-chamado">
                  <Button color="success">
                     Cadastrar novo chamado
                  </Button>
               </Link>

               <Button color="danger" onClick={toggleBotao}>
                  {showBotao ? 'Desativar deletar chamado' : 'Ativar deletar chamado'}
               </Button>
            </div>


            {chamados.length === 0 ?
               (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                     <strong>Nenhum chamado encontrado...</strong>
                  </div>
               )

               :
               (
                  <div className='areaTabela'>
                     <h4>{chamados.length} Chamados</h4>
                     {chamados.map((item, index) => {
                        return (
                           <div key={index} className='itemChamado'>
                              <Row className='row' style={{ margin: '0 auto' }}>

                                 <Col xs={12} sm={4} md={4} className='Col'>
                                    <div className='tabela'>
                                       <strong>Cliente</strong>
                                       <span>{item.cliente}</span>
                                    </div>
                                 </Col>

                                 <Col xs={12} sm={4} md={2} className='Col'>
                                    <div className='tabela'>
                                       <strong>Assunto</strong>
                                       <span>{item.assunto}</span>
                                    </div>
                                 </Col>

                                 <Col xs={12} sm={4} md={2} className='Col'>
                                    <div className='tabela'>
                                       <strong>Status</strong>
                                       <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#157347' : '#999' }}>{item.status}</span>
                                    </div>
                                 </Col>

                                 <Col xs={12} sm={4} md={2} className='Col'>
                                    <div className='tabela'>
                                       <strong>Cadastrado em</strong>
                                       <span>{item.createdFormat}</span>
                                    </div>
                                 </Col>

                                 <Col xs={12} sm={4} md={2} className='Col'>
                                    <div className='tabela'>
                                       <div className='botoes'>
                                          <button className='botaoTabela botaoPrimary' onClick={() => toggleModal(item)}>
                                             <FiMaximize2 size={20} />
                                          </button>
                                          <Link to={`/novo-chamado/${item.id}`}>
                                             <button className='botaoTabela botaoSuccess'>
                                                <FiEdit size={20} />
                                             </button>
                                          </Link>

                                          {showBotao ?
                                             (
                                             <button className='botaoTabela botaoDanger' onClick={() => deletarChamado(item)}>
                                                   <FiTrash size={20} />
                                             </button>
                                             )
                                             :
                                             (
                                                <div> </div>
                                             )
                                          }

                                       </div>
                                    </div>

                                 </Col>
                              </Row>
                           </div>
                        );
                     })}

                     {loadingMore && <h3>Buscando mais chamados...</h3>}
                     {!loadingMore && !isEmpty &&
                        <Button color="secondary" onClick={handleMore}>
                           Buscar +
                        </Button>}
                  </div>
               )
            }
         </div>

         {/* Ver mais detalhes */}
         <Modal isOpen={modal} toggle={toggleModal} size='lg' fade={false}>
            <ModalHeader toggle={toggleModal}>Informações do chamado</ModalHeader>
            <ModalBody>
               <ModalDetalhes conteudo={detalhes} />
            </ModalBody>
            <ModalFooter>
               <Button color="primary" onClick={toggleModal}>
                  Fechar
               </Button>

            </ModalFooter>
         </Modal>


      </div >
   );
}