import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const receptionToken = localStorage.getItem('receptionToken'); // Replace with your actual token key

  return (
    <Route
      {...rest}
      render={props =>
        receptionToken ? (
          <Component {...props} />
        ) : (
          <Redirect to="/reception-login" />
        )
      }
    />
  );
};

export default PrivateRoute;
