import {Table as GravityTable, TableColumnConfig, Text, withTableActions, withTableCopy, withTableSorting, TableActionConfig} from '@gravity-ui/uikit';
import {FC} from "react"
import {RequestItemResolvedPassenger, useResolvedRequestsPassenger} from "src/resolvers/useResolvedRequests"
import {useFetchRequestsPassenger} from "src/api/routes"
import css from "./EmployeeList.module.scss"

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
    }
]

export const PassengersList: FC = () => {
    const {requests, refetch} = useFetchRequestsPassenger({
        limit: 100,
        offset: 0,
    })

    if (!requests) {
        return <>Loading</>
    }

    const resolvedRequests = useResolvedRequestsPassenger(requests)

    const Table = withTableSorting(withTableActions(withTableCopy(GravityTable)));

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
        ] as TableActionConfig<RequestItemResolvedPassenger>[];
    };

    return (
        <div className={css.EmployeeList}>
            <header className={css.EmployeeList__header}>
                <Text variant="display-1">Все пассажиры</Text>
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