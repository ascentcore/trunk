import produce from 'immer';

export const types = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
};

export const actions = {
    login: (email, password) => ({
        type: types.LOGIN,
        email,
        password,
    }),
    loginSuccess: response => ({
        type: types.LOGIN.success(),
        response,
    }),
    loginFailure: error => ({
        type: types.LOGIN.failure(),
        error,
    }),
};

const initialState = {
    isAuthenticated: window.localStorage.getItem('token') !== null,
    user: false,
    isLoggingIn: false,
};

const main = produce((draft, action) => {
    switch (action.type) {
        case types.LOGIN:
            draft.isLoggingIn = true;
            return;
        case types.LOGIN.success():
            const { data } = action.response;
            const { token } = data;
            window.localStorage.setItem('token', token);
            draft.isAuthenticated = true;
            draft.isLoggingIn = false;
            return;
        case types.LOGIN.failure():
            draft.isLoggingIn = false;
            return;

        default:
            return;
    }
}, initialState);

const getUser = state => state.user;
const isLoggingIn = state => state.user.isLoggingIn;
const isAuthenticated = state => state.user.isAuthenticated;

export const selectors = {
    getUser,
    isLoggingIn,
    isAuthenticated,
};

export default main;
