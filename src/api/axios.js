import axios from 'axios';
import BASE_URL from './api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
