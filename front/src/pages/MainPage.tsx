import {
    Table as GravityTable,
    Select,
    TableActionConfig,
    TableColumnConfig,
    TableDataItem,
    Text,
    withTableActions,
    withTableCopy,
    withTableSettings,
} from '@gravity-ui/uikit';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
// import {requests} from 'src/mocks/requests';
import {RequestItemResolved, useResolvedRequests} from 'src/resolvers/useResolvedRequests';

import {useStore} from '@tanstack/react-store';
import {useNavigate} from 'react-router-dom';
import {useFetchDeleteRequest, useFetchFilteredRequests, useFetchRequests} from 'src/api/routes';
import {statuses, useStatus} from 'src/hooks/useStatus';
import {store} from 'src/store/state';
import {RequestStatus} from 'src/types';
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

    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin';

    const [settings, setSettings] = useState([{id: '_status', isSelected: true}]);

    const [currentStatus, setCurrentStatus] = useState<RequestStatus>();

    const {fetch: fetchDeleteRequest} = useFetchDeleteRequest();
    const {requests: filteredRequests, refetch: fetchFilteredRequests} = useFetchFilteredRequests({
        limit: 100,
        offset: 0,
    });

    const currentRequests = useMemo(() => {
        if (currentStatus) {
            return filteredRequests;
        }
        return requests;
    }, [currentStatus, filteredRequests, requests]);

    const resolvedRequests = useResolvedRequests(currentRequests);

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
        if (userRole === 'Admin') {
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
        }
        return [
            {
                text: 'Посмотреть',
                handler: handleRowClick,
            },
        ] as TableActionConfig<TableDataItem>[];
    };

    const Table = withTableSettings({sortable: true})(
        withTableActions(withTableCopy(GravityTable)),
    );

    useEffect(() => {
        if (!currentStatus) {
            refetchRequests();
            return;
        }
        fetchFilteredRequests({
            status: currentStatus,
        });
    }, [currentStatus]);

    return (
        <div className={css.MainPage}>
            <header className={css.MainPage__header}>
                <Text variant="display-1">Все заявки</Text>
            </header>
            <div className={css.MainPage__filter}>
                <div className={css.MainPage__filterField}>
                    <div className={css.MainPage__filterField}>Фильтр по статусу:</div>
                    <Select
                        hasClear={true}
                        onUpdate={(s: [RequestStatus]) => setCurrentStatus(s[0])}
                        renderSelectedOption={(option) => {
                            return <div>{useStatus(option.value)}</div>;
                        }}
                    >
                        {Object.keys(statuses).map((status: RequestStatus) => {
                            return (
                                <Select.Option key={statuses[status].name} value={status}>
                                    {useStatus(status)}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </div>
            </div>
            <Table
                className={css.MainPage__table}
                columns={requestTableData}
                data={resolvedRequests}
                onRowClick={handleRowClick}
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
