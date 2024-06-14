import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback} from 'react';
import {Form} from 'react-final-form';
import {useLocation, useNavigate} from 'react-router-dom';
import {passengerCategories} from 'src/constants';
import css from './PassengerPage.module.scss';

export const PassengerPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleFormSubmit = useCallback((formProps) => {
        const back = location.search.includes('back');
        if (back) {
            navigate('/requests/create');
        }
    }, []);

    return (
        <div className={css.PassengerPage}>
            <header className={css.PassengerPage__header}>
                <Text variant="display-1">Создание пассажира</Text>
            </header>
            <Form
                onSubmit={() => {}}
                validate={() => {}}
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
                            name={'eks'}
                            spec={{
                                type: SpecTypes.String,
                                enum: ['Есть', 'Нет'],
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'ЭКС',
                                    placeholder: 'Нажмите, чтобы выбрать наличие ЭКС',
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
                                        'Напишите здесь всю необходимую информацию о пассажире',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <Button onClick={() => handleFormSubmit(props)}>Создать сотрудника</Button>
                        <Button onClick={() => handleFormSubmit(props)}>Создать заявку</Button>
                    </div>
                )}
            ></Form>
        </div>
    );
};
