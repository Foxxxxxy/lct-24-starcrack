import {DynamicView, dynamicViewConfig, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Button, Text, useToaster} from '@gravity-ui/uikit';
import {useStore} from '@tanstack/react-store';
import {FC, useCallback} from 'react';
import {Form} from 'react-final-form';
import {useNavigate, useParams} from 'react-router-dom';
import {useFetchEmployeeById, useFetchRemoveEmployee} from 'src/api/routes';
import {mapSex} from 'src/constants';
import {store} from 'src/store/state';
import css from './EmployeeInfoPage.module.scss';

export const EmployeeInfoPage: FC = () => {
    const params = useParams();

    const employee = useFetchEmployeeById(params.id ?? '');

    const {fetch: removeEmployee} = useFetchRemoveEmployee();

    const navigate = useNavigate();
    const {add} = useToaster();

    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin';

    const handleEditEmployee = useCallback(() => {
        navigate(`/employee/create?editId=${employee?.id}`);
    }, [employee]);

    const handleRemoveEmployee = useCallback(async () => {
        await removeEmployee(employee?.id ?? '')
            .then(() => {
                add({
                    name: 'employee-delete-success',
                    title: 'Сотрудник успешно удален',
                    theme: 'success',
                });
            })
            .catch(() => {
                add({
                    name: 'employee-delete-error',
                    title: 'Что-то пошло не так :(',
                    theme: 'danger',
                });
            });
        navigate('/employee');
    }, [employee]);

    return (
        <div className={css.EmployeeInfoPage}>
            <header className={css.EmployeeInfoPage__header}>
                <Text variant="display-1">Информация о сотруднике</Text>
            </header>
            <Form
                onSubmit={() => {}}
                render={(props) => (
                    <div className={css.EmployeeInfoPage__form}>
                        <DynamicView
                            value={{
                                value: employee?.full_name,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'ФИО сотрудника',
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
                                value: employee?.phone,
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
                            value={mapSex[employee?.sex ?? '']}
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
                            value={{
                                value: employee?.role,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Роль',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Роль',
                                },
                                validator: 'number',
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: employee?.sub_role,
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Должность',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Должность',
                                },
                                validator: 'number',
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={employee?.easy_work ? 'Да' : 'Нет'}
                            spec={{
                                type: SpecTypes.Boolean,
                                viewSpec: {
                                    type: 'switch',
                                    layout: 'row',
                                    layoutTitle: 'Легкий труд',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        {userRole === 'Admin' ? (
                            <div className={css.EmployeeInfoPage__actions}>
                                <Button view="action" onClick={handleEditEmployee}>
                                    Изменить сотрудника
                                </Button>
                                <Button view="outlined-danger" onClick={handleRemoveEmployee}>
                                    Удалить сотрудника
                                </Button>
                            </div>
                        ) : undefined}
                    </div>
                )}
            ></Form>
        </div>
    );
};
