import {Store} from '@tanstack/store';

export const store = new Store<{
    access_token: string | null;
}>({
    access_token: null,
});
