import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
}

api.interceptors.request.use(config => {
    config.headers['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN');
    return config;
});

export const csrfCookie = () => axios.get('http://localhost:8000/sanctum/csrf-cookie', {
  withCredentials: true,
});

export default api;