import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userSelectors } from 'ducks';

function PrivateRoute({ children, ...rest }) {
    const isAuthenticated = useSelector(userSelectors.isAuthenticated);
    const location = useLocation();

    return isAuthenticated ? (
        <Route {...rest}>{children}</Route>
    ) : (
        <Redirect
            to={{
                pathname: '/login',
                state: location.pathname !== '/logout' ? { from: location } : undefined,
            }}
        />
    );
}
export default PrivateRoute;
