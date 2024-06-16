import axios from 'axios';

export const client = axios.create({
    // baseURL: 'http://localhost:8000',
    baseURL: 'https://starcrack.ru/api',
    headers: {
        'Content-type': 'application/json',
    },
});
