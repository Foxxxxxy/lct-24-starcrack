import {
    Table as GravityTable,
    TableActionConfig,
    TableColumnConfig,
    Text,
    TextInput,
    useToaster,
    withTableActions,
    withTableCopy,
} from '@gravity-ui/uikit';
import {useStore} from '@tanstack/react-store';
import {FC, useCallback, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    useFetchEmployeeSuggestion,
    useFetchRemoveEmployee,
    useFetchRequestsEmployee,
} from 'src/api/routes';
import {TableLoader} from 'src/components/TableLoader/TableLoader';
import {
    RequestItemResolvedEmployee,
    useResolvedRequestsEmployee,
} from 'src/resolvers/useResolvedRequests';
import {store} from 'src/store/state';
import css from './EmployeeList.module.scss';

const employeeTableData: TableColumnConfig<RequestItemResolvedEmployee>[] = [
    {
        id: 'id',
        name: 'ID сотрудника',
    },
    {
        id: 'full_name',
        name: 'ФИО сотрудника',
    },
    {
        id: 'sex',
        name: 'Пол',
    },
    {
        id: 'role',
        name: 'Роль',
    },
    {
        id: 'sub_role',
        name: 'Должность',
    },
    {
        id: 'phone',
        name: 'Телефон',
    },
    {
        id: 'easy_work',
        name: 'Легкая работа',
    },
];

export const EmployeeList: FC = () => {
    const navigate = useNavigate();
    const {add} = useToaster();

    const {requests, refetch} = useFetchRequestsEmployee({
        limit: 1000,
        offset: 0,
    });

    const [name, setName] = useState('');

    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin';

    const employeeList = useFetchEmployeeSuggestion(name);
    const {fetch: deleteEmployee} = useFetchRemoveEmployee();

    const currentList = useMemo(() => {
        if (name) {
            return employeeList;
        }
        return requests;
    }, [name, employeeList, requests]);

    const resolvedRequests = useResolvedRequestsEmployee(currentList ?? []);

    const Table = withTableActions(withTableCopy(GravityTable));

    const handleRowClick = useCallback(
        (row) => {
            navigate(`/employee/${row._id}`);
        },
        [navigate],
    );

    const getRowActions = () => {
        if (userRole === 'Admin') {
            return [
                {
                    text: 'Изменить',
                    handler: (row) => {
                        navigate(`/employee/create?editId=${row._id}`);
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
                        await deleteEmployee(row._id)
                            .then(() => {
                                add({
                                    name: 'employee-delete-success',
                                    title: 'Сотрудник успешно удален',
                                    theme: 'success',
                                });
                            })
                            .catch(() => {
                                add({
                                    name: 'employee-delete-error',
                                    title: 'Что-то пошло не так :(',
                                    theme: 'danger',
                                });
                            });
                        setName('');
                        refetch();
                    },
                    theme: 'danger',
                },
            ] as TableActionConfig<RequestItemResolvedEmployee>[];
        }
        return [
            {
                text: 'Посмотреть',
                handler: (row) => {
                    handleRowClick(row);
                },
            },
        ] as TableActionConfig<RequestItemResolvedEmployee>[];
    };

    const handleInputChange = useCallback(
        (el) => {
            setName(el.target.value);
        },
        [setName],
    );

    return (
        <div className={css.EmployeeList}>
            <header className={css.EmployeeList__header}>
                <Text variant="display-1">Все сотрудники</Text>
            </header>
            <div className={css.EmployeeList__filter}>
                <TextInput
                    placeholder="Начните вводить имя сотрудника"
                    onChange={handleInputChange}
                />
            </div>
            {resolvedRequests.length !== 0 ? (
                <Table
                    className={css.EmployeeList__table}
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
