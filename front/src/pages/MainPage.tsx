import {Table as GravityTable, TableColumnConfig, Text, withTableCopy} from '@gravity-ui/uikit';
import {FC} from 'react';
import {requests} from 'src/mocks/requests';
import {RequestItemResolved, useResolvedRequests} from 'src/resolvers/useResolvedRequests';

import axios from 'axios';
import {useFetchMetroStations} from 'src/api/queries';
import css from './MainPage.module.scss';

const requestTableData: TableColumnConfig<RequestItemResolved>[] = [
    {
        id: 'id',
        name: 'ID заявки',
        meta: {copy: ({id}: {id: string}) => id},
    },
    {
        id: 'passenger_id',
        name: 'ID Пассажира',
        meta: {copy: ({passenger_id}: {passenger_id: string}) => passenger_id},
    },
    {
        id: 'females_males_needed',
        name: 'Кол-во м / ж',
    },
    {
        id: 'route',
        name: 'Ст. отправления -> прибытия пассажира',
    },
    {
        id: 'status',
        name: 'Статус заявки',
    },
    {
        id: 'start_time',
        name: 'Время начала',
    },
    {
        id: 'finish_time',
        name: 'Время завершения',
    },
];

const client = axios.create({
    baseURL: 'https://starcrack.ru/',
});

export const MainPage: FC = () => {
    const resolvedRequests = useResolvedRequests(requests);

    const metro = useFetchMetroStations('Алтуфьево');

    const Table = withTableCopy(GravityTable);

    // const token = useStore(store, (state) => state['access_token']);
    // console.log(metro); // IT WORKS

    return (
        <div className={css.MainPage}>
            <header className={css.MainPage__header}>
                <Text variant="display-1">Все заявки</Text>
            </header>
            <Table
                className={css.MainPage__table}
                columns={requestTableData}
                data={resolvedRequests}
                onRowClick={() => {}}
            />
        </div>
    );
};
