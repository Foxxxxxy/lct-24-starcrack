import {useStore} from '@tanstack/react-store';
import {store} from 'src/store/state';
import {PassengersCategories} from 'src/types';
type FetchPassengersResult = {
    id: number;
    passenger_category: PassengersCategories;
    name: string;
    phone: string;
};

type MetroStation = {
    id: number;
    name: string;
};

import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {client} from './api';

export const useApiGet = (key, fn, options) =>
    useQuery({
        queryKey: key,
        queryFn: fn,
        ...options,
    });

export const fetchPassenger = async ({name}: {name: string}): Promise<FetchPassengersResult[]> => {
    const token = useStore(store, (state) => state['access_token']);

    const res = await client.get<FetchPassengersResult[]>(`/passenger/suggestions/?name=${name}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
    return Promise.resolve([]);
    return Promise.resolve([
        {
            id: 32133,
            passenger_category: 'ИЗ',
            name: 'Вася',
            phone: '+79027035052',
        },
        {
            id: 423,
            passenger_category: 'ИЗ',
            name: 'Вася',
            phone: '+79027035052',
        },
        {
            id: 123,
            passenger_category: 'ИЗ',
            name: 'Вася',
            phone: '+79027035052',
        },
        {
            id: 321233,
            passenger_category: 'ИЗ',
            name: 'Вася',
            phone: '+79027035052',
        },
        {
            id: 324133,
            passenger_category: 'ИЗ',
            name: 'Вася',
            phone: '+79027035052',
        },
        {
            id: 321533,
            passenger_category: 'ИЗ',
            name: 'Вася',
            phone: '+79027035052',
        },
    ]);
};

type FetchMetroStationsResult = MetroStation[];

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
            .then((data) => setMetro(data));
    }, []);

    return metro;
};

export type Passenger = {
    id: number | string;
    passenger_category: PassengersCategories;
    name: string;
    phone: string;
};

type FetchPassengerByIdResult = Promise<Passenger>;

export const fetchPassengerById = (id: string): FetchPassengerByIdResult => {
    return Promise.resolve({
        id: 123,
        passenger_category: 'ИЗ',
        name: 'Василий чорт',
        phone: '+79027035052',
    });

    return client.get<FetchPassengerByIdResult>(`/passenger/${id}`).then((res) => res.data);
};
