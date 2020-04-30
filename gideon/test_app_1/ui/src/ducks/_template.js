import produce from 'immer';

export const types = {
    GET_SOMETHING: 'GET_SOMETHING',
};

export const actions = {
    getSomething: () => ({
        type: types.GET_SOMETHING,
    }),
    getSomethingSuccess: response => ({
        type: types.GET_SOMETHING.success(),
        response,
    }),
    getSomethingFailure: error => ({
        type: types.GET_SOMETHING.failure(),
        error,
    }),
};

const initialState = {
    something: false,
};

const main = produce((draft, action) => {
    switch (action.type) {
        case types.GET_SOMETHING.success():
            draft.something = action.response;
            return;

        default:
            return;
    }
}, initialState);

const getSomething = state => state.something;

export const selectors = {
    getSomething,
};

export default main;
