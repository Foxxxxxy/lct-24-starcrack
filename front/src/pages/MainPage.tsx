import {
    Table as GravityTable,
    TableActionConfig,
    TableColumnConfig,
    TableDataItem,
    Text,
    withTableActions,
    withTableCopy,
    withTableSettings,
} from '@gravity-ui/uikit';
import {FC, useCallback, useState} from 'react';
// import {requests} from 'src/mocks/requests';
import {RequestItemResolved, useResolvedRequests} from 'src/resolvers/useResolvedRequests';

import {useNavigate} from 'react-router-dom';
import {useFetchDeleteRequest, useFetchRequests} from 'src/api/routes';
import css from './MainPage.module.scss';

const requestTableData: TableColumnConfig<RequestItemResolved>[] = [
    {
        id: 'id',
        name: 'ID заявки',
    },
    {
        id: 'passenger_id',
        name: 'ID Пассажира',
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

export const MainPage: FC = () => {
    const {requests, refetch: refetchRequests} = useFetchRequests({
        limit: 100,
        offset: 0,
    });

    const navigate = useNavigate();

    const resolvedRequests = useResolvedRequests(requests);

    const {fetch: fetchDeleteRequest} = useFetchDeleteRequest();

    const handleRowClick = useCallback(
        (row: RequestItemResolved) => {
            navigate(`/requests/${row._id}`);
        },
        [navigate],
    );

    const handleRowEdit = useCallback(
        (row: RequestItemResolved) => {
            navigate(`/requests/create?editId=${row._id}`);
        },
        [navigate],
    );

    const handleRowDelete = useCallback(
        async (row: RequestItemResolved) => {
            await fetchDeleteRequest(row._id);
            refetchRequests();
        },
        [navigate],
    );

    const getRowActions = () => {
        return [
            {
                text: 'Изменить',
                handler: handleRowEdit,
            },
            {
                text: 'Посмотреть',
                handler: handleRowClick,
            },
            {
                text: 'Удалить',
                handler: handleRowDelete,
                theme: 'danger',
            },
        ] as TableActionConfig<TableDataItem>[];
    };

    const Table = withTableSettings({sortable: true})(
        withTableActions(withTableCopy(GravityTable)),
    );

    const [settings, setSettings] = useState([{id: '_status', isSelected: true}]);

    return (
        <div className={css.MainPage}>
            <header className={css.MainPage__header}>
                <Text variant="display-1">Все заявки</Text>
            </header>
            <Table
                className={css.MainPage__table}
                columns={requestTableData}
                data={resolvedRequests}
                onRowClick={handleRowEdit}
                updateSettings={(updated) => {
                    setSettings(updated);
                    return Promise.resolve();
                }}
                getRowActions={getRowActions}
                settings={settings}
            />
        </div>
    );
};
