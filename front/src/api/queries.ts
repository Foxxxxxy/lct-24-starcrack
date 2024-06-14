import axios from 'axios';
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

const client = axios.create({
    baseURL: 'https://httpbin.org',
});

export const fetchPassenger = (name: string): Promise<FetchPassengersResult[]> => {
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
    return client
        .get<FetchPassengersResult[]>(`/passenger/suggestions/?name=${name}`)
        .then((res) => res.data);
};

type FetchMetroStationsResult = Promise<MetroStation[]>;

export const fetchMetroStations = (name: string): FetchMetroStationsResult => {
    return Promise.resolve([
        {
            id: 233,
            name: 'Алтуфьево',
        },
        {
            id: 232,
            name: 'Бибирево',
        },
        {
            id: 231,
            name: 'Алтуфьево',
        },
        {
            id: 230,
            name: 'Алтуфьево',
        },
        {
            id: 235,
            name: 'Алтуфьево',
        },
    ]);
    return client
        .get<FetchMetroStationsResult>(`/metro_stations/suggestions/?name=${name}`)
        .then((res) => res.data);
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
