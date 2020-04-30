import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';

import { userActions, userSelectors } from 'ducks';

function CheckSession() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(userSelectors.isAuthenticated);

    const location = useLocation();

    if (isAuthenticated) {
        const from = get(location, 'state.from', { pathname: '/dashboard' });
        return <Redirect to={from} />;
    }
    return null;
}

export default CheckSession;
