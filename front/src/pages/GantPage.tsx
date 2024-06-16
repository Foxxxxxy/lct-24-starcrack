import {DatePicker} from '@gravity-ui/date-components';
import {dateTime, DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {Button, Label, Text, useToaster} from '@gravity-ui/uikit';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useFetchDynamicSchedule, useFetchSheduledRequest} from 'src/api/routes';
import {mapHours} from 'src/hooks/mapHours';
import {statuses} from 'src/hooks/useStatus';
import {Request} from 'src/types';
import css from './GantPage.module.scss';

export interface Task {
    id: number;
    title: string;
    startHour: number;
    duration: number;
}

interface GanttChartProps {
    requests: RequestShedule[] | undefined;
}

type TimeMapping = {
    startHour: number;
    finishHour: number;
};

const GanttChart: React.FC<GanttChartProps> = ({requests}) => {
    const navigate = useNavigate();
    const HOUR_WIDTH = 62;

    const calculateBlockSize = useCallback(({startHour, finishHour}: TimeMapping) => {
        const startX = startHour * HOUR_WIDTH;
        const blockWidth = (finishHour - startHour) * HOUR_WIDTH;

        return {startX, blockWidth};
    }, []);

    const handleBlockSize = useCallback(
        (req: RequestShedule) => {
            const hours = mapHours(req.start_time, req.finish_time);
            console.log(hours);
            return {
                width: calculateBlockSize({
                    startHour: hours.startHour,
                    finishHour: hours.finishHour,
                }).blockWidth,
                offsetX: calculateBlockSize({
                    startHour: hours.startHour,
                    finishHour: hours.finishHour,
                }).startX,
            };
        },
        [calculateBlockSize, mapHours],
    );

    const handleBlockPress = useCallback(
        (request: RequestShedule) => {
            navigate(`/requests/${request.id}`);
        },
        [navigate],
    );

    return (
        <div className={css.GanttChart}>
            <div className={css.GanttChart__hours}>
                {[...Array(24)].map((_, i) => (
                    <div key={i} className={css.GanttChart__hoursItem}>
                        {i}
                    </div>
                ))}
            </div>
            {requests &&
                requests.map((req) => {
                    return (
                        <div key={req.id} className={css.GanttChart__line}>
                            <div
                                onClick={() => handleBlockPress(req)}
                                style={{
                                    width: handleBlockSize(req).width,
                                    transform: `translateX(${handleBlockSize(req).offsetX}px)`,
                                }}
                                className={css.GanttChart__taskBar}
                            >
                                <Label
                                    className={css.GanttChart__status}
                                    theme={statuses[req.status].theme}
                                    size="xs"
                                >
                                    Заявка #{req.id} <br />
                                    {statuses[req.status].name}
                                </Label>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export type RequestShedule = {
    finish_time: string;
    employees: {
        easy_work: boolean;
        full_name: string;
        id: number;
        phone: string;
        role: string;
        sex: 'Male' | 'Female';
        sub_role: string;
    }[];
} & Request;

interface SidebarProps {
    requests: RequestShedule[] | undefined;
}

const GanttSidebar: React.FC<SidebarProps> = ({requests}) => {
    return (
        <div className={css.GanttSidebar}>
            {requests &&
                requests.map((request) => (
                    <div key={request.id} className={css.GanttSidebar__task}>
                        {request.employees.map((item) => item.full_name).join(', ')}
                    </div>
                ))}
        </div>
    );
};

export const GantPage: FC = () => {
    const [dateValue, setDateValue] = useState<DateTime>(dateTime());
    const {add} = useToaster();

    const FORMAT_DATE = 'YYYY-MM-DD';

    const dateParsed = dateTimeParse(dateValue)?.format(FORMAT_DATE);

    const {requests: sheduledRequests, refetch} = useFetchSheduledRequest(dateParsed ?? '');
    const {fetch: scheduleDynamicly} = useFetchDynamicSchedule();

    useEffect(() => {
        refetch();
    }, [dateValue]);

    const requestsFiltered = useMemo(() => {
        return sheduledRequests?.filter((req) => req.employees?.length);
    }, [sheduledRequests]);

    const handleDateUpdate = useCallback(
        (data: DateTime) => {
            setDateValue(data);
        },
        [setDateValue],
    );

    const handleDynamicSchedule = useCallback(async () => {
        add({
            name: 'gant-info',
            title: 'Обновление',
            theme: 'info',
        });
        await scheduleDynamicly();
        await refetch();
        add({
            name: 'gant-success',
            title: 'Успешно обновлено',
            theme: 'success',
        });
    }, [scheduleDynamicly, refetch]);

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
            <Button onClick={handleDynamicSchedule}>Динмачическое распределение</Button>
            <div className={css.appContainer}>
                <GanttSidebar requests={requestsFiltered} />
                <GanttChart requests={requestsFiltered} />
            </div>
        </div>
    );
};
