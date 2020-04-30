import axios from 'axios';

export const login = payload => {
    console.log(payload);
    return axios.post('/v1/auth/login', payload);
};
export const logout = () => axios.post('/v1/auth/logout');
// export const getUser = user_id => axios.get('/users', { params: { user_id } });
