import {Table as GravityTable, TableColumnConfig, Text, withTableActions, withTableCopy, withTableSorting, TableActionConfig} from '@gravity-ui/uikit';
import {FC} from "react"
import {RequestItemResolvedPassenger, useResolvedRequestsPassenger} from "src/resolvers/useResolvedRequests"
import {useFetchRequestsPassenger} from "src/api/routes"
import css from "./EmployeeList.module.scss"

const employeeTableData: TableColumnConfig<RequestItemResolvedPassenger>[] = [
    {
        id: 'id',
        name: 'ID пассажира',
        meta: {copy: ({id}: {id: string}) => id},
    },
    {
        id: 'name',
        name: 'ФИО пассажира',
        meta: {copy: ({full_name}: {full_name: string}) => full_name},
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
    }
]

export const PassengersList: FC = () => {
    const requests = useFetchRequestsPassenger({
        limit: 100,
        offset: 0,
    })

    if (!requests) {
        return <>Loading</>
    }

    const resolvedRequests = useResolvedRequestsPassenger(requests)

    const MyTable = withTableSorting(withTableActions(withTableCopy(GravityTable)));

    const getRowActions = (): TableActionConfig<RequestItemResolvedPassenger>[] => {
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