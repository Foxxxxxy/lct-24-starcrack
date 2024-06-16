import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback, useMemo} from 'react';

import {DynamicView, dynamicViewConfig, SpecTypes} from '@gravity-ui/dynamic-forms';
import {useStore} from '@tanstack/react-store';
import {Form} from 'react-final-form';
import {useNavigate, useParams} from 'react-router-dom';
import {useFetchMetroRoute, useFetchPassengerById, useFetchRequestById} from 'src/api/routes';
import {mapMethod} from 'src/constants';
import {useDateTime} from 'src/hooks/useDateTime';
import {useStatus} from 'src/hooks/useStatus';
import {store} from 'src/store/state';
import css from './RequestInfoPage.module.scss';

export const RequestInfoPage: FC = () => {
    const params = useParams();
    const navigate = useNavigate();
    const requestInfo = useFetchRequestById(params.id ?? '');

    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin';

    const passengerById = useFetchPassengerById(requestInfo?.passenger_id ?? '');

    const handleUpdate = useCallback(() => {
        navigate(`/requests/create?editId=${params.id}`);
    }, [navigate, params]);

    const fetchMetroRoute = useFetchMetroRoute({
        from: requestInfo?.start_station ?? '',
        to: requestInfo?.end_station ?? '',
    });

    const metroRoute = useMemo(() => {
        return fetchMetroRoute?.path.join(' -> ');
    }, [fetchMetroRoute]);

    return (
        <div className={css.RequestInfoPage}>
            <header className={css.RequestInfoPage__header}>
                <Text variant="display-1">Информация о заявке</Text>
            </header>
            <Form
                onSubmit={() => {}}
                render={() => (
                    <div>
                        <div className={css.RequestInfoPage__status}>
                            {useStatus(requestInfo?.status ?? '')}
                        </div>
                        <DynamicView
                            value={{
                                value: passengerById?.name,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Пассажир',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'ФИО пассажира',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: `${requestInfo?.start_station} -> ${requestInfo?.end_station}`,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Станция отправления -> прибытия',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Станция отправления -> прибытия',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: useDateTime(requestInfo?.creation_time ?? '').formatted,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Дата создания заявки',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Дата создания заявки',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: useDateTime(requestInfo?.start_time ?? '').formatted,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Дата начала выполнения заявки',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Дата начала выполнения заявки',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: useDateTime(requestInfo?.finish_time).formatted,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Дата завершения выполнения заявки',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Дата завершения выполнения заявки',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: mapMethod[requestInfo?.method ?? ''],
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Метод приема заявки',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Метод приема заявки',
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
                        <DynamicView
                            value={{
                                value: requestInfo?.passengers_amount,
                            }}
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
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: passengerById?.passenger_category,
                            }}
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
                                    layoutTitle: 'Категория заявки',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: requestInfo?.males_needed,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Кол-во мужчин',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Кол-во мужчин',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: requestInfo?.females_needed,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Кол-во девушек',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Кол-во девушек',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={requestInfo?.baggage}
                            spec={{
                                type: SpecTypes.String,
                                viewSpec: {
                                    type: 'textarea',
                                    layout: 'row',
                                    layoutTitle: 'Информация о багаже',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={requestInfo?.comment}
                            spec={{
                                type: SpecTypes.String,
                                viewSpec: {
                                    type: 'textarea',
                                    layout: 'row',
                                    layoutTitle: 'Дополнительная информация',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        {userRole === 'Admin' ? (
                            <Button onClick={handleUpdate}>Изменить заявку</Button>
                        ) : null}
                    </div>
                )}
            ></Form>
        </div>
    );
};
