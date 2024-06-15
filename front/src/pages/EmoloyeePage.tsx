import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC} from 'react';
import {Form} from 'react-final-form';
import css from './EmoloyeePage.module.scss';

export const EmoloyeePage: FC = () => {
    return (
        <div className={css.EmoloyeePage}>
            <header className={css.EmoloyeePage__header}>
                <Text variant="display-1">Регистрация сотрудника</Text>
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
                            name={'work_time'}
                            spec={{
                                type: SpecTypes.String,
                                enum: ['1', '2', '1(Н)', '2(Н)', '5'],
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Cмена сотрудника',
                                    placeholder: 'Выберите смену сотрудника',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'work_hours'}
                            spec={{
                                type: SpecTypes.String,
                                enum: ['07:00-19:00', '08:00-20:00', '20:00-08:00', '08:00-17:00'],
                                viewSpec: {
                                    type: 'select',
                                    layout: 'row',
                                    layoutTitle: 'Время работы',
                                    placeholder: 'Выберите время работы сотрудника',
                                },
                            }}
                            config={dynamicConfig}
                        />
                        <DynamicField
                            name={'is_easy'}
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
                        <Button onClick={() => {}}>Создать заявку</Button>
                    </div>
                )}
            ></Form>
        </div>
    );
};
