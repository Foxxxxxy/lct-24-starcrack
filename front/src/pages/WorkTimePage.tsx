import {DatePicker, RangeCalendar} from '@gravity-ui/date-components';
import {DateTime, dateTime} from '@gravity-ui/date-utils';
import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback, useState} from 'react';
import {Field as BaseField, Form, FormRenderProps} from 'react-final-form';
import {useNavigate} from 'react-router-dom';
import {
    useFetchCreateShift,
    useFetchEmployeeSuggestion,
    useFetchMetroStations,
} from 'src/api/routes';
import {Field} from 'src/components/Field/Field';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {weeks} from 'src/constants';
import css from './WorkTimePage.module.scss';

export const WorkTimePage: FC = () => {
    const navigate = useNavigate();

    const {fetch: createShift} = useFetchCreateShift();

    const [employeeName, setEmployeeName] = useState('');
    const [metroName, setMetroName] = useState('');

    const employeesSuggestions = useFetchEmployeeSuggestion(employeeName);
    const metroSuggestion = useFetchMetroStations(metroName);

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

    const handleSubmit = useCallback(
        (form: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {
            const {values} = form;

            const request = {
                id: emplpoyeeSuggest.customInfo?.id,
                weekday: weeks[date.weekday()],
                finish_time: formatToTimestamp(
                    values['finish_time']?.hours,
                    values['finish_time']?.minutes,
                ),
                start_time: formatToTimestamp(
                    values['start_time']?.hours,
                    values['start_time']?.minutes,
                ),
                place_start: metroSuggest.customInfo?.id,
            };

            createShift(request);
        },
        [emplpoyeeSuggest, weeks, date, metroSuggest],
    );

    return (
        <div className={css.WorkTimePage}>
            <header className={css.WorkTimePage__header}>
                <Text variant="display-1">Создание рабочего дня</Text>
            </header>
            <Form
                onSubmit={() => {}}
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

                        <Button onClick={() => handleSubmit(props)}>Создать рабочий день</Button>
                    </div>
                )}
            ></Form>
        </div>
    );
};
