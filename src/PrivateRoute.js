import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const receptionToken = localStorage.getItem('receptionistToken');
  const adminToken = localStorage.getItem('adminToken');
  const hrToken = localStorage.getItem('hrToken');
  const accountantToken = localStorage.getItem('accountantToken');

  const isAuthenticated = receptionToken || adminToken || hrToken || accountantToken;

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/reception-login" />
        )
      }
    />
  );
};

export default PrivateRoute;
