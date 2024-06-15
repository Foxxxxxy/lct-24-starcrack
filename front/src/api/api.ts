import axios from 'axios';

export const client = axios.create({
    // baseURL: 'http://localhost:8000',
    baseURL: 'https://starcrack.ru',
    headers: {
        'Content-type': 'application/json',
    },
});
