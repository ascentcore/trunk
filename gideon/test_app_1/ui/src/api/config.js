import axios from 'axios';

import { uiActions } from 'ducks';
import get from 'lodash/get';

// export const API_BASE = 'https://example.com';
export const API_BASE = '';

export function configureAxios({ dispatch }) {
    axios.defaults.baseURL = API_BASE;
    /*
    axios.interceptors.request.use(
        opt => {
            opt.transformRequest = [
                function(data, headers) {
                    // Set a token in header before request
                    // Change data if needed

                    // if (data !== undefined && data !== null) {
                    //     const formData = new FormData();
                    //     for (let [key, value] of Object.entries(data)) {
                    //         if (typeof value === 'object') {
                    //             formData.append(key, JSON.stringify(value));
                    //         } else {
                    //             formData.append(key, value);
                    //         }
                    //     }

                    //     return formData;
                    // }

                    return data;
                },
            ];
            return opt;
        },
        error => Promise.reject(error),
    );
    axios.interceptors.response.use(
        response => response.data,
        error => {
            // Handle logout when HTTP 401

            // const isLoggingIn = error.config.url === '/login';
            // if (error.config && error.response && error.response.status === 401 && !isLoggingIn) {
            //     dispatch(userActions.logout());
            // }

            handleErrors(error, dispatch);

            return Promise.reject(error);
        },
    );
    */
}

export function handleErrors(error, dispatch) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        // const { data, status, headers } = error.response;
        // console.log(data, status, headers);
        const url = get(error, 'response.config.url', '');
        if (url.indexOf('.json') < 0) {
            const message = get(error, 'response.data.message', false);
            if (message) dispatch(uiActions.pushNotificationError(message));
        }

        return;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error: ', error.message);
    }

    dispatch(uiActions.pushNotificationError('Something went wrong.'));
}
