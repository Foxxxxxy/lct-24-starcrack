import {useStore} from '@tanstack/react-store';
import {useCallback, useEffect, useState} from 'react';
import {store} from 'src/store/state';
import {
    Employer,
    MetroStation,
    Passenger,
    Request,
    RequestItem,
    RequestStatus,
    Shift,
    User,
} from 'src/types';

import {RequestShedule} from 'src/pages/GantPage';
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
            return client.post<{id: number}>(
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

export const useFetchShiftById = (id: string | null): Shift | undefined => {
    const [shift, setShift] = useState<Shift | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!id) {
            return;
        }
        client
            .get<Shift>(`/shifts/id?shift_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setShift(res.data));
    }, [id, token]);

    return shift;
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

export const useFetchEmployeeById = (id: number | string): Employer | undefined => {
    const [employee, setEmployee] = useState<Employer | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!id) {
            return;
        }
        client
            .get<Employer>(`/employee/id?emp_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setEmployee(res.data));
    }, [id, token]);

    return employee;
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

export const useFetchUpdateShift = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Shift) => {
            return client.post(
                `/shifts/update`,
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

export const useFetchRemoveShift = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (id: string | number) => {
            return client.delete(`/shifts/?shift_id=${id}`, {
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

export const useFetchRemoveEmployee = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (id: string | number) => {
            return client.delete(`/employee/?employee_id=${id}`, {
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

export const useFetchUpdateEmployee = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Employer) => {
            return client.post(
                `/employee/update`,
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

export const useFetchMetroRoute = ({from, to}: {from: string; to: string}) => {
    const [metroRoute, setMetro] = useState<
        | {
              path: string[];
              eta: number;
          }
        | undefined
    >();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!from || !to) {
            return;
        }
        client
            .get<{path: string[]; eta: number}>(
                `/routes/?start_station_name=${from}&end_station_name=${to}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((res) => setMetro(res.data))
            .catch(() => {});
    }, [from, to, token, setMetro]);

    return metroRoute;
};

export const useFetchUpdateStatus = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: {id: number; new_status: RequestStatus}) => {
            return client.put(
                `/requisitions/update-status?id=${request.id}&new_status=${request.new_status}`,
                {},
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

export const useFetchCreateShift = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Shift) => {
            return client.post(`/shifts/`, request, {
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

export const useFetchShiftsByDate = ({
    date_start,
    date_end,
    limit,
    offset,
}: {
    date_start: string;
    date_end: string;
    limit: number;
    offset: number;
}): Shift[] | undefined => {
    const [shifts, setShifts] = useState<Shift[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!date_start || !date_end) {
            return;
        }
        client
            .get<Shift[]>(
                `/passenger/id?date_start=${date_start}&date_end=${date_end}&limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((res) => setShifts(res.data));
    }, [date_start, date_end, limit, offset, token]);

    return shifts;
};

export const useFetchShiftsByEmployee = ({
    employee_id,
    limit,
    offset,
}: {
    employee_id: string | number;
    limit: number;
    offset: number;
}): Shift[] | undefined => {
    const [shifts, setShifts] = useState<Shift[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!employee_id) {
            return;
        }
        client
            .get<Shift[]>(
                `/shifts/employee?employee_id=${employee_id}&limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((res) => setShifts(res.data));
    }, [employee_id, limit, offset, token]);

    return shifts;
};

export const useFetchShifts = ({
    limit,
    offset,
}: {
    limit: number;
    offset: number;
}): Shift[] | undefined => {
    const [shifts, setShifts] = useState<Shift[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        client
            .post<Shift[]>(
                `/shifts/filtered?limit=${limit}&offset=${offset}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((res) => setShifts(res.data));
    }, [limit, offset, token]);

    return shifts;
};

export const useFetchShiftsByDay = ({
    day,
    limit,
    offset,
}: {
    day: string | number;
    limit: number;
    offset: number;
}): Shift[] | undefined => {
    const [shifts, setShifts] = useState<Shift[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    useEffect(() => {
        if (!day) {
            return;
        }
        client
            .get<Shift[]>(`/passenger/id?day=${day}&limit=${limit}&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setShifts(res.data));
    }, [day, limit, offset, token]);

    return shifts;
};

export const useFetchSheduledRequest = (
    date: string,
): {
    requests: RequestShedule[] | undefined;
    refetch: () => void;
} => {
    const [requests, setRequests] = useState<RequestShedule[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(() => {
        if (!date) {
            return;
        }
        return client
            .get<RequestShedule[]>(`/requisitions/scheduled?date=${date}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setRequests(res.data))
            .catch(() => {});
    }, [date, token]);

    return {
        requests,
        refetch: fetch,
    };
};

export const useFetchRequestsEmployee = ({
    limit,
    offset,
}: {
    limit: number;
    offset: number;
}): {
    requests: Employer[] | undefined;
    refetch: () => void;
} => {
    const [requests, setRequests] = useState<Employer[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(() => {
        return client
            .get<Employer[]>(`/employee/?limit=${limit}&offset=${offset}`, {
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

export const useFetchCreateEmployee = (): {
    fetch: (request: Employer) => void;
} => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Employer) => {
            return client.post<Employer[]>(`/employee/`, request, {
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

export const useFetchRequestsPassenger = ({
    limit,
    offset,
}: {
    limit: number;
    offset: number;
}): {
    requests: Passenger[] | undefined;
    refetch: () => void;
} => {
    const [requests, setRequests] = useState<Passenger[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(() => {
        return client
            .get<Passenger[]>(`/passenger/?limit=${limit}&offset=${offset}`, {
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

export const useFetchDynamicSchedule = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(() => {
        return client.get(`/schedule/dynamic`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }, [token]);

    return {
        fetch,
    };
};

export const useFetchFilteredRequests = ({
    limit,
    offset,
}: {
    limit: number;
    offset: number;
}): {
    requests: RequestItem[] | undefined;
    refetch: (requests: Partial<Request>) => void;
} => {
    const [requests, setRequests] = useState<RequestItem[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        (request: Partial<Request>) => {
            return client
                .post<RequestItem[]>(
                    `/requisitions/filtered?limit=${limit}&offset=${offset}`,
                    request,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                .then((res) => setRequests(res.data));
        },
        [limit, offset, token],
    );

    return {
        requests,
        refetch: fetch,
    };
};

export const useFetchEmployeeSuggestion = (name: string): Employer[] | undefined => {
    const [employees, setEmployees] = useState<Employer[] | undefined>();

    const token = useStore(store, (state) => state['access_token']);
    useEffect(() => {
        client
            .get<Employer[]>(`/employee/suggestions/?name=${name}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setEmployees(res.data))
            .catch(() => {});
    }, [name, token]);

    return employees;
};

export const useFetchUserMe = (): {fetch: (token: string) => void} => {
    const fetch = useCallback((token: string) => {
        return client
            .get<User[]>(`/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                store.setState((state) => {
                    return {
                        ...state,
                        user: res.data,
                    };
                });
            })
            .catch(() => {});
    }, []);

    return {
        fetch,
    };
};

export const useFetchRequestEmployeesUpdate = () => {
    const token = useStore(store, (state) => state['access_token']);

    const fetch = useCallback(
        ({id, data}: {id: string | number; data: number[]}) => {
            return client.post(`/requisitions/employees?req_id=${id}`, data, {
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
