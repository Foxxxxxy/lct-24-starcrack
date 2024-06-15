import {useEffect, useState} from 'react';
import {getCookie, setCookie} from 'react-use-cookie';

import {FetchGetTokenResult, fetchRefreshToken} from 'src/api/mutations';
import {router} from 'src/main';
import {store} from 'src/store/state';

export const updateTokens = (data: FetchGetTokenResult) => {
    store.setState((state) => {
        return {
            ...state,
            access_token: data.access_token,
        };
    });
    if (data.refresh_token) {
        setCookie('refreshToken', data.refresh_token);
    }
};

export const useAuth = () => {
    const [isLoading, setIsloading] = useState(true);
    let refreshToken = getCookie('refreshToken');

    if (refreshToken && refreshToken.length && refreshToken !== 'undefined') {
        useEffect(() => {
            fetchRefreshToken({
                refresh_token: refreshToken,
            }).then((data) => {
                updateTokens(data);
                setIsloading(false);
            });
        }, []);
    } else {
        router.navigate('/auth', {replace: false});
        setIsloading(false);
    }

    return {
        isLoading,
    };
};
