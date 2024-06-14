import {Button, Text} from '@gravity-ui/uikit';
import {FC} from 'react';

import {DynamicView, dynamicViewConfig, SpecTypes} from '@gravity-ui/dynamic-forms';
import {Form} from 'react-final-form';
import {useStatus} from 'src/hooks/useStatus';
import css from './RequestInfoPage.module.scss';

export const RequestInfoPage: FC = () => {
    return (
        <div className={css.RequestInfoPage}>
            <header className={css.RequestInfoPage__header}>
                <Text variant="display-1">Информация о заявке</Text>
            </header>
            <Form
                onSubmit={() => {}}
                render={() => (
                    <div>
                        <div className={css.RequestInfoPage__status}>{useStatus('FINISHED')}</div>
                        <DynamicView
                            value={{
                                value: 'Васильев Василий Иваныч',
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
                                value: 'Алтуфьево -> Бульвар Дмитрия Донского',
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
                                value: '23.14.2003, 10:23',
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Дата заявки',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Дата заявки',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: 'По телефону',
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
                            value={{
                                value: 'Алтуфьево -> авывы фыво фыолвфы вфыол вло фыв олфыолв фыол в лофывол фвол фыло во лфывол фыло вло фыв',
                            }}
                            spec={{
                                type: SpecTypes.Object,
                                properties: {
                                    value: {
                                        type: SpecTypes.String,
                                        viewSpec: {
                                            type: 'base',
                                            placeholder: 'Пересадки',
                                        },
                                    },
                                },
                                viewSpec: {
                                    type: 'object_value',
                                    layout: 'row',
                                    layoutTitle: 'Пересадки',
                                },
                            }}
                            config={dynamicViewConfig}
                        />
                        <DynamicView
                            value={{
                                value: '123',
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
                                value: 'ИЗ',
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
                                value: '10',
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
                                value: '10',
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
                            value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quod error voluptatibus odio minima assumenda voluptatum harum quidem maxime iste exercitationem, quam numquam, necessitatibus saepe praesentium, commodi beatae. Vitae, odit. Assumenda nobis similique voluptatibus? Sint itaque qui laudantium iste? In doloribus nam vitae quasi suscipit dolores maiores culpa amet quo. Distinctio mollitia ad expedita tempore sit? Nemo odit quae impedit?"
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
                            value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quod error voluptatibus odio minima assumenda voluptatum harum quidem maxime iste exercitationem, quam numquam, necessitatibus saepe praesentium, commodi beatae. Vitae, odit. Assumenda nobis similique voluptatibus? Sint itaque qui laudantium iste? In doloribus nam vitae quasi suscipit dolores maiores culpa amet quo. Distinctio mollitia ad expedita tempore sit? Nemo odit quae impedit?"
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
                        <Button>Изменить заявку</Button>
                    </div>
                )}
            ></Form>
        </div>
    );
};
