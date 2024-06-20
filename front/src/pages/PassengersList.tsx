import {
    Table as GravityTable,
    TableActionConfig,
    TableColumnConfig,
    Text,
    TextInput,
    useToaster,
    withTableActions,
    withTableCopy,
    withTableSorting,
} from '@gravity-ui/uikit';
import {useStore} from '@tanstack/react-store';
import {FC, useCallback, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    useFetchPassengerSuggestion,
    useFetchRemovePassenger,
    useFetchRequestsPassenger,
} from 'src/api/routes';
import {TableLoader} from 'src/components/TableLoader/TableLoader';
import {
    RequestItemResolvedPassenger,
    useResolvedRequestsPassenger,
} from 'src/resolvers/useResolvedRequests';
import {store} from 'src/store/state';
import css from './PassengersList.module.scss';

const employeeTableData: TableColumnConfig<RequestItemResolvedPassenger>[] = [
    {
        id: 'id',
        name: 'ID пассажира',
    },
    {
        id: 'name',
        name: 'ФИО пассажира',
    },
    {
        id: 'passenger_category',
        name: 'Категория пассажира',
    },
    {
        id: 'phone',
        name: 'Телефон',
    },
    {
        id: 'comment',
        name: 'Комментарий',
    },
    {
        id: 'pacemaker',
        name: 'кардиостимулятор',
    },
];

export const PassengersList: FC = () => {
    const navigate = useNavigate();
    const {add} = useToaster();

    const {requests, refetch} = useFetchRequestsPassenger({
        limit: 2000,
        offset: 0,
    });

    const [name, setName] = useState('');

    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin';

    const passengersList = useFetchPassengerSuggestion(name);

    const handleInputChange = useCallback(
        (el) => {
            setName(el.target.value);
        },
        [setName],
    );

    const currentList = useMemo(() => {
        if (name) {
            return passengersList;
        }
        return requests;
    }, [name, passengersList, requests]);

    const resolvedRequests = useResolvedRequestsPassenger(currentList ?? []);

    const Table = withTableSorting(withTableActions(withTableCopy(GravityTable)));

    const {fetch: deletePassenger} = useFetchRemovePassenger();

    const handleRowClick = useCallback(
        (row) => {
            navigate(`/passengers/${row._id}`);
        },
        [navigate],
    );

    const getRowActions = () => {
        if (userRole === 'Admin') {
            return [
                {
                    text: 'Изменить',
                    handler: (row) => {
                        navigate(`/passengers/create?editId=${row._id}`);
                    },
                },
                {
                    text: 'Посмотреть',
                    handler: (row) => {
                        handleRowClick(row);
                    },
                },
                {
                    text: 'Удалить',
                    handler: async (row) => {
                        await deletePassenger(row._id)
                            .then(() => {
                                add({
                                    name: 'passenger-delete-success',
                                    title: 'Пассажир успешно удален',
                                    theme: 'success',
                                });
                            })
                            .catch(() => {
                                add({
                                    name: 'passenger-delete-error',
                                    title: 'Что-то пошло не так :(',
                                    theme: 'danger',
                                });
                            });
                        setName('');
                        refetch();
                    },
                    theme: 'danger',
                },
            ] as TableActionConfig<RequestItemResolvedPassenger>[];
        }
        return [
            {
                text: 'Посмотреть',
                handler: (row) => {
                    handleRowClick(row);
                },
            },
        ] as TableActionConfig<RequestItemResolvedPassenger>[];
    };

    return (
        <div className={css.PassengersList}>
            <header className={css.PassengersList__header}>
                <Text variant="display-1">Все пассажиры</Text>
            </header>
            <div className={css.PassengersList__filter}>
                <TextInput
                    placeholder="Начните вводить имя пассажира"
                    onChange={handleInputChange}
                />
            </div>
            {resolvedRequests.length !== 0 ? (
                <Table
                    className={css.PassengersList__table}
                    columns={employeeTableData}
                    data={resolvedRequests}
                    onRowClick={handleRowClick}
                    getRowActions={getRowActions}
                />
            ) : (
                <TableLoader rows={15} />
            )}
        </div>
    );
};
