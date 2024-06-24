import {
    Button,
    Table as GravityTable,
    Select,
    TableActionConfig,
    TableColumnConfig,
    TableDataItem,
    Text,
    useToaster,
    withTableActions,
    withTableCopy,
    withTableSettings,
} from '@gravity-ui/uikit';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
// import {requests} from 'src/mocks/requests';
import {RequestItemResolved, useResolvedRequests} from 'src/resolvers/useResolvedRequests';

import {DatePicker} from '@gravity-ui/date-components';
import {DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {useStore} from '@tanstack/react-store';
import {useNavigate} from 'react-router-dom';
import {
    useFetchDeleteRequest,
    useFetchFilteredRequests,
    useFetchPassengerSuggestion,
    useFetchRequests,
} from 'src/api/routes';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {TableLoader} from 'src/components/TableLoader/TableLoader';
import {useScrollToBottom} from 'src/hooks/useScroll';
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
        id: 'employee',
        name: 'Назначенные сотрудники',
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
    const [limit, setLimit] = useState(50);
    const [offset, setOfsset] = useState(0);

    const {requests, refetch: refetchRequests} = useFetchRequests({
        limit: limit,
        offset: offset,
    });

    const {requests: filteredRequests, refetch: fetchFilteredRequests} = useFetchFilteredRequests({
        limit: limit,
        offset: offset,
    });

    useScrollToBottom(() => {
        setLimit(limit + 50);
        setOfsset(offset + 50);
    });

    const navigate = useNavigate();
    const {add} = useToaster();

    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin'; //TODO: fix user role

    const [dateStart, setDateStart] = useState<DateTime>();
    const [dateEnd, setDateEnd] = useState<DateTime>();

    const [settings, setSettings] = useState([{id: '_status', isSelected: true}]);

    const [currentStatus, setCurrentStatus] = useState<RequestStatus>();
    const [passengerName, setPassengerName] = useState('');
    const passengersSuggestion = useFetchPassengerSuggestion(passengerName);

    const [passengerSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const handlePassengerSelect = useCallback(
        (item: SuggestItem) => {
            passengerSuggest.info = item.info;
            passengerSuggest.label = item.label;
            passengerSuggest.customInfo = item.customInfo;
        },
        [passengerSuggest],
    );

    const {fetch: fetchDeleteRequest} = useFetchDeleteRequest();

    const currentRequests = useMemo(() => {
        if (currentStatus || dateStart || passengerSuggest.customInfo?.id) {
            return filteredRequests;
        }
        return requests;
    }, [currentStatus, filteredRequests, requests, passengerSuggest.customInfo?.id]);

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
            await fetchDeleteRequest(row._id)
                .then(() => {
                    add({
                        name: 'requests-delete-success',
                        title: 'Заявка успешно удалена',
                        theme: 'success',
                    });
                })
                .catch(() => {
                    add({
                        name: 'requests-delete-error',
                        title: 'Что-то пошло не так :(',
                        theme: 'danger',
                    });
                });
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
        if (!currentStatus && !dateStart && !passengerSuggest.customInfo?.id) {
            refetchRequests();
            return;
        }
        fetchFilteredRequests({
            status: currentStatus,
            start_time: dateTimeParse(dateStart)?.format('YYYY-MM-DD'),
            passenger_id: passengerSuggest.customInfo?.id,
        });
    }, [currentStatus, dateStart, passengerSuggest.customInfo?.id]);

    const handleReset = useCallback(() => {
        fetchFilteredRequests({});
        setPassengerName('');
        passengerSuggest.info = '';
        passengerSuggest.label = '';
        passengerSuggest.customInfo = {};
    }, [fetchFilteredRequests, setPassengerName]);

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
                <div className={css.MainPage__filterField}>
                    <div className={css.MainPage__filterField}>Фильтр по дате начала:</div>
                    <DatePicker
                        hasClear={true}
                        format="DD.MM.YYYY"
                        value={dateStart}
                        onUpdate={(d) => setDateStart(d)}
                    />
                </div>
                <div className={css.MainPage__filterField}>
                    <div className={css.MainPage__filterField}>Фильтр по пассажиру:</div>
                    <Suggest
                        placeholder="Начните вводить ФИО"
                        onChange={setPassengerName}
                        onSelect={handlePassengerSelect}
                        value={passengerName}
                        items={passengersSuggestion?.map((item) => ({
                            label: item.name,
                            info: item.phone,
                            customInfo: {
                                id: item.id,
                                passenger_category: item.passenger_category,
                            },
                        }))}
                    />
                </div>
                <div className={css.MainPage__filterField}>
                    <Button onClick={handleReset}>Сбросить фильтры</Button>
                </div>
                {/* <div className={css.MainPage__filterField}>
                    <div className={css.MainPage__filterField}>Фильтр по дате завершения:</div>
                    <DatePicker
                        hasClear={true}
                        format="DD.MM.YYYY"
                        value={dateEnd}
                        onUpdate={(d) => setDateEnd(d)}
                    />
                </div> */}
            </div>
            {resolvedRequests.length !== 0 ? (
                <Table
                    className={css.MainPage__table}
                    columns={requestTableData}
                    data={resolvedRequests}
                    // onRowClick={handleRowClick}
                    updateSettings={(updated) => {
                        setSettings(updated);
                        return Promise.resolve();
                    }}
                    getRowActions={getRowActions}
                    settings={settings}
                />
            ) : filteredRequests?.length === 0 ? (
                'NO DATA FOUND'
            ) : (
                <TableLoader rows={15} />
            )}
        </div>
    );
};
