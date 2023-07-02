import React, { useEffect, useState } from 'react';
import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiClipboard, FiEdit, FiMaximize2, FiTrash } from "react-icons/fi";
import { Button, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { db } from '../../services/conexaoFirebase';
import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore';
import { format } from 'date-fns';

const listRef = collection(db, "chamados");

export default function Dashboard() {
   const [chamados, setChamados] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isEmpty, setIsEmpty] = useState(false);

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

         setChamados(chamados => [...chamados, ...lista]);
      } else {
         setIsEmpty(true);
      }
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

            <div className='areaBotao'>
               <Link to="/novo-chamado">
                  <Button color="success">
                     Cadastrar novo chamado
                  </Button>
               </Link>
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
                     <h4>5 Últimos chamados</h4>
                     {chamados.map((item, index) => {
                        return (
                           <div key={index} className='itemChamado'>
                              <Row className='row'>
                                 <Col xs={12} sm={1} md={2} className='Col'>
                                    <div className='tabela'>
                                       <strong>#</strong>
                                       <span></span>
                                    </div>
                                 </Col>

                                 <Col xs={12} sm={4} md={2} className='Col'>
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
                                       <span className='badge' style={{ backgroundColor: '#157347', padding: 5, }}>{item.status}</span>
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
                                          <Button color="primary" className=''>
                                             <FiMaximize2 size={20} />
                                          </Button>
                                          <Button color="success" className=''>
                                             <FiEdit size={20} />
                                          </Button>
                                          <Button color="danger" className=''>
                                             <FiTrash size={20} />
                                          </Button>
                                       </div>
                                    </div>

                                 </Col>
                              </Row>
                           </div>
                        );
                     })}
                  </div>
               )
            }
         </div>

      </div>
   );
}