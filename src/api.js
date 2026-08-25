import axios from 'axios';

export const API = (typeof process !== 'undefined' && process.env?.REACT_APP_BACKEND_URL)
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : '/api';

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

