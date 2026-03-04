import axios from 'axios';
import Cookies from 'js-cookie';

const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005',
});

authApi.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optionally handle global 401s here
        return Promise.reject(error);
    }
);

export default authApi;
