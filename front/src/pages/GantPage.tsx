import {DatePicker} from '@gravity-ui/date-components';
import {dateTime, DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {Button, Label, Modal, Text, useToaster} from '@gravity-ui/uikit';
import cx from 'classnames';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    useFetchDynamicSchedule,
    useFetchEmployeeSuggestion,
    useFetchRequestEmployeesUpdate,
    useFetchSheduledRequest,
} from 'src/api/routes';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {mapHours} from 'src/hooks/mapHours';
import {statuses} from 'src/hooks/useStatus';
import {Employer, Request} from 'src/types';
import css from './GantPage.module.scss';

export interface Task {
    id: number;
    title: string;
    startHour: number;
    duration: number;
}

interface GanttChartProps {
    requests: RequestShedule[] | undefined;
    openModal: (isTrue: boolean, request: Request) => void;
}

type TimeMapping = {
    startHour: number;
    finishHour: number;
};

const GanttChart: React.FC<GanttChartProps> = ({requests, openModal}) => {
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
            openModal(true, request);
        },
        [navigate],
    );

    console.log(requests);

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
                requests.map((req, idx) => {
                    return (
                        <div key={idx} className={css.GanttChart__line}>
                            <div className={css.GanttChart__taskBar}>
                                {req?.requisitions?.map((childRequest) => {
                                    return (
                                        <div
                                            key={childRequest.id}
                                            className={css.GanttChart__taskLabel}
                                            onClick={() => handleBlockPress(childRequest)}
                                            style={{
                                                width: handleBlockSize(childRequest).width,
                                                transform: `translateX(${handleBlockSize(childRequest).offsetX}px)`,
                                            }}
                                        >
                                            <Label
                                                className={css.GanttChart__status}
                                                theme={statuses[childRequest.status].theme}
                                                size="xs"
                                            >
                                                Заявка #{childRequest.id} <br />
                                                {statuses[childRequest.status].name}
                                            </Label>
                                        </div>
                                    );
                                })}
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

const GanttSidebar: React.FC<SidebarProps> = ({requests, openModal}) => {
    return (
        <div className={css.GanttSidebar}>
            {requests &&
                requests.map((request) => (
                    <div key={request.employee.id} className={css.GanttSidebar__task}>
                        <div>{request?.employee?.full_name}</div>
                    </div>
                ))}
        </div>
    );
};

const GantPageField: FC<{
    data?: Employer;
    isNew?: boolean;
    handleChangeEmployer: () => void;
    handleRemoveEmployer: () => void;
}> = (props) => {
    const {data, isNew, handleChangeEmployer, handleRemoveEmployer} = props;
    const [employeeName, setEmployeeName] = useState('');
    const [isChange, setIsChange] = useState(isNew ? isNew : false);

    const [isDeleted, setIsDeleted] = useState(false);

    const employeesSuggestions = useFetchEmployeeSuggestion(employeeName);

    const [emplpoyeeSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const handleEmployeeSelect = useCallback(
        (item: SuggestItem) => {
            emplpoyeeSuggest.info = item.info;
            emplpoyeeSuggest.label = item.label;
            emplpoyeeSuggest.customInfo = item.customInfo;
        },
        [emplpoyeeSuggest],
    );

    const handleChange = useCallback(() => {
        if (isNew) {
            handleChangeEmployer({onlyNew: emplpoyeeSuggest.customInfo.id});
            setIsChange(false);
            return;
        }
        if (isChange) {
            handleChangeEmployer({new: emplpoyeeSuggest.customInfo.id, old: data.id});
            setIsChange(false);
        } else {
            setIsChange(true);
        }
    }, [setIsChange, isChange]);

    const handleRemove = useCallback(() => {
        setIsDeleted(true);
        handleRemoveEmployer({
            id: emplpoyeeSuggest?.customInfo?.id ? emplpoyeeSuggest?.customInfo?.id : data?.id,
        });
        if (isChange && emplpoyeeSuggest.customInfo.id) {
            return handleRemoveEmployer({id: data.id});
        }
        if (!isChange && emplpoyeeSuggest.customInfo.id) {
            return handleRemoveEmployer({id: emplpoyeeSuggest.customInfo.id});
        }
        return data?.id;
    }, [isChange, emplpoyeeSuggest, handleRemoveEmployer]);

    return (
        <div className={cx(css.GantPage__field, isDeleted ? css.GantPage__field_deleted : '')}>
            {isChange ? (
                <Suggest
                    placeholder="Начните вводить ФИО"
                    onChange={setEmployeeName}
                    onSelect={handleEmployeeSelect}
                    value={employeeName}
                    items={employeesSuggestions?.map((item) => ({
                        label: item.full_name,
                        info: item.phone,
                        customInfo: {
                            id: item.id,
                        },
                    }))}
                />
            ) : (
                <Text variant="body-2">
                    {employeeName ? employeeName : isNew ? employeeName : data.full_name}
                </Text>
            )}
            <div className={css.GantPage__actions}>
                <Button onClick={handleChange} view={isChange ? 'action' : 'normal'}>
                    {isChange ? 'Применить' : 'Изменить'}
                </Button>
                <Button onClick={handleRemove} view="outlined-danger">
                    Удалить
                </Button>
            </div>
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
    const {fetch: recreateSchedule} = useFetchRequestEmployeesUpdate();

    const [newEmployeers, setNewEmployeers] = useState([]);
    const [isOpenedModal, setOpenModal] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        refetch();
    }, [dateValue]);

    useEffect(() => {
        setNewEmployeers([]);
    }, [isOpenedModal]);

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

    const handleOpenModal = useCallback(
        (value, data = null) => {
            setOpenModal(value);
            if (!data) {
                return;
            }
            setRequestData(data);
            if (data.employees) {
                setEmployeeList(data.employees.map((item) => item.id));
            }
        },
        [setOpenModal, setRequestData],
    );

    const handleChangeEmployer = useCallback(
        (data) => {
            if (data.onlyNew) {
                const employesToFilter = [...employeeList];
                employesToFilter.push(data.onlyNew);
                setEmployeeList(employesToFilter);
                return;
            }
            if (data.old && data.new) {
                const employesToFilter = [...employeeList].filter((id) => id !== data.old);
                employesToFilter.push(data.new);
                setEmployeeList(employesToFilter);
            }
        },
        [setEmployeeList, employeeList],
    );

    const handleRemoveEmployer = useCallback(
        (data) => {
            if (data.id) {
                const employesToFilter = [...employeeList].filter((id) => id !== data.id);
                setEmployeeList(employesToFilter);
            }
        },
        [setEmployeeList, employeeList],
    );

    const handleSaveResult = useCallback(() => {
        recreateSchedule({id: requestData.id, data: employeeList});
        handleOpenModal(false);
        refetch();
    }, [employeeList, newEmployeers, recreateSchedule, requestData, newEmployeers]);

    const handleAddNew = useCallback(() => {
        setNewEmployeers([...newEmployeers, 1]);
    }, [newEmployeers, setNewEmployeers]);

    return (
        <div className={css.GantPage}>
            <Modal
                open={isOpenedModal}
                onClose={handleOpenModal}
                onOutsideClick={() => setOpenModal(false)}
            >
                <div className={css.GantPage__modal}>
                    <Text variant="header-1" className={css.GantPage__header}>
                        Ответственные
                    </Text>
                    {requestData?.employees?.map((item) => {
                        return (
                            <GantPageField
                                key={item.id}
                                data={item}
                                handleChangeEmployer={handleChangeEmployer}
                                handleRemoveEmployer={handleRemoveEmployer}
                            />
                        );
                    })}
                    {newEmployeers.map((id, idx) => {
                        return (
                            <GantPageField
                                key={idx}
                                isNew={true}
                                handleChangeEmployer={handleChangeEmployer}
                                handleRemoveEmployer={handleRemoveEmployer}
                            />
                        );
                    })}
                    <Button onClick={handleAddNew}>Добавить</Button>
                    <div className={css.GantPage__modalActions}>
                        <Button
                            onClick={handleSaveResult}
                            size="xl"
                            view="action"
                            className={css.GantPage__submit}
                        >
                            Сохранить
                        </Button>
                        <Button
                            onClick={() => handleOpenModal(false)}
                            size="xl"
                            className={css.GantPage__submit}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </Modal>
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
            <Button onClick={handleDynamicSchedule}>Динамическое распределение</Button>
            <div className={css.appContainer}>
                <GanttSidebar requests={sheduledRequests} />
                <GanttChart requests={sheduledRequests} openModal={handleOpenModal} />
            </div>
        </div>
    );
};
