import {DatePicker, RangeCalendar} from '@gravity-ui/date-components';
import {DateTime, dateTime} from '@gravity-ui/date-utils';
import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text, useToaster} from '@gravity-ui/uikit';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Field as BaseField, Form, FormRenderProps} from 'react-final-form';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Shift} from 'src/types';
import {
    useFetchCreateShift,
    useFetchEmployeeById,
    useFetchEmployeeSuggestion,
    useFetchMetroStations,
    useFetchRemoveShift,
    useFetchShiftById,
    useFetchUpdateShift,
} from 'src/api/routes';
import {Field} from 'src/components/Field/Field';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {weeks} from 'src/constants';
import {Loader} from 'src/components/Loader/Loader';
import css from './WorkTimePage.module.scss';

function parseTimeToHoursAndMinutes(timeStr: string): {hours: number; minutes: number} {
    const timePattern = /^(\d{2}):(\d{2}):(\d{2})$/;
    const match = timeStr.match(timePattern);

    if (!match) {
        throw new Error('Invalid time format');
    }

    // Extract hours and minutes from the matched groups
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    return {hours, minutes};
}

export const WorkTimePage: FC = () => {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const {add} = useToaster();

    const {fetch: createShift} = useFetchCreateShift();
    const {fetch: updateShift} = useFetchUpdateShift();
    const {fetch: removeShift} = useFetchRemoveShift();

    const editId = searchParams.get('editId');

    const shift = useFetchShiftById(editId ?? '');
    const employeeById = useFetchEmployeeById(shift?.employee_id ?? '');

    const [employeeName, setEmployeeName] = useState('');
    const [metroName, setMetroName] = useState('');

    const employeesSuggestions = useFetchEmployeeSuggestion(employeeName);
    const metroSuggestion = useFetchMetroStations(metroName);

    const initialForm = useMemo(() => {
        if (!shift || !editId) {
            return {};
        }

        const start = parseTimeToHoursAndMinutes(shift.time_start);
        const end = parseTimeToHoursAndMinutes(shift.time_end);
        return {
            start_time: {
                hours: start.hours,
                minutes: start.minutes,
            },
            finish_time: {
                hours: end.hours,
                minutes: end.minutes,
            },
            place_start: metroName,
        };
    }, [employeeById, editId]);

    const [emplpoyeeSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const [metroSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const [date, setDate] = useState(dateTime());

    useEffect(() => {
        if (editId && employeeById && shift) {
            setEmployeeName(employeeById?.full_name);
            emplpoyeeSuggest.customInfo = {id: employeeById.id};
            setMetroName(shift.place_start);
        }
    }, [editId, employeeById, shift, setMetroName, setEmployeeName]);

    const handleDateUpdate = useCallback(
        (dateTime: DateTime) => {
            setDate(dateTime);
        },
        [setDate],
    );

    const handleEmployeeAction = useCallback(() => {
        navigate('/employee/create?back=true');
    }, [navigate]);

    const handleEmployeeSelect = useCallback(
        (item: SuggestItem) => {
            emplpoyeeSuggest.info = item.info;
            emplpoyeeSuggest.label = item.label;
            emplpoyeeSuggest.customInfo = item.customInfo;
        },
        [emplpoyeeSuggest],
    );

    const handleMetroSelect = useCallback(
        (item: SuggestItem) => {
            metroSuggest.info = item.info;
            metroSuggest.label = item.label;
            metroSuggest.customInfo = item.customInfo;
        },
        [metroSuggest],
    );

    const formatToTimestamp = useCallback((hours: number, minutes: number) => {
        const date = new Date();

        date.setUTCHours(0, 0, 0, 0);

        date.setUTCHours(hours, minutes, 0, 0);

        const isoString = date.toISOString();
        const timePart = isoString.split('T')[1];

        return timePart;
    }, []);

    const handleFormDelete = useCallback(async () => {
        await removeShift(String(editId))
            .then(() => {
                add({
                    name: 'shift-delete-success',
                    title: 'Рабочий день успешно удален',
                    theme: 'success',
                });
                navigate('/work-time');
            })
            .catch(() => {
                add({
                    name: 'shift-delete-error',
                    title: 'Что-то пошло не так :(',
                    theme: 'danger',
                });
            })
    }, [navigate]);

    const handleSubmit = useCallback(
        async (form: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {
            const {values} = form;

            const request: Shift = {
                employee_id: emplpoyeeSuggest.customInfo?.id,
                weekday: weeks[date.weekday()],
                time_start: formatToTimestamp(
                    values['start_time']?.hours,
                    values['start_time']?.minutes,
                ),
                time_end: formatToTimestamp(
                    values['finish_time']?.hours,
                    values['finish_time']?.minutes,
                ),
                place_start: editId ? shift?.place_start : metroSuggest.label,
            };

            if (editId) {
                await updateShift({
                    ...request,
                    id: +editId,
                })
                    .then(() => {
                        add({
                            name: 'shift-edit-success',
                            title: 'Рабочий день успешно изменен',
                            theme: 'success',
                        });
                        navigate(`/work-time`);
                    })
                    .catch(() => {
                        add({
                            name: 'shift-edit-error',
                            title: 'Что-то пошло не так :(',
                            theme: 'danger',
                        });
                    });
            } else {
                await createShift(request)
                    .then(() => {
                        add({
                            name: 'shift-create-success',
                            title: 'Рабочий день успешно создан',
                            theme: 'success',
                        });
                        navigate(`/work-time`);
                    })
                    .catch(() => {
                        add({
                            name: 'shift-create-error',
                            title: 'Что-то пошло не так :(',
                            theme: 'danger',
                        })
                    });
            }
        },
        [shift, emplpoyeeSuggest, weeks, date, metroSuggest],
    );

    if (editId && (!shift || !employeeById || !metroName)) {
        return (
            <Loader />
        )
    }

    return (
        <div className={css.WorkTimePage}>
            <header className={css.WorkTimePage__header}>
                <Text variant="display-1">Создание рабочего дня</Text>
            </header>
            <Form
                onSubmit={() => {}}
                initialValues={initialForm}
                render={(props) => (
                    <div className={css.WorkTimePage__form}>
                        <Field label="Выбор сотрудника">
                            <BaseField name="employee">
                                {() => (
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
                                )}
                            </BaseField>
                        </Field>
                        <Field label="Станция отправления">
                            <BaseField name="metro_arrival">
                                {() => (
                                    <Suggest
                                        placeholder="Начните вводить название станции"
                                        value={metroName}
                                        onSelect={handleMetroSelect}
                                        onChange={setMetroName}
                                        items={metroSuggestion?.map((item) => ({
                                            label: item.station_name,
                                            customInfo: {
                                                id: item.id,
                                            },
                                        }))}
                                    />
                                )}
                            </BaseField>
                        </Field>
                        <Field label="Дата выхода">
                            <BaseField name="date">
                                {() => (
                                    <DatePicker
                                        value={date}
                                        onUpdate={handleDateUpdate}
                                        format="DD.MM.YYYY"
                                    />
                                )}
                            </BaseField>
                        </Field>
                        <DynamicField
                            name={'start_time'}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    hours: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Часы',
                                            layout: 'transparent',
                                            layoutTitle: 'Name',
                                        },
                                    },
                                    minutes: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Минуты',
                                            layout: 'transparent',
                                            layoutTitle: 'Name',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'inline',
                                    layout: 'row',
                                    layoutTitle: 'Время начала смены',
                                    delimiter: {
                                        type: ':',
                                    },
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'finish_time'}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    hours: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Часы',
                                            layout: 'transparent',
                                            layoutTitle: 'Name',
                                        },
                                    },
                                    minutes: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Минуты',
                                            layout: 'transparent',
                                            layoutTitle: 'Name',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'inline',
                                    layout: 'row',
                                    layoutTitle: 'Время конца смены',
                                    delimiter: {
                                        type: ':',
                                    },
                                },
                            }}
                            config={dynamicConfig}
                        />

                        <Field label="Выходные">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Отпуск">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Больничный">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Дополнительная смена">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Учеба с отрывом от производства">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <DynamicField
                            name={'is_easy'}
                            spec={{
                                type: SpecTypes.Boolean,
                                viewSpec: {
                                    type: 'switch',
                                    layout: 'row',
                                    layoutTitle: 'Стажировка',
                                },
                            }}
                            config={dynamicConfig}
                        />

                        <div className={css.WorkTimePage__actions}>
                            {editId ? (
                                <>
                                    <Button
                                        size="xl"
                                        view="action"
                                        onClick={() => handleSubmit(props)}
                                    >
                                        Изменить рабочий день
                                    </Button>
                                    <Button
                                        size="xl"
                                        view="outlined-danger"
                                        onClick={handleFormDelete}
                                    >
                                        Удалить рабочий день
                                    </Button>
                                </>
                            ) : (
                                <Button size="xl" onClick={() => handleSubmit(props)}>
                                    Создать рабочий день
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            ></Form>
        </div>
    );
};
