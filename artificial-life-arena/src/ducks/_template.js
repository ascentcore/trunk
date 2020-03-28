import produce from 'immer';
import popconfig from '../arena/popconfig';
export const types = {
    GET_SOMETHING: 'GET_SOMETHING',
    GET_SOMETHING_SUCCESS: 'GET_SOMETHING_SUCCESS',
    GET_SOMETHING_FAILURE: 'GET_SOMETHING_FAILURE',
};

export const actions = {
    getSomething: () => ({
        type: types.GET_SOMETHING,
    }),
    getSomethingSuccess: response => ({
        type: types.GET_SOMETHING_SUCCESS,
        response,
    }),
    getSomethingFailure: error => ({
        type: types.GET_SOMETHING_FAILURE,
        error,
    }),
};

const initialState = Object.assign({iterations: 0}, popconfig);

const main = produce((draft, action) => {
    switch (action.type) {
        case types.GET_SOMETHING_SUCCESS:
            draft.something = action.response;
            return;

        default:
            return;
    }
}, initialState);

const getSeed = state => state._template.seed;
const getPopulations = state => state._template.populations;
const getIterations = state => state._template.iterations;

export const selectors = {
    getSeed,
    getPopulations,
    getIterations
};

export default main;
