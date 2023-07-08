import React, { useEffect, useState } from 'react';
import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiClipboard } from "react-icons/fi";
import { db } from '../../services/conexaoFirebase';
import { collection, getDocs } from 'firebase/firestore';

const listRef = collection(db, "clientes");

export default function RegisteredCustomers() {
   const [clientes, setClientes] = useState([]);
   const [loadingCliente, setLoadingCliente] = useState(true);


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
               setClientes(lista);
               setLoadingCliente(false);


            }).catch((error) => {
               console.log('Erro ao buscar os clientes', error);
               loadingCliente(false);
            })
      }
      setLoadingClientes();
   }, [loadingCliente])


   if (loadingCliente) {
      return (
         <div className='content'>
            <Header />
            <div className='contentDash'>
               <h3>Buscando clientes...</h3>
            </div>
         </div>
      );
   }

   return (
      <div className='content'>
         <Header />
         <div className='contentDash'>
            <Title name="Clientes cadastrados">
               <FiClipboard color='#333' size={24} />
            </Title>


            {/* Listando clientes */}
            <div className='cardCliente'>
               {clientes.map((item, index) => {
                  return (
                     <div key={index} className='card'>
                        <ul>
                           <li>Cliente: <span>{item.nomeFantasia}</span></li>
                           <li>E-mail: <span>{item.email}</span></li>
                           <li>Telefone: <span>{item.telefone}</span></li>
                           <li>CNPJ: <span>{item.cnpj}</span></li>
                           <li>Endereço: <span>{item.endereco}</span></li>
                        </ul>
                     </div>
                  );
               })}
            </div>

         </div>



      </div >
   );
}