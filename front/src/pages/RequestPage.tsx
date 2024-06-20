import {DatePicker} from '@gravity-ui/date-components';
import {
    dynamicConfig,
    DynamicField,
    DynamicView,
    dynamicViewConfig,
    SpecTypes,
} from '@gravity-ui/dynamic-forms';
import {Button, Select, Text, useToaster} from '@gravity-ui/uikit';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Field as BaseField, Form, FormRenderProps} from 'react-final-form';

import {Field} from 'src/components/Field/Field';
import css from './RequestPage.module.scss';

import {dateTime, DateTime, dateTimeParse} from '@gravity-ui/date-utils';
import {useStore} from '@tanstack/react-store';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {
    useFetchCreateRequest,
    useFetchDeleteRequest,
    useFetchMetroRoute,
    useFetchMetroStations,
    useFetchPassengerById,
    useFetchPassengerSuggestion,
    useFetchRequestById,
    useFetchUpdateRequest,
    useFetchUpdateStatus,
} from 'src/api/routes';
import {Loader} from 'src/components/Loader/Loader';
import {Suggest, SuggestItem} from 'src/components/Suggest/Suggest';
import {FORMAT, mapMethod, mapMethodBack} from 'src/constants';
import {statuses, useStatus} from 'src/hooks/useStatus';
import {store} from 'src/store/state';
import {Request, RequestStatus} from 'src/types';

