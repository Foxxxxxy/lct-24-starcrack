import {DatePicker} from '@gravity-ui/date-components';
import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback, useMemo, useState} from 'react';
import {Field as BaseField, Form} from 'react-final-form';

import {useQuery} from '@tanstack/react-query';
import {fetchPassenger, fetchPassengerById} from 'src/api/queries';
import {Field} from 'src/components/Field/Field';
import css from './RequestPage.module.scss';

import {useNavigate} from 'react-router-dom';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {passengerCategories} from 'src/constants';

export const RequestPage: FC = () => {
    const navigate = useNavigate();
    const [passengerSuggest, setPassengerSuggest] = useState<SuggestItem>();
    const [passengerName, setPassengerName] = useState('');
    const [stationStart, setStationStart] = useState('');
    const [stationEnd, setStationEnd] = useState('');

    const passengerQuery = useQuery({
        queryKey: ['passengerData'],
        queryFn: () => fetchPassenger(passengerName),
    });

    // const metroStationsQuery = useQuery({
    //     queryKey: ['metroStationsData'],
    //     queryFn: () => fetchMetroStations(stationStart),
    // });

    const passengerByIdQuery = useQuery({
        queryKey: ['passengerByIdData'],
        queryFn: () => fetchPassengerById(passengerSuggest?.customInfo?.id),
    });

    const passengerQuerySpec = useMemo(() => {
        if (!passengerQuery.data) {
            return {
                enum: [],
                meta: {},
                desc: {},
            };
        }
        return {
            enum: passengerQuery.data.map((item) => String(item.id)),
            meta: Object.fromEntries(
                passengerQuery.data.map((item) => {
                    return [item.id, item.phone];
                }),
            ),
            desc: Object.fromEntries(
                passengerQuery.data.map((item) => {
                    return [item.id, item.name];
                }),
            ),
        };
    }, [passengerQuery.data]);

    const handlePassengerAction = useCallback(() => {
        navigate('/passenger?back=true');
    }, [navigate]);

    const handlePassengerSelect = useCallback((item) => {
        setPassengerSuggest(item);
    }, []);

    const handleFormSubmit = useCallback(
        (form) => {
            navigate('/requests/123');
        },
        [navigate],
    );

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
                                <BaseField name="pass">
                                    {() => (
                                        <Suggest
                                            placeholder="Начните вводить ФИО"
                                            actionText="Создать пассажира"
                                            onChange={setPassengerName}
                                            onSelect={handlePassengerSelect}
                                            onAction={handlePassengerAction}
                                            value={passengerName}
                                            items={passengerQuery.data?.map((item) => ({
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
                                <BaseField name="arr">
                                    {() => (
                                        <Suggest
                                            placeholder="Начните вводить название станции прибытия"
                                            value={stationStart}
                                            onChange={setStationStart}
                                            items={metroStationsQuery.data?.map((item) => ({
                                                label: item.name,
                                            }))}
                                        />
                                    )}
                                </BaseField>
                            </Field>
                            <Field label="Станция прибытия">
                                <BaseField name="arr">
                                    {() => (
                                        <Suggest
                                            placeholder="Начните вводить название станции прибытия"
                                            value={stationEnd}
                                            onChange={setStationEnd}
                                            items={metroStationsQuery.data?.map((item) => ({
                                                label: item.name,
                                            }))}
                                        />
                                    )}
                                </BaseField>
                            </Field>
                            <Field label="Дата заявки">
                                <BaseField name="date">
                                    {(fieldProps) => <DatePicker value={fieldProps.input.value} />}
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
                                name={'passengersCount'}
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
                                name={'mens_count'}
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
                                name={'womens_count'}
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
                                name={'luggage_info'}
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
                                name={'info'}
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
                            <Button onClick={() => handleFormSubmit(props)}>Создать заявку</Button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};
