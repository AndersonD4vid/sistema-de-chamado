import React, { useState, useContext } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function Login() {
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');

   const { login, loadingAuth } = useContext(AuthContext);

   function handleSubmit(e) {
      e.preventDefault();

      if (email !== '' && senha !== '') {
         login(email, senha);
         setEmail('');
         setSenha('');
      }
   }

   return (
      <div className='container'>
         <div className='containerLogin'>
            <h1>Entrar na conta</h1>
            <form onSubmit={handleSubmit}>
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
                  {loadingAuth ? 'Carregando...' : 'Entrar na conta'}
               </button>
            </form>
            <Link to='/cadastrar'>Criar uma conta</Link>
         </div>
      </div>
   );
}