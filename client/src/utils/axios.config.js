import axios from 'axios';

const customFetch = axios.create({
  baseURL: 'http://localhost:3002',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default customFetch;
