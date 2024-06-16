import {ListUl, PencilToLine, Person, PersonGear, Plus, ScalesUnbalanced} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';
import {router} from 'src/main';
import {useLocation} from './useLocation';
import {routes} from './useRoutes';

const defaultMenuItems: MenuItem[] = [
    {
        id: 'main',
        title: 'Все заявки',
        icon: ListUl,
    },
    {
        id: 'overview',
        title: 'Распределение заявок',
        icon: ScalesUnbalanced,
    },
    {
        id: 'requestInfo',
        title: 'Информация о заявке',
        icon: PencilToLine,
    },
    {
        id: 'requestCreate',
        title: 'Создание заявки',
        icon: PencilToLine,
    },
    {
        id: 'overview',
        title: 'Пассажир',
        icon: Person,
    },
    {
        id: 'overview',
        title: 'Сотрудники',
        icon: PersonGear,
    },
    {
        id: 'divider2',
        title: '-',
        type: 'divider',
    },
];

const filterAside = (items: MenuItem[]): MenuItem[] => {
    const {name} = useLocation();
    const idx = items.findIndex((item) => item.id === name);
    if (idx !== -1) {
        items[idx].current = true;
    }
    const patchedItems = items.map((item) => {
        const route = routes.find((route) => route.name === name);
        return {
            ...item,
            onItemClick() {
                router.navigate(route?.path ?? '/');
            },
        };
    });
    return [
        ...patchedItems,
        {
            id: 'action2',
            title: 'Создать заявку',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/requests/create');
            },
        },
        {
            id: 'action2',
            title: 'Создать пассажира',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/passengers/create');
            },
        },
        {
            id: 'action2',
            title: 'Создать сотрудника',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/employee/create');
            },
        },
        {
            id: 'action2',
            title: 'Создать расписание',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/work-time/create');
            },
        },
    ];

    return items;
};

export const useMenuItems = (): typeof defaultMenuItems => {
    return filterAside(defaultMenuItems);
};
