import {useMutation} from '@tanstack/react-query';
import {useEffect} from 'react';
import {fetchGetToken} from 'src/api/mutations';
import {updateTokens} from 'src/hooks/useAuth';

export const AuthPage = () => {
    const mutationGetToken = useMutation({
        mutationFn: fetchGetToken,
        onSuccess: (data) => {
            updateTokens(data);
        },
    });

    useEffect(() => {
        mutationGetToken.mutate({
            username: 'user_admin',
            password: '12345678',
        });
    }, []);
    return 'AUTH PAGE';
};
