import {useStore} from '@tanstack/react-store';
import {useCallback, useEffect, useState} from 'react';
import {store} from 'src/store/state';
import {MetroStation, Passenger, Request, RequestItem} from 'src/types';

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
        if (!name) {
            return;
        }
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

export const useFetchCreatePassenger = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Passenger) => {
            return client.post(
                `/passenger/`,
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

export const useFetchRequests = ({
    limit,
    offset,
}: {
    limit: number;
    offset: number;
}): {
    requests: RequestItem[] | undefined;
    refetch: () => void;
} => {
    const [requests, setRequests] = useState<RequestItem[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(() => {
        return client
            .get<RequestItem[]>(`/requisitions/?limit=${limit}&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setRequests(res.data));
    }, [limit, offset, token]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        requests,
        refetch: fetch,
    };
};

export const useFetchRequestById = (id: string | null): RequestItem | undefined => {
    const [request, setRequest] = useState<RequestItem | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!id) {
            return;
        }
        client
            .get<RequestItem>(`/requisitions/id?req_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setRequest(res.data));
    }, [id, token]);

    return request;
};

export const useFetchPassengerById = (id: number | string): Passenger | undefined => {
    const [passenger, setPassenger] = useState<Passenger | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!id) {
            return;
        }
        client
            .get<Passenger>(`/passenger/id?pas_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setPassenger(res.data));
    }, [id, token]);

    return passenger;
};

export const useFetchDeleteRequest = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (id: string | number) => {
            return client.delete(`/requisitions/?requisition_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        [token],
    );

    return {
        fetch,
    };
};

export const useFetchUpdateRequest = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Request) => {
            return client.post(
                `/requisitions/update`,
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

export const useFetchRemovePassenger = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (id: string | number) => {
            return client.delete(`/passenger/?passanger_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        [token],
    );

    return {
        fetch,
    };
};

export const useFetchUpdatePassenger = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Passenger) => {
            return client.post(
                `/passenger/update`,
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
