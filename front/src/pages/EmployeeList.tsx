import {Table as GravityTable, TableColumnConfig, Text, withTableActions, withTableCopy, TableActionConfig} from '@gravity-ui/uikit';
import React, {FC} from "react"
import {RequestItemResolvedEmployee, useResolvedRequestsEmployee} from "src/resolvers/useResolvedRequests"
import {useFetchRequestsEmployee} from "src/api/routes"
import css from "./EmployeeList.module.scss"

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
        name: 'Подроль',
    },
    {
        id: 'phone',
        name: 'Телефон',
    },
    {
        id: 'easy_work',
        name: 'Легкая работа',
    }
]

export const EmployeeList: FC = () => {
    const {requests, refetch} = useFetchRequestsEmployee({
        limit: 100,
        offset: 0,
    })

    if (!requests) {
        return <>Loading</>
    }

    const resolvedRequests = useResolvedRequestsEmployee(requests)

    const Table = withTableActions(withTableCopy(GravityTable));

    const getRowActions = () => {
        return [
            {
                text: 'Изменить',
                handler: () => {
                    console.log('Изменить')
                },
            },
            {
                text: 'Посмотреть',
                handler: () => {
                    console.log('Посмотреть')
                },
            },
            {
                text: 'Удалить',
                handler: () => {
                    console.log('Удалить')
                },
                theme: 'danger',
            },
        ] as TableActionConfig<RequestItemResolvedEmployee>[];
    };

    return (
        <div className={css.EmployeeList}>
            <header className={css.EmployeeList__header}>
                <Text variant="display-1">Все сотрудники</Text>
            </header>
            <Table
                className={css.EmployeeList__table}
                columns={employeeTableData}
                data={resolvedRequests}
                onRowClick={() => {}}
                getRowActions={getRowActions}
            />
        </div>
    )
}