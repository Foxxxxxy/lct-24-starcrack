import {Text} from '@gravity-ui/uikit';
import {ReactNode} from 'react';
import {useDateTime} from 'src/hooks/useDateTime';
import {useStatus} from 'src/hooks/useStatus';
import {RequestItem} from 'src/types';

export type RequestItemResolved = {
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

export const useResolvedRequests = (requests: RequestItem[]): RequestItemResolved[] => {
    return requests.map((item) => ({
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
