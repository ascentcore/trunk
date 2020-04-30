import { call, put } from 'redux-saga/effects';
import * as userApi from 'api/user';
import { uiActions, userActions } from 'ducks';

export function* login({ email, password }) {
    const payload = {
        email,
        password,
    };

    try {
        const response = yield call(userApi.login, payload);
        yield put(userActions.loginSuccess(response));
        yield put(uiActions.pushNotificationSuccess('Login successful.'));
    } catch (error) {
        yield put(userActions.loginFailure(error));
        console.error(error);
    }
}

export function* logout() {
    try {
        yield call(userApi.logout);
        yield put(userActions.logoutSuccess());
    } catch (error) {
        console.error(error);
    }
}
