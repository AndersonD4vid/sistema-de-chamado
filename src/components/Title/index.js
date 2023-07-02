import React from 'react';
import './style.css';

export default function Title({ children, name }) {
   return (
      <div className='headerTitle'>
         {children}
         <h1>{name}</h1>
      </div>
   );
}