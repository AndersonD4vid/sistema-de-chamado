import React, { useContext, useState } from 'react';
import '../../components/Header';
import './style.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from "react-icons/fi";
//import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/conexaoFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Customers() {
   //const { } = useContext(AuthContext);

   const [nome, setNome] = useState('');
   const [email, setEmail] = useState('');
   const [telefone, setTelefone] = useState('');
   const [cnpj, setCnpj] = useState('');
   const [endereco, setEndereco] = useState('');


   async function handleSubmit(e) {
      e.preventDefault();

      if (nome !== '' && email !== '' && telefone !== '' && cnpj !== '' && endereco !== '') {
         await addDoc(collection(db, "clientes"), {
            nomeFantasia: nome,
            email: email,
            telefone: telefone,
            cnpj: cnpj,
            endereco: endereco
         }).then(() => {
            toast.success('Sucesso: Cliente cadastrado!');
            setNome('');
            setEmail('');
            setTelefone('');
            setCnpj('');
            setEndereco('');
         }).catch((error) => {
            console.log(error)
            toast.error('Erro: Algo deu errado!')
         })
      } else {
         toast.error('Erro: Preencher todos os campos!')
      }
   }

   return (
      <div className='content'>
         <Header />
         <div className='contentDash'>
            <Title name="Novo cliente">
               <FiUser color='#333' size={24} />
            </Title>

            <div className='areaClientes'>
               <form onSubmit={handleSubmit}>
                  <div className='areaForm'>
                     <label>Nome da empresa ou cliente</label>
                     <input
                        type='text'
                        value={nome}
                        placeholder='Nome fantasia ou cliente'
                        maxLength={40}
                        minLength={4}
                        onChange={(e) => setNome(e.target.value)}
                     />

                     <label>E-mail</label>
                     <input
                        type='email'
                        value={email}
                        placeholder='E-mail'
                        maxLength={40}
                        onChange={(e) => setEmail(e.target.value)}
                     />


                     <label>Telefone</label>
                     <input
                        type='tel'
                        value={telefone}
                        placeholder='Seu telefone/celular'
                        maxLength={11}
                        minLength={8}
                        onChange={(e) => setTelefone(e.target.value)}
                     />

                     <label>CNPJ</label>
                     <input
                        type='text'
                        value={cnpj}
                        maxLength={14}
                        minLength={14}
                        placeholder='CNPJ apenas números'
                        onChange={(e) => setCnpj(e.target.value)}
                     />

                     <label>Endereço da empresa</label>
                     <input
                        type='text'
                        value={endereco}
                        placeholder='Digite o endereço'
                        maxLength={150}
                        onChange={(e) => setEndereco(e.target.value)}
                     />

                     <button type='submit' className='botao'>Cadastrar</button>
                  </div>
               </form>
            </div>


         </div>

      </div>
   );
}