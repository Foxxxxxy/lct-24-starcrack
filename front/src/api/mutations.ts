import axios from 'axios';

const client = axios.create({
    baseURL: 'https://starcrack.ru',
});

export type FetchGetTokenResult = {
    access_token: string;
    level: string;
    refresh_token: string;
    token_type: 'bearer';
    user_id: number;
};

export const fetchGetToken = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}): Promise<FetchGetTokenResult> => {
    const res = await client.post(
        `/user/get_token`,
        {
            username,
            password,
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    );
    return res.data;
};

export const fetchRefreshToken = async ({refresh_token}: {refresh_token: string}) => {
    const res = await client.post(`/user/refresh_token?refresh_token=${refresh_token}`);
    return res.data;
};

export const fetchSignUp = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}): Promise<FetchGetTokenResult> => {
    const res = await client.post(
        `/user/get_token`,
        {
            username,
            password,
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    );
    return res.data;
};
