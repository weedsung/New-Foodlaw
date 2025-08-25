import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://foodlaw-production-e1f3.up.railway.app/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
