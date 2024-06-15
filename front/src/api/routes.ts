import {useStore} from '@tanstack/react-store';
import {useCallback, useEffect, useState} from 'react';
import {store} from 'src/store/state';
import {MetroStation, Passenger, Request} from 'src/types';

import {client} from './api';

export const useFetchMetroStations = (name: string): MetroStation[] | undefined => {
    const [metro, setMetro] = useState<MetroStation[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);
    useEffect(() => {
        client
            .get<MetroStation[]>(`/metro_stations/suggestions/?name=${name}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setMetro(res.data));
    }, [name, token]);

    return metro;
};

export const useFetchPassengerSuggestion = (name: string): Passenger[] | undefined => {
    const [passengers, setPassengers] = useState<Passenger[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);
    useEffect(() => {
        console.log(name);
        client
            .get<Passenger[]>(`/passenger/suggestions/?name=${name}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setPassengers(res.data));
    }, [name, token]);

    return passengers;
};

export const useFetchCreateRequest = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Request) => {
            client.post(
                `/requisitions/`,
                {
                    ...request,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
        },
        [token],
    );

    return {
        fetch,
    };
};
