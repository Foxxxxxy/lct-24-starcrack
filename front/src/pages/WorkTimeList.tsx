import {Table as GravityTable, Text, withTableActions, withTableCopy} from '@gravity-ui/uikit';
import {FC, useCallback, useState} from 'react';

import {useNavigate} from 'react-router-dom';
import {useFetchEmployeeSuggestion, useFetchShiftsByEmployee} from 'src/api/routes';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {useResolvedShifts} from 'src/resolvers/useResolvedRequests';
import css from './WorkTimeList.module.scss';

const requestTableData = [
    {
        id: 'id',
        name: 'ID смены',
    },
    {
        id: 'employee_id',
        name: 'ID сотрудника',
    },
    {
        id: 'time_start',
        name: 'Время начала',
    },
    {
        id: 'time_end',
        name: 'Время завершения',
    },
    {
        id: 'place_start',
        name: 'Место начала',
    },
    {
        id: 'weekday',
        name: 'День недели',
    },
];

export const WorkTimeList: FC = () => {
    const navigate = useNavigate();

    const [employeeName, setEmployeeName] = useState('');
    const employeesSuggestions = useFetchEmployeeSuggestion(employeeName);

    const [emplpoyeeSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const shifts = useFetchShiftsByEmployee({
        limit: 1000,
        offset: 0,
        employee_id: emplpoyeeSuggest.customInfo?.id,
    });

    const resolvedRequests = useResolvedShifts(shifts ?? []);

    const handleEmployeeAction = useCallback(() => {
        navigate('/employee/create');
    }, [navigate]);

    const handleEmployeeSelect = useCallback(
        (item: SuggestItem) => {
            emplpoyeeSuggest.info = item.info;
            emplpoyeeSuggest.label = item.label;
            emplpoyeeSuggest.customInfo = item.customInfo;
        },
        [emplpoyeeSuggest],
    );

    const Table = withTableActions(withTableCopy(GravityTable));

    return (
        <div className={css.WorkTimeList}>
            <header className={css.WorkTimeList__header}>
                <Text variant="display-1">Список рабочих смен</Text>
            </header>
            <div className={css.WorkTimeList__content}>
                <div className={css.WorkTimeList__filters}>
                    <div className={css.WorkTimeList__field}>
                        <Text className={css.WorkTimeList__title}>Выберите сотрудника</Text>
                        <Suggest
                            placeholder="Начните вводить ФИО"
                            actionText="Создать сотрудника"
                            onChange={setEmployeeName}
                            onSelect={handleEmployeeSelect}
                            onAction={handleEmployeeAction}
                            value={employeeName}
                            items={employeesSuggestions?.map((item) => ({
                                label: item.full_name,
                                info: item.phone,
                                customInfo: {
                                    id: item.id,
                                },
                            }))}
                        />
                    </div>
                </div>
                <Table
                    className={css.WorkTimeList__table}
                    columns={requestTableData}
                    data={resolvedRequests}
                    onRowClick={() => {}}
                    // getRowActions={getRowActions}
                />
            </div>
        </div>
    );
};
