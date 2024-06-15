import {DatePicker} from '@gravity-ui/date-components';
import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback, useMemo, useState} from 'react';
import {Field as BaseField, Form, FormRenderProps} from 'react-final-form';

import {Field} from 'src/components/Field/Field';
import css from './RequestPage.module.scss';

import {DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {useNavigate} from 'react-router-dom';
import {
    useFetchCreateRequest,
    useFetchMetroStations,
    useFetchPassengerSuggestion,
} from 'src/api/routes';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {passengerCategories} from 'src/constants';
import {Request} from 'src/types';

export const RequestPage: FC = () => {
    const navigate = useNavigate();

    const {fetch: createRequest} = useFetchCreateRequest();

    const [passengerSuggest, setPassengerSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const [passengerName, setPassengerName] = useState('');
    const [stationStart, setStationStart] = useState('');
    const [stationEnd, setStationEnd] = useState('');
    const [date] = useState<{
        day: number | null;
        year: number | null;
        month: number | null;
    }>({
        day: null,
        year: null,
        month: null,
    });

    const handlePassengerAction = useCallback(() => {
        navigate('/passenger?back=true');
    }, [navigate]);

    const handlePassengerSelect = useCallback(
        (item: SuggestItem) => {
            passengerSuggest.info = item.info;
            passengerSuggest.label = item.label;
            passengerSuggest.customInfo = item.customInfo;
        },
        [setPassengerSuggest, passengerSuggest],
    );
    const FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

    const handleFormSubmit = useCallback(
        (form: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {
            const {values} = form;

            const mapMethod: Record<string, Request['method']> = {
                'Электронные сервисы': 'Telephone',
                'По телефону': 'WebServices',
            };

            const request: Request = {
                passenger_id: passengerSuggest?.customInfo?.id,
                passengers_amount: +values['passengers_amount']?.value,
                start_time:
                    dateTimeParse({
                        year: date.year || 0,
                        month: date.month || 0,
                        day: date.day || 0,
                        hours: values['meet_time']?.hours,
                        minutes: values['meet_time']?.minutes,
                    })?.format(FORMAT) || '',
                males_needed: +values['males_needed']?.value,
                females_needed: +values['females_needed']?.value,
                start_station: stationStart,
                end_station: stationEnd,
                method: mapMethod[values['request_method']],
                baggage: values['baggage'] ?? '',
                comment: values['comment'] ?? '',
                meet_time:
                    dateTimeParse({
                        year: date.year || 0,
                        month: date.month || 0,
                        day: date.day || 0,
                        hours: values['meet_time']?.hours,
                        minutes: values['meet_time']?.minutes,
                    })?.format(FORMAT) || '',
                creation_time: dateTimeParse(new Date())?.format(FORMAT) || '',
                status: 'SCHEDULED',
                start_station_comment: '',
                end_station_comment: '',
            };

            console.log(request, 'SDSD');
            createRequest(request);
            // navigate('/requests/123');
        },
        [navigate],
    );

    const handleDateUpdate = useCallback((data: DateTime) => {
        date.day = data.day();
        date.year = data.year();
        date.month = data.month();
    }, []);

    const passengersSuggestion = useFetchPassengerSuggestion(passengerName);
    const metroDepartureSuggestion = useFetchMetroStations(stationStart);
    const metroArrivalSuggestion = useFetchMetroStations(stationEnd);

    const isFormValid = useMemo(() => {
        // if ()
    }, []);

    const isValidForm = useCallback(() => {}, []);

    return (
        <div className={css.RequestPage}>
            <header className={css.RequestPage__header}>
                <Text variant="display-1">Создание заявки</Text>
            </header>
            <Form
                onSubmit={() => {}}
                validate={() => {}}
                render={(props) => (
                    <div className={css.RequestPage__form}>
                        {/* {props.form.getState()} */}
                        <div className={css.RequestPage__formLeft}>
                            <Field label="Выбор пассажира">
                                <BaseField name="passenger">
                                    {() => (
                                        <Suggest
                                            placeholder="Начните вводить ФИО"
                                            actionText="Создать пассажира"
                                            onChange={setPassengerName}
                                            onSelect={handlePassengerSelect}
                                            onAction={handlePassengerAction}
                                            value={passengerName}
                                            items={passengersSuggestion?.map((item) => ({
                                                label: item.name,
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
                                <BaseField name="metro_departure">
                                    {() => (
                                        <Suggest
                                            placeholder="Начните вводить название станции отправления"
                                            value={stationStart}
                                            onChange={setStationStart}
                                            items={metroDepartureSuggestion?.map((item) => ({
                                                label: item.station_name,
                                                customInfo: {
                                                    id: item.id,
                                                },
                                            }))}
                                        />
                                    )}
                                </BaseField>
                            </Field>
                            <Field label="Станция прибытия">
                                <BaseField name="metro_arrival">
                                    {() => (
                                        <Suggest
                                            placeholder="Начните вводить название станции прибытия"
                                            value={stationEnd}
                                            onChange={setStationEnd}
                                            items={metroArrivalSuggestion?.map((item) => ({
                                                label: item.station_name,
                                                customInfo: {
                                                    id: item.id,
                                                },
                                            }))}
                                        />
                                    )}
                                </BaseField>
                            </Field>
                            <Field label="Дата заявки">
                                <BaseField name="date">
                                    {() => (
                                        <DatePicker
                                            format="DD.MM.YYYY"
                                            onUpdate={handleDateUpdate}
                                        />
                                    )}
                                </BaseField>
                            </Field>
                            <DynamicField
                                name={'meet_time'}
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
                                        layoutTitle: 'Время встречи',
                                        delimiter: {
                                            type: ':',
                                        },
                                    },
                                }}
                                config={dynamicConfig}
                            />
                        </div>
                        <div className={css.RequestPage__formRight}>
                            <DynamicField
                                name={'request_method'}
                                spec={{
                                    type: SpecTypes.String,
                                    enum: ['По телефону', 'Электронные сервисы'],
                                    viewSpec: {
                                        type: 'select',
                                        layout: 'row',
                                        layoutTitle: 'Метод приема заявки',
                                        placeholder: 'Нажмите, чтобы выбрать метод',
                                    },
                                }}
                                config={dynamicConfig}
                            />
                            <Field name="date" label="Пересадки">
                                <Text>Пересадки</Text>
                            </Field>
                            {/* <DynamicField
                                name={'railway-stations'}
                                spec={{
                                    type: SpecTypes.String,
                                    enum: [
                                        'foo',
                                        'bar',
                                        'rab',
                                        'oof',
                                        'fooBar',
                                        'fooOof',
                                        'barFoo',
                                        'barOof',
                                        'fooFoo',
                                        'barBar',
                                    ],
                                    viewSpec: {
                                        type: 'select',
                                        layout: 'row',
                                        layoutTitle: 'Выберите вокзал',
                                        placeholder: 'placeholder text',
                                        selectParams: {
                                            filterPlaceholder: 'filter placeholder',
                                            meta: {
                                                foo: 'Additional text 1',
                                                bar: 'Additional text 2',
                                                rab: 'Additional text 3',
                                                oof: 'Additional text 4',
                                                fooBar: 'Additional text 5',
                                                fooOof: 'Additional text 6',
                                                barFoo: 'Additional text 7',
                                                barOof: 'Additional text 8',
                                                fooFoo: 'Additional text 9',
                                                barBar: 'Additional text 10',
                                            },
                                        },
                                    },
                                }}
                                config={dynamicConfig}
                            /> */}
                            <DynamicField
                                name={'passengers_amount'}
                                spec={{
                                    type: SpecTypes.Object,
                                    properties: {
                                        value: {
                                            type: SpecTypes.String,
                                            viewSpec: {
                                                type: 'base',
                                                placeholder: 'Введите кол-во пассажиров',
                                            },
                                        },
                                    },
                                    viewSpec: {
                                        type: 'object_value',
                                        layout: 'row',
                                        layoutTitle: 'Количество пассажиров',
                                    },
                                    validator: 'number',
                                }}
                                config={dynamicConfig}
                            />
                            <DynamicField
                                name={'request_category'}
                                spec={{
                                    type: SpecTypes.String,
                                    enum: passengerCategories,
                                    viewSpec: {
                                        type: 'select',
                                        layout: 'row',
                                        layoutTitle: 'Категория заявки',
                                        placeholder: 'Нажмите, чтобы выбрать метод',
                                    },
                                }}
                                config={dynamicConfig}
                            />
                            <DynamicField
                                name={'males_needed'}
                                spec={{
                                    type: SpecTypes.Object,
                                    properties: {
                                        value: {
                                            type: SpecTypes.String,
                                            viewSpec: {
                                                type: 'base',
                                                placeholder: 'Введите кол-во выделленных мужчин',
                                            },
                                        },
                                    },
                                    viewSpec: {
                                        type: 'object_value',
                                        layout: 'row',
                                        layoutTitle: 'Кол-во выделенных мужчин',
                                    },
                                }}
                                config={dynamicConfig}
                            />
                            <DynamicField
                                name={'females_needed'}
                                spec={{
                                    type: SpecTypes.Object,
                                    properties: {
                                        value: {
                                            type: SpecTypes.String,
                                            viewSpec: {
                                                type: 'base',
                                                placeholder: 'Введите кол-во выделленных женщин',
                                            },
                                        },
                                    },
                                    viewSpec: {
                                        type: 'object_value',
                                        layout: 'row',
                                        layoutTitle: 'Кол-во выделенных женщин',
                                    },
                                }}
                                config={dynamicConfig}
                            />
                            <DynamicField
                                name={'baggage'}
                                spec={{
                                    type: SpecTypes.String,
                                    viewSpec: {
                                        type: 'textarea',
                                        layout: 'row',
                                        layoutTitle: 'Информация о багаже',
                                        placeholder: '(тип багажа, вес, необходима ли помощь).',
                                    },
                                }}
                                config={dynamicConfig}
                            />
                            <DynamicField
                                name={'comment'}
                                spec={{
                                    type: SpecTypes.String,
                                    viewSpec: {
                                        type: 'textarea',
                                        layout: 'row',
                                        layoutTitle: 'Дополнительная информация',
                                        placeholder:
                                            'Опишите тут место встречи/место прибытия, всю дополнителную информацию',
                                    },
                                }}
                                config={dynamicConfig}
                            />
                            <Button size="xl" onClick={() => handleFormSubmit(props)}>
                                Создать заявку
                            </Button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};