export const RequestPage: FC = () => {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const {add} = useToaster();

    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin';

    const editId = searchParams.get('editId');

    const requestInfo = useFetchRequestById(editId);

    const passengerById = useFetchPassengerById(requestInfo?.passenger_id ?? '');

    const {fetch: createRequest} = useFetchCreateRequest();
    const {fetch: updateRequest} = useFetchUpdateRequest();
    const {fetch: fetchDeleteRequest} = useFetchDeleteRequest();

    const [passengerSuggest] = useState<SuggestItem>({
        info: '',
        label: '',
        customInfo: {},
    });

    const [passengerName, setPassengerName] = useState('');
    const [stationStart, setStationStart] = useState('');
    const [stationEnd, setStationEnd] = useState('');
    const [date, setDate] = useState<DateTime>(dateTime());

    const [stationStartForRoute, setStationStartForRoute] = useState('');
    const [stationEndForRoute, setStationEndForRoute] = useState('');

    const passengersSuggestion = useFetchPassengerSuggestion(passengerName);
    const metroDepartureSuggestion = useFetchMetroStations(stationStart);
    const metroArrivalSuggestion = useFetchMetroStations(stationEnd);

    const fetchMetroRoute = useFetchMetroRoute({
        from: stationStartForRoute,
        to: stationEndForRoute,
    });

    const metroRoute = useMemo(() => {
        return fetchMetroRoute?.path.join(' -> ');
    }, [fetchMetroRoute]);

    const handlePassengerAction = useCallback(() => {
        navigate('/passengers/create?back=true');
    }, [navigate]);

    const handlePassengerSelect = useCallback(
        (item: SuggestItem) => {
            passengerSuggest.info = item.info;
            passengerSuggest.label = item.label;
            passengerSuggest.customInfo = item.customInfo;
        },
        [passengerSuggest],
    );

    const handleFormSubmit = useCallback(
        async (form: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {
            const {values} = form;

            const request: Request = {
                passenger_id: passengerSuggest?.customInfo?.id,
                passengers_amount: +values['passengers_amount']?.value,
                start_time:
                    dateTimeParse({
                        year: date?.year(),
                        month: date?.month(),
                        day: date?.date(),
                        hours: values['start_time']?.hours,
                        minutes: values['start_time']?.minutes,
                    })?.format(FORMAT) || '',
                males_needed: +values['males_needed']?.value,
                females_needed: +values['females_needed']?.value,
                start_station: stationStart,
                end_station: stationEnd,
                method: mapMethodBack[values['request_method']],
                baggage: values['baggage'] ?? '',
                comment: values['comment'] ?? '',
                start_station_comment: '',
                end_station_comment: '',
            };

            if (editId) {
                await updateRequest({
                    ...request,
                    id: +editId,
                })
                    .then(() => {
                        add({
                            name: 'requests-edit-success',
                            title: 'Заявка успешно изменена',
                            theme: 'success',
                        });
                        navigate(`/requests/${editId}`);
                    })
                    .catch(() => {
                        add({
                            name: 'requests-edit-failture',
                            title: 'Что-то пошло не так :(',
                            theme: 'danger',
                        });
                    });
            } else {
                try {
                    const res = await createRequest(request);
                    add({
                        name: 'requests-create-success',
                        title: 'Заявка успешно создана',
                        theme: 'success',
                    });
                    navigate(`/requests/${res.data.id}`);
                } catch {
                    add({
                        name: 'requests-create-failture',
                        title: 'Что-то пошло не так :(',
                        theme: 'danger',
                    });
                }
            }
        },
        [navigate, stationEnd, stationStart, date],
    );

    const handleDateUpdate = useCallback(
        (data: DateTime) => {
            setDate(data);
        },
        [setDate],
    );

    useEffect(() => {
        if (editId && passengerById && requestInfo) {
            setPassengerName(passengerById.name);
            passengerSuggest.customInfo = {id: passengerById.id};
            setStationStart(requestInfo.start_station);
            setStationEnd(requestInfo.end_station);
            setDate(dateTimeParse(requestInfo.start_time));
            setStationStartForRoute(requestInfo.start_station);
            setStationEndForRoute(requestInfo.end_station);
        }
    }, [
        requestInfo,
        passengerById,
        dateTimeParse,
        mapMethod,
        setStationStart,
        setPassengerName,
        setDate,
        setStationStartForRoute,
        setStationEndForRoute,
    ]);

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
        await fetchDeleteRequest(String(editId))
            .then(() => {
                add({
                    name: 'requests-delete-success',
                    title: 'Заявка успешно удалена',
                    theme: 'success',
                });
                navigate('/');
            })
            .catch(() => {
                add({
                    name: 'requests-delete-failture',
                    title: 'Что-то пошло не так :(',
                    theme: 'danger',
                });
            });
    }, [navigate]);

    const [currentStatus, setCurrentStatus] = useState(requestInfo?.status);

    useEffect(() => {
        setCurrentStatus(requestInfo?.status);
    }, [requestInfo]);

    const {fetch: updateStatus} = useFetchUpdateStatus();

    const handleSelectUpdate = useCallback(
        (status) => {
            setCurrentStatus(status[0]);

            //@ts-ignore
            updateStatus({
                id: editId,
                new_status: status[0],
            });
        },
        [useStatus, setCurrentStatus],
    );

    const handleSelectMetroStart = useCallback(
        (item) => {
            setStationStartForRoute(item.label);
        },
        [setStationStartForRoute],
    );

    const handleSelectMetroEnd = useCallback(
        (item) => {
            setStationEndForRoute(item.label);
        },
        [setStationEndForRoute],
    );

    if (editId && (!requestInfo || !passengerById)) {
        return <Loader />;
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
                        {editId && (
                            <Text className={css.RequestPage__statusTitle}>
                                Нажмите чтобы выбрать новый статус:
                            </Text>
                        )}
                        <Select
                            className={css.RequestPage__status}
                            onUpdate={handleSelectUpdate}
                            renderControl={({onClick, ref}) => {
                                return (
                                    <div ref={ref} onClick={onClick}>
                                        {useStatus(currentStatus)}
                                    </div>
                                );
                            }}
                        >
                            {Object.keys(statuses).map((status: RequestStatus) => {
                                return (
                                    <Select.Option key={statuses[status].name} value={status}>
                                        {useStatus(status)}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                        <div className={css.RequestPage__formLeft}>
                            <DynamicView
                                value={{
                                    value: fetchMetroRoute?.eta
                                        ? Math.round(fetchMetroRoute?.eta * 100) / 100 + 'м'
                                        : null,
                                }}
                                spec={{
                                    type: SpecTypes.Object,
                                    properties: {
                                        value: {
                                            type: SpecTypes.String,
                                            viewSpec: {
                                                type: 'base',
                                            },
                                        },
                                    },
                                    viewSpec: {
                                        type: 'object_value',
                                        layout: 'row',
                                        layoutTitle: 'Приблизительное время прибытия',
                                    },
                                }}
                                config={dynamicViewConfig}
                            />
                            <DynamicView
                                value={{
                                    value: passengerSuggest.customInfo?.passenger_category,
                                }}
                                spec={{
                                    type: SpecTypes.Object,
                                    properties: {
                                        value: {
                                            type: SpecTypes.String,
                                            viewSpec: {
                                                type: 'base',
                                            },
                                        },
                                    },
                                    viewSpec: {
                                        type: 'object_value',
                                        layout: 'row',
                                        layoutTitle: 'Категория заявки',
                                    },
                                }}
                                config={dynamicViewConfig}
                            />
                            <DynamicView
                                value={metroRoute}
                                spec={{
                                    type: SpecTypes.String,
                                    viewSpec: {
                                        type: 'textarea',
                                        layout: 'row',
                                        layoutTitle: 'Путь',
                                    },
                                }}
                                config={dynamicViewConfig}
                            />
                            {/* <Button className={css.RequestPage__people}>
                                Назначить ответственных
                            </Button> */}
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
                                                    passenger_category: item.passenger_category,
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
                                            onSelect={handleSelectMetroStart}
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
                                            onSelect={handleSelectMetroEnd}
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
                                            value={date}
                                            defaultValue={dateTimeParse(date)}
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
                                        {userRole === 'Admin' ? (
                                            <Button
                                                size="xl"
                                                view="action"
                                                onClick={() => handleFormSubmit(props)}
                                            >
                                                Изменить заявку
                                            </Button>
                                        ) : undefined}

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
