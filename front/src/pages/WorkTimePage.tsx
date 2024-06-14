import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC} from 'react';
import {Form} from 'react-final-form';
import {passengerCategories} from 'src/constants';
import css from './WorkTimePage.module.scss';

export const WorkTimePage: FC = () => {
    return (
        <div className={css.WorkTimePage}>
            <header className={css.WorkTimePage__header}>
                <Text variant="display-1">Создание рабочего дня</Text>
            </header>
            <Form
                onSubmit={() => {}}
                validate={() => {}}
                render={(props) => (
                    <div className={css.WorkTimePage__form}>
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
                    </div>
                )}
            ></Form>
        </div>
    );
};
