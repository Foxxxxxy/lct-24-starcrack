import {DatePicker} from '@gravity-ui/date-components';
import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Field as BaseField, Form, FormRenderProps} from 'react-final-form';

import {Field} from 'src/components/Field/Field';
import css from './RequestPage.module.scss';

import {DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {
    useFetchCreateRequest,
    useFetchDeleteRequest,
    useFetchMetroStations,
    useFetchPassengerById,
    useFetchPassengerSuggestion,
    useFetchRequestById,
    useFetchUpdateRequest,
} from 'src/api/routes';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {FORMAT, passengerCategories} from 'src/constants';
import {Request} from 'src/types';
import {mapMethod} from './RequestInfoPage';

export const RequestPage: FC = () => {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();

    const editId = searchParams.get('editId');

    const requestInfo = useFetchRequestById(editId);

    const passengerById = useFetchPassengerById(requestInfo?.passenger_id ?? '');

    const {fetch: createRequest} = useFetchCreateRequest();
    const {fetch: updateRequest} = useFetchUpdateRequest();
    const {fetch: fetchDeleteRequest} = useFetchDeleteRequest();

    const [passengerSuggest, setPassengerSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const [passengerName, setPassengerName] = useState('');
    const [stationStart, setStationStart] = useState('');
    const [stationEnd, setStationEnd] = useState('');
    const [date] = useState<{
        day: number | undefined;
        year: number | undefined;
        month: number | undefined;
    }>({
        day: dateTimeParse(new Date())?.day(),
        year: dateTimeParse(new Date())?.year(),
        month: dateTimeParse(new Date())?.month(),
    });

    const handlePassengerAction = useCallback(() => {
        navigate('/passengers/create?back=true');
    }, [navigate]);

    const handlePassengerSelect = useCallback(
        (item: SuggestItem) => {
            passengerSuggest.info = item.info;
            passengerSuggest.label = item.label;
            passengerSuggest.customInfo = item.customInfo;
        },
        [setPassengerSuggest, passengerSuggest],
    );

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
                        hours: values['start_time']?.hours,
                        minutes: values['start_time']?.minutes,
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

            if (editId) {
                updateRequest({
                    ...request,
                    id: +editId,
                });
            } else {
                createRequest(request);
            }
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

    useEffect(() => {
        if (editId && passengerById && requestInfo) {
            setPassengerName(passengerById.name);
            passengerSuggest.customInfo = {id: passengerById.id};
            setStationStart(requestInfo.start_station);
            setStationEnd(requestInfo.end_station);
            date.day = dateTimeParse(requestInfo.start_time)?.day();
            date.month = dateTimeParse(requestInfo.start_time)?.month();
            date.year = dateTimeParse(requestInfo.start_time)?.year();
            console.log(date);
        }
    }, [requestInfo, passengerById, dateTimeParse, mapMethod]);

    const initialForm = useMemo(() => {
        return {
            passengers_amount: {
                value: requestInfo?.passengers_amount,
            },
            start_time: {
                hours: dateTimeParse(requestInfo?.start_time)?.hour(),
                minutes: dateTimeParse(requestInfo?.start_time)?.minute(),
            },
            request_method: mapMethod[requestInfo?.method ?? ''],
            request_category: passengerById?.passenger_category,
            males_needed: {
                value: requestInfo?.males_needed,
            },
            females_needed: {
                value: requestInfo?.females_needed,
            },
            baggage: requestInfo?.baggage,
            comment: requestInfo?.comment,
        };
    }, [requestInfo, passengerById, dateTimeParse, mapMethod]);

    const handleFormDelete = useCallback(async () => {
        await fetchDeleteRequest(String(editId));
        navigate('/');
    }, [navigate]);

    if (editId && (!requestInfo || !passengerById)) {
        return 'loading';
    }
    return (
        <div className={css.RequestPage}>
            <header className={css.RequestPage__header}>
                <Text variant="display-1">Создание заявки</Text>
            </header>
            <Form
                initialValues={editId ? initialForm : {}}
                onSubmit={() => {}}
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
                                            value={dateTimeParse(date)}
                                            onUpdate={handleDateUpdate}
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
                            <div className={css.RequestPage__actions}>
                                {editId ? (
                                    <>
                                        <Button
                                            size="xl"
                                            view="action"
                                            onClick={() => handleFormSubmit(props)}
                                        >
                                            Изменить заявку
                                        </Button>
                                        <Button
                                            size="xl"
                                            view="outlined-danger"
                                            onClick={handleFormDelete}
                                        >
                                            Удалить заявку
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="xl" onClick={() => handleFormSubmit(props)}>
                                        Создать заявку
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};
