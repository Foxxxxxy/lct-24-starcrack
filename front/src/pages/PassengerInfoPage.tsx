import {DynamicView, dynamicViewConfig, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback} from 'react';
import {Form} from 'react-final-form';
import {useNavigate, useParams} from 'react-router-dom';
import {useFetchPassengerById, useFetchRemovePassenger} from 'src/api/routes';
import {mapSex, passengerCategories} from 'src/constants';
import css from './PassengerInfoPage.module.scss';

export const PassengerInfoPage: FC = () => {
    const params = useParams();

    const passenger = useFetchPassengerById(params.id ?? '');

    const {fetch: removePassenger} = useFetchRemovePassenger();

    const navigate = useNavigate();

    const handleEditPassenger = useCallback(() => {
        navigate(`/passengers/create?editId=${passenger?.id}`);
    }, [passenger]);

    const handleRemovePassenger = useCallback(async () => {
        await removePassenger(passenger?.id ?? '');
        navigate('/passengers');
    }, [passenger]);

    return (
        <div className={css.PassengerInfoPage}>
            <header className={css.PassengerInfoPage__header}>
                <Text variant="display-1">Информация о пассажире</Text>
            </header>
            <Form
                onSubmit={() => {}}
                render={(props) => (
                    <div className={css.PassengerInfoPage__form}>
                        <DynamicView
                            value={{
                                value: passenger?.name,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'ФИО пассажира',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'ФИО пассажира',
                                },
                                validator: 'number',
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: passenger?.phone,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Номер телефона',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Номер телефона',
                                },
                                validator: 'number',
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={mapSex[passenger?.sex ?? '']}
                            spec={{
                                type: SpecTypes.String,
                                enum: ['М', 'Ж'],
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Пол',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={passenger?.passenger_category}
                            spec={{
                                type: SpecTypes.String,
                                enum: passengerCategories,
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Категория пассажира',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={passenger?.pacemaker ? 'Да' : 'Нет'}
                            spec={{
                                type: SpecTypes.Boolean,
                                viewSpec: {
                                    type: 'switch',
                                    layout: 'row',
                                    layoutTitle: 'ЭКС',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={passenger?.comment}
                            spec={{
                                type: SpecTypes.String,
                                viewSpec: {
                                    type: 'textarea',
                                    layout: 'row',
                                    layoutTitle: 'Дополнительная информация',
                                    placeholder:
                                        'Напишите здесь всю необходимую информацию о пассажире',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <div className={css.PassengerInfoPage__actions}>
                            <Button view="action" onClick={handleEditPassenger}>
                                Изменить пассажира
                            </Button>
                            <Button view="outlined-danger" onClick={handleRemovePassenger}>
                                Удалить пассажира
                            </Button>
                        </div>
                    </div>
                )}
            ></Form>
        </div>
    );
};
