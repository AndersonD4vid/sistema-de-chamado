import React, { useState, useContext } from 'react';
import '../Login/style.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';


export default function Cadastrar() {
   const [nome, setNome] = useState('');
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');

   const { cadastrar, loadingAuth } = useContext(AuthContext);

   async function handleSubmit(e) {
      e.preventDefault();
      if (nome !== '' && email !== '' && senha !== '') {
         cadastrar(nome, email, senha);
         setNome('');
         setEmail('');
         setSenha('');
         return;
      }
   }

   return (
      <div className='container'>
         <div className='containerLogin'>
            <h1>Criar uma conta</h1>
            <form onSubmit={handleSubmit}>
               <input
                  placeholder='Seu nome'
                  type='text' value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
               />
               <input
                  placeholder='E-mail'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
               <input
                  placeholder='Senha'
                  type='password'
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
               />
               <button type='submit' className='botao'>
                  {loadingAuth ? 'Carregando...' : 'Criar uma conta'}
               </button>
            </form>
            <Link to='/'>Entrar na conta</Link>
         </div>

      </div>
   );
}