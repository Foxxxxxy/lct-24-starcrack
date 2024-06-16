import {DatePicker} from '@gravity-ui/date-components';
import {dateTime, DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {Text} from '@gravity-ui/uikit';
import React, {FC, useCallback, useState} from 'react';
import {useFetchSheduledRequest} from 'src/api/routes';
import {Request} from 'src/types';
import css from './GantPage.module.scss';

export interface Task {
    id: number;
    title: string;
    startHour: number;
    duration: number;
}

interface GanttChartProps {
    tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({tasks}) => {
    return (
        <div className={css.GanttChart}>
            <div className={css.GanttChart__hours}>
                {[...Array(24)].map((_, i) => (
                    <div key={i} className={css.GanttChart__hoursItem}>
                        {i + 1}
                    </div>
                ))}
            </div>
            {tasks.map((task) => {
                return (
                    <div key={task.id} className={css.GanttChart__line}>
                        <div className={css.GanttChart__taskBar}>{task.title}</div>
                    </div>
                );
            })}
        </div>
    );
};

const tasks: Task[] = [
    {id: 1, title: 'Task 1', startHour: 2, duration: 3},
    {id: 2, title: 'Task 2', startHour: 5, duration: 4},
    {id: 3, title: 'Task 3', startHour: 10, duration: 2},
    // Добавьте больше задач по необходимости
];

const requests: Request[] = [];

interface SidebarProps {
    tasks: Task[];
    requests: Request[] | undefined;
}

const GanttSidebar: React.FC<SidebarProps> = ({requests}) => {
    console.log(requests);
    return (
        <div className={css.GanttSidebar}>
            {requests &&
                requests.map((request) => (
                    <div key={request.id} className={css.GanttSidebar__task}>
                        Заявка №{request.id}
                    </div>
                ))}
        </div>
    );
};

export const GantPage: FC = () => {
    const [dateValue, setDateValue] = useState<DateTime>(dateTime());

    const FORMAT_DATE = 'YYYY-MM-DD';

    const dateParsed = dateTimeParse(dateValue)?.format(FORMAT_DATE);

    const sheduledRequests = useFetchSheduledRequest(dateParsed ?? '');

    const handleDateUpdate = useCallback(
        (data: DateTime) => {
            setDateValue(data);
        },
        [setDateValue],
    );

    return (
        <div className={css.GantPage}>
            <header className={css.GantPage__header}>
                <Text variant="display-1">Диаграмма ганта</Text>
            </header>
            <div className={css.GantPage__month}>
                <DatePicker
                    format="DD.MM.YYYY"
                    value={dateValue}
                    defaultValue={dateTime()}
                    onUpdate={handleDateUpdate}
                />
            </div>
            <div className={css.appContainer}>
                <GanttSidebar tasks={tasks} requests={sheduledRequests} />
                <GanttChart tasks={tasks} />
            </div>

            {/* <div className={css.GantPage__content}>
                <div className={css.GantPage__aside}>

                </div>
            </div> */}
        </div>
    );
};
