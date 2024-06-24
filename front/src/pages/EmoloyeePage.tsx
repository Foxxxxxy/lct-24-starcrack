import {dynamicConfig, DynamicField, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text, useToaster} from '@gravity-ui/uikit';
import {FC, useCallback, useMemo} from 'react';
import {Form, FormRenderProps} from 'react-final-form';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {
    useFetchCreateEmployee,
    useFetchEmployeeById,
    useFetchRemoveEmployee,
    useFetchUpdateEmployee,
} from 'src/api/routes';
import {Loader} from 'src/components/Loader/Loader';
import {mapSex, mapSexBack} from 'src/constants';
import {Employer} from 'src/types';
import css from './EmoloyeePage.module.scss';

export const EmoloyeePage: FC = () => {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const {add} = useToaster();

    const {fetch: createEmployee} = useFetchCreateEmployee();
    const {fetch: updateEmployee} = useFetchUpdateEmployee();
    const {fetch: removeEmployee} = useFetchRemoveEmployee();

    const editId = searchParams.get('editId');

    const employee = useFetchEmployeeById(editId ?? '');

    const initialForm = useMemo(() => {
        if (!employee || !editId) {
            return {};
        }
        return {
            username: {
                value: employee.username,
            },
            password: {
                value: employee.password,
            },
            role: employee.role,
            sub_role: employee.sub_role,
            sex: mapSexBack[employee.sex],
            full_name: {
                value: employee.full_name,
            },
            phone: {
                value: employee.phone,
            },
            easy_work: employee.easy_work,
        };
    }, [employee, editId]);

    const handleFormSubmit = useCallback(
        async (form: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {
            const {values} = form;

            const request: Employer = {
                username: values['username']?.value,
                password: values['password']?.value,
                role: values['role'] ?? '',
                sub_role: values['sub_role'] ?? null,
                sex: mapSex[values['sex']],
                full_name: values['full_name']?.value ?? '',
                phone: values['phone']?.value ?? '',
                easy_work: values['easy_work'] ?? false,
            };

            if (editId) {
                updateEmployee({
                    ...request,
                    id: +editId,
                })
                    .then(() => {
                        add({
                            name: 'employee-edit-success',
                            title: 'Сотрудник успешно изменен',
                            theme: 'success',
                        });
                        navigate('/employee');
                    })
                    .catch(() => {
                        add({
                            name: 'employee-edit-error',
                            title: 'Что-то пошло не так :(',
                            theme: 'danger',
                        });
                    });
            } else {
                try {
                    await createEmployee(request);
                    add({
                        name: 'employee-create-success',
                        title: 'Сотрудник успешно создан',
                        theme: 'success',
                    });
                    navigate('/employee');
                } catch {
                    add({
                        name: 'employee-create-error',
                        title: 'Что-то пошло не так :(',
                        theme: 'danger',
                    });
                }
            }

            if (request.sub_role === 'Inspector' && !editId) {
                navigate('/work-time/create');
            } else {
                navigate('/employee');
            }
        },
        [editId, createEmployee, navigate],
    );

    const handleRemoveEmployee = useCallback(async () => {
        await removeEmployee(editId ?? '')
            .then(() => {
                add({
                    name: 'employee-remove-success',
                    title: 'Сотрудник успешно удален',
                    theme: 'success',
                });
                navigate('/employee');
            })
            .catch(() => {
                add({
                    name: 'employee-remove-error',
                    title: 'Что-то пошло не так :(',
                    theme: 'danger',
                });
            });
    }, [editId]);

    if (editId && !employee) {
        return <Loader />;
    }

    return (
        <div className={css.EmoloyeePage}>
            <header className={css.EmoloyeePage__header}>
                <Text variant="display-1">Регистрация сотрудника</Text>
            </header>
            <Form
                onSubmit={() => {}}
                initialValues={initialForm}
                render={(props) => (
                    <div className={css.PassengerPage__form}>
                        {!editId ? (
                            <>
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
                            </>
                        ) : null}

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
                                enum: ['Head_of_the_section', 'Senior_inspector', 'Inspector'],
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
                        {editId ? (
                            <div className={css.EmoloyeePage__actions}>
                                <Button view="action" onClick={() => handleFormSubmit(props)}>
                                    Изменить сотрудника
                                </Button>
                                <Button view="outlined-danger" onClick={handleRemoveEmployee}>
                                    Удалить сотрудника
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => handleFormSubmit(props)}>
                                Создать сотрудника
                            </Button>
                        )}
                    </div>
                )}
            ></Form>
        </div>
    );
};
