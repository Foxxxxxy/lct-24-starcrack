import axios from 'axios';

export const client = axios.create({
    baseURL: 'https://starcrack.ru/',
    headers: {
        'Content-type': 'application/json',
    },
});
