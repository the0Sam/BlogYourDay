import React from 'react'
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Login from './components/login';
import Singup from './components/singup';
import Homepage from './components/homepage';
import { UserProvider } from './UserContext';
import Profile from './components/profile';
import VlogPage from './components/vlogPage';
import Logout from './components/logout';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='*' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Singup />} />
          <Route path='/home' element={<Homepage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/vlogpage/:vlogId' element={<VlogPage />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
