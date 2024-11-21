import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://your-api-url.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
