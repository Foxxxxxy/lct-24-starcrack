import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC, useCallback} from 'react';
import {Form, FormRenderProps} from 'react-final-form';
import {useNavigate} from 'react-router-dom';
import {useFetchCreateEmployee} from 'src/api/routes';
import {mapSex} from 'src/constants';
import css from './EmoloyeePage.module.scss';

export const EmoloyeePage: FC = () => {
    const navigate = useNavigate();

    const {fetch: createEmployee} = useFetchCreateEmployee();

    const handleFormSubmit = useCallback(
        async (form: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {
            const {values} = form;

            const request = {
                username: values['username']?.value,
                password: values['password']?.value,
                role: values['role'],
                sub_role: values['sub_role'],
                sex: mapSex[values['sex']],
                full_name: values['full_name']?.value,
                phone: values['phone']?.value,
                easy_work: values['easy_work'],
            };

            await createEmployee(request);

            if (request.sub_role === 'Attendant') {
                navigate('/work-time/create');
            } else {
                navigate('/employee');
            }
        },
        [],
    );

    return (
        <div className={css.EmoloyeePage}>
            <header className={css.EmoloyeePage__header}>
                <Text variant="display-1">Регистрация сотрудника</Text>
            </header>
            <Form
                onSubmit={() => {}}
                render={(props) => (
                    <div className={css.PassengerPage__form}>
                        <DynamicField
                            name={'username'}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Введите логин',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Задайте логин для сотрудника',
                                },
                                validator: 'number',
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'password'}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Введите пароль',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Задайте пароль для сотрудника',
                                },
                                validator: 'number',
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'full_name'}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Введите ФИО сотрудника',
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
                                            placeholder: 'Введите номер телефона сотрудника',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Введите номер телефона сотрудника',
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
                            name={'role'}
                            spec={{
                                type: SpecTypes.String,
                                enum: ['Admin', 'Specialist', 'Attendant', 'Operator'],
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Выберите роль',
                                    placeholder: 'Выберите роль',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'sub_role'}
                            spec={{
                                type: SpecTypes.String,
                                enum: [
                                    'Head_of_the_section',
                                    'Senior_inspector',
                                    'Attendant',
                                    'Inspector',
                                ],
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Выберите должность',
                                    placeholder: 'Выберите должность',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'easy_work'}
                            spec={{
                                type: SpecTypes.Boolean,
                                viewSpec: {
                                    type: 'switch',
                                    layout: 'row',
                                    layoutTitle: 'Легкий труд',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <Button onClick={() => handleFormSubmit(props)}>Создать заявку</Button>
                    </div>
                )}
            ></Form>
        </div>
    );
};
