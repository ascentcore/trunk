import { call, put, all } from 'redux-saga/effects';

import { templateActions } from 'ducks';

export function* getSomething(action) {
    try {
        yield put(templateActions.receiveSomthing(action.response));
    } catch (e) {}
}
