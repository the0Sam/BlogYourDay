import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Logout = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, [setUser]);

  return <Navigate to='/login' replace />;
};

export default Logout;
