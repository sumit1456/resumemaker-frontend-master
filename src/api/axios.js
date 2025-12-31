import axios from 'axios';

const API_BASE_URL = 'https://resumemaker-1.onrender.com';
const API_BASE_URL2 = 'http://localhost:8080'; // For local development

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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
