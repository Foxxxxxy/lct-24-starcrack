import {useStore} from '@tanstack/react-store';
import {useEffect, useState} from 'react';
import {getCookie, setCookie} from 'react-use-cookie';

import {FetchGetTokenResult, fetchRefreshToken} from 'src/api/mutations';
import {useFetchUserMe} from 'src/api/routes';
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
// useFetchUserMe
export const useAuth = () => {
    const [isLoading, setIsloading] = useState(true);
    const {fetch} = useFetchUserMe();
    const user = useStore(store, (state) => state['user']);
    let refreshToken = getCookie('refreshToken');

    if (refreshToken && refreshToken.length && refreshToken !== 'undefined') {
        useEffect(() => {
            fetchRefreshToken({
                refresh_token: refreshToken,
            }).then((data) => {
                updateTokens(data);

                if (!user) {
                    fetch(data.access_token);
                }

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
