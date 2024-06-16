import {Table as GravityTable, TableColumnConfig, Text, withTableActions, withTableCopy, withTableSorting, TableActionConfig} from '@gravity-ui/uikit';
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
    const requests = useFetchRequestsEmployee({
        limit: 100,
        offset: 0,
    })

    if (!requests) {
        return <>Loading</>
    }

    const resolvedRequests = useResolvedRequestsEmployee(requests)

    const MyTable = withTableSorting(withTableActions(withTableCopy(GravityTable)));

    const getRowActions = (): TableActionConfig<RequestItemResolvedEmployee>[] => {
        return [
          {
            text: 'Remove',
            handler: () => {
                console.log('Remove')
            },
            theme: 'danger' as const,
          },
        ];
    };

    return (
        <div className={css.EmployeeList}>
            <header className={css.EmployeeList__header}>
                <Text variant="display-1">Все сотрудники</Text>
            </header>
            <MyTable
                className={css.EmployeeList__table}
                columns={employeeTableData}
                data={resolvedRequests}
                onRowClick={() => {}}
                getRowActions={getRowActions}
            />
        </div>
    )
}