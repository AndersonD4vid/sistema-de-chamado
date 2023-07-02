import React, { useContext } from 'react';
import './style.css';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import { FiClipboard, FiUser, FiSettings } from "react-icons/fi";
import avatarImg from '../../assets/avatar.jpg';
import backgroundImg from '../../assets/background.png';

export default function Header() {
   const { logOut, user } = useContext(AuthContext);

   function desconectar() {
      logOut();
   }

   return (
      <header className='header'>
         <div className='containerAvatar'>
            <div className='overlay'></div>
            <img
               src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt='Foto de perfil'
               className='avatar'
            />
         </div>

         <nav className='navegacao'>
            <Link to="/dashboard">
               <FiClipboard color='#fff' />
               Chamados
            </Link>

            <Link to="/customers">
               <FiUser color='#fff' />
               Clientes
            </Link>

            <Link to="/profile">
               <FiSettings color='#fff' />
               Perfil
            </Link>
         </nav>

         <div style={{
            justifyContent: 'center',
            display: 'flex',
            marginTop: '40px',
         }}>
            <button onClick={desconectar} className='botaoDesconectar'>
               Desconectar
            </button>
         </div>
      </header>
   );
}