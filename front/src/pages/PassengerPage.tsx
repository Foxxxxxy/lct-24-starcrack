import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback, useMemo} from 'react';
import {Form, FormRenderProps} from 'react-final-form';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {
    useFetchCreatePassenger,
    useFetchPassengerById,
    useFetchRemovePassenger,
    useFetchUpdatePassenger,
} from 'src/api/routes';
import {mapSex, mapSexBack, passengerCategories} from 'src/constants';
import {Passenger} from 'src/types';
import css from './PassengerPage.module.scss';

export const PassengerPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    let [searchParams] = useSearchParams();

    const editId = searchParams.get('editId');

    const {fetch: createPassenger} = useFetchCreatePassenger();
    const {fetch: updatePassenger} = useFetchUpdatePassenger();
    const {fetch: removePassenger} = useFetchRemovePassenger();

    const passenger = useFetchPassengerById(editId ?? '');

    const initialForm = useMemo(() => {
        if (!passenger || !editId) {
            return {};
        }
        return {
            passengerName: {
                value: passenger.name,
            },
            phone: {
                value: passenger.phone,
            },
            sex: mapSexBack[passenger.sex],
            category: passenger.passenger_category,
            pacemark: passenger.pacemaker,
            comment: passenger.comment,
        };
    }, [passenger, editId]);

    const handleFormSubmit = useCallback(
        async (formProps: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {
            const {values} = formProps;

            const request: Passenger = {
                name: values['passengerName'].value,
                phone: values['phone'].value,
                sex: mapSex[values['sex']],
                pacemaker: values['pacemaker'] ?? false,
                passenger_category: values['category'],
                comment: values['comment'],
            };

            const back = location.search.includes('back');

            if (editId) {
                await updatePassenger({
                    ...request,
                    id: +editId,
                });
                navigate('/passengers');
                return;
            } else {
                await createPassenger(request);
            }

            if (back) {
                navigate('/requests/create');
            }
        },
        [createPassenger, navigate, location],
    );

    const handleRemovePassenger = useCallback(async () => {
        await removePassenger(editId ?? '');
        navigate('/passengers');
    }, []);

    if (editId && !passenger) {
        return 'loading';
    }

    return (
        <div className={css.PassengerPage}>
            <header className={css.PassengerPage__header}>
                <Text variant="display-1">Создание пассажира</Text>
            </header>
            <Form
                initialValues={initialForm}
                onSubmit={() => {}}
                render={(props) => (
                    <div className={css.PassengerPage__form}>
                        <DynamicField
                            name={'passengerName'}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Введите ФИО пассажира',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Введите ФИО пассажира',
                                },
                                validator: 'number',
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'phone'}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Введите номер телефона',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Введите номер телефона',
                                },
                                validator: 'number',
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'sex'}
                            spec={{
                                type: SpecTypes.String,
                                enum: ['М', 'Ж'],
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Пол',
                                    placeholder: 'Выберите пол',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'category'}
                            spec={{
                                type: SpecTypes.String,
                                enum: passengerCategories,
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Категория пассажира',
                                    placeholder: 'Нажмите, чтобы выбрать категорию',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'pacemaker'}
                            spec={{
                                type: SpecTypes.Boolean,
                                viewSpec: {
                                    type: 'switch',
                                    layout: 'row',
                                    layoutTitle: 'ЭКС',
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
                                        'Напишите здесь всю необходимую информацию о пассажире',
                                },
                            }}
                            config={dynamicConfig}
                        />

                        {editId ? (
                            <div className={css.PassengerPage__actions}>
                                <Button view="action" onClick={() => handleFormSubmit(props)}>
                                    Изменить пассажира
                                </Button>
                                <Button view="outlined-danger" onClick={handleRemovePassenger}>
                                    Удалить пассажира
                                </Button>
                            </div>
                        ) : (
                            <Button view="action" onClick={() => handleFormSubmit(props)}>
                                Создать пассажира
                            </Button>
                        )}
                    </div>
                )}
            ></Form>
        </div>
    );
};
