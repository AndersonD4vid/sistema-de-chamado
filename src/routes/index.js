import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Cadastrar from '../pages/Cadastrar';
import Error from '../pages/Error';
import Dashboard from '../pages/Dashboard';
import Private from './private';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import NovoChamado from '../pages/Novo_Chamado';

export default function RoutesApp() {
   return (
      <Routes>
         <Route path='/' element={<Login />} />
         <Route path='/cadastrar' element={<Cadastrar />} />
         <Route path='/dashboard' element={<Private> <Dashboard /> </Private>} />
         <Route path='/profile' element={<Private> <Profile /> </Private>} />
         <Route path='/customers' element={<Private> <Customers /> </Private>} />
         <Route path='/novo-chamado' element={<Private> <NovoChamado /> </Private>} />
         <Route path='*' element={<Error />} />
      </Routes>
   );
}