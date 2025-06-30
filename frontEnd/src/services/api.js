import axios from 'axios';
import Cookies from 'js-cookie';

// Create a central Axios instance
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 15000,
  withCredentials: true,     
});

// Response interceptor: handle common errors
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
        Cookies.remove('salonToken');
    }
    return Promise.reject(err);
  }
);

export default API;
