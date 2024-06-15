import {DatePicker, RangeCalendar} from '@gravity-ui/date-components';
import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text} from '@gravity-ui/uikit';
import {FC} from 'react';
import {Field as BaseField, Form} from 'react-final-form';
import {Field} from 'src/components/Field/Field';
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
                        <Field label="Дата заявки">
                            <BaseField name="date">{(fieldProps) => <DatePicker />}</BaseField>
                        </Field>
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

                        <Field label="Выходные">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Отпуск">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Больничный">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Дополнительная смена">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <Field label="Учеба с отрывом от производства">
                            <BaseField name="date">{(fieldProps) => <RangeCalendar />}</BaseField>
                        </Field>

                        <DynamicField
                            name={'is_easy'}
                            spec={{
                                type: SpecTypes.Boolean,
                                viewSpec: {
                                    type: 'switch',
                                    layout: 'row',
                                    layoutTitle: 'Стажировка',
                                },
                            }}
                            config={dynamicConfig}
                        />

                        <Button onClick={() => {}}>Создать рабочий день</Button>
                    </div>
                )}
            ></Form>
        </div>
    );
};
