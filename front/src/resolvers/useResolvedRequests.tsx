import {Text} from '@gravity-ui/uikit';
import {ReactNode} from 'react';
import {mapSexBack, mapWeeksBack} from 'src/constants';
import {useDateTime} from 'src/hooks/useDateTime';
import {useStatus} from 'src/hooks/useStatus';
import {Employer, Passenger, RequestItem, Shift} from 'src/types';

export type RequestItemResolved = {
    _id: number;
    _status: string;
    id: ReactNode | number;
    passenger_id: ReactNode | number;
    start_time: ReactNode | string;
    finish_time: ReactNode | string;
    meet_time: ReactNode | string;
    status: ReactNode | string;
    creation_time: ReactNode | string;
    females_males_needed: ReactNode | string;
    route: ReactNode | string;
};

export type RequestItemResolvedEmployee = {
    id: ReactNode | number;
    full_name: ReactNode | string;
    sex: ReactNode | string;
    role: ReactNode | string;
    sub_role: ReactNode | string;
    phone: ReactNode | string;
    easy_work: ReactNode | boolean;
};

export type RequestItemResolvedPassenger = {
    id: ReactNode | number;
    name: ReactNode | string;
    passenger_category: ReactNode | string;
    phone: ReactNode | string;
    sex: ReactNode | string;
    pacemaker: ReactNode | boolean;
    comment: ReactNode | string | null;
};

export const useResolvedRequests = (requests: RequestItem[] | undefined): RequestItemResolved[] => {
    if (!requests) {
        return [];
    }
    return requests.map((item) => ({
        _id: item.id,
        _status: item.status,
        id: <Text color="secondary">{item.id}</Text>,
        passenger_id: <Text color="secondary">{item.passenger_id}</Text>,
        females_males_needed: (
            <Text color="complementary">{`${item.males_needed} м / ${item.females_needed} ж`}</Text>
        ),
        start_time: useDateTime(item.start_time ?? '').formatted,
        finish_time: useDateTime(item.finish_time ?? '').formatted,
        meet_time: useDateTime(item.meet_time ?? '').formatted,
        status: useStatus(item.status),
        creation_time: useDateTime(item.creation_time).formatted,
        route: `${item.start_station} -> ${item.end_station}`,
    }));
};

export const useResolvedRequestsEmployee = (
    requests: Employer[],
): RequestItemResolvedEmployee[] => {
    return requests.map((item) => ({
        _id: item.id,
        id: <Text color="secondary">{item.id}</Text>,
        full_name: <Text color="complementary">{item.full_name}</Text>,
        sex: <Text color="complementary">{mapSexBack[item.sex]}</Text>,
        role: <Text color="complementary">{item.role}</Text>,
        sub_role: <Text color="complementary">{item.sub_role}</Text>,
        phone: <Text color="complementary">{item.phone}</Text>,
        easy_work: item.easy_work ? 'Да' : 'Нет',
    }));
};

export const useResolvedRequestsPassenger = (
    requests: Passenger[],
): RequestItemResolvedPassenger[] => {
    return requests.map((item) => ({
        _id: item.id,
        id: <Text color="secondary">{item.id}</Text>,
        name: <Text color="complementary">{item.name}</Text>,
        passenger_category: <Text color="complementary">{item.passenger_category}</Text>,
        phone: <Text color="complementary">{item.phone}</Text>,
        sex: <Text color="complementary">{item.sex}</Text>,
        pacemaker: item.pacemaker ? 'Да' : 'Нет',
        comment: item.comment ? <Text color="complementary">{item.comment}</Text> : null,
    }));
};

export const useResolvedShifts = (requests: Shift[]) => {
    return requests.map((item) => ({
        _id: item.id,
        id: <Text color="secondary">{item.id}</Text>,
        employee_id: <Text color="complementary">{item.employee_id}</Text>,
        time_start: <Text>{item.time_start}</Text>,
        time_end: <Text>{item.time_end}</Text>,
        place_start: <Text>{item.place_start}</Text>,
        weekday: <Text>{mapWeeksBack[item.weekday]}</Text>,
    }));
};
