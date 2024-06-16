import {Store} from '@tanstack/store';
import {User} from 'src/types';

export const store = new Store<{
    access_token: string | null;
    user: User | null;
}>({
    access_token: null,
    user: null,
});
