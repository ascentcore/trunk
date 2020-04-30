import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { PrivateRoute } from 'common';

// import { About, Contact } from 'components';
import { Login } from 'components/User';
// import Dashboard from 'components/Dashboard';

const Logout = () => 'Logout page';
const Dashboard = () => 'Dashboard page';
const About = () => 'About page';
const Contact = () => 'Contact page';

function Routes() {
    return (
        <Switch>
            <Route path="/login">
                <Login />
            </Route>
            <PrivateRoute path="/logout">
                <Logout />
            </PrivateRoute>

            <PrivateRoute path="/dashboard">
                <Dashboard />
            </PrivateRoute>

            <Route path="/about">
                <About />
            </Route>
            <Route path="/contact">
                <Contact />
            </Route>

            <Redirect to="/dashboard" />
        </Switch>
    );
}

export default Routes;
