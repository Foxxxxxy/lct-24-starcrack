import {ListUl, PencilToLine, Person, PersonGear, Plus} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';
import {useStore} from '@tanstack/react-store';
import {accessPages} from 'src/constants';
import {router} from 'src/main';
import {store} from 'src/store/state';
import {useLocation} from './useLocation';

const defaultMenuItems: MenuItem[] = [
    {
        id: 'main',
        name: 'main',
        title: 'Все заявки',
        icon: ListUl,
        onItemClick() {
            router.navigate('/');
        },
    },
    {
        id: 'gant',
        name: 'gant',
        title: 'Экран распределения',
        icon: PencilToLine,
        onItemClick() {
            router.navigate('/gant');
        },
    },
    {
        id: 'passengers2',
        name: 'passengersList',
        title: 'Все пассажиры',
        icon: Person,
        onItemClick(pr) {
            router.navigate('/passengers');
        },
    },
    {
        id: 'employees3',
        name: 'employeeList',
        title: 'Все сотрудники',
        icon: PersonGear,
        onItemClick() {
            router.navigate('/employee');
        },
    },
    {
        id: 'employees4s',
        name: 'workTimeList',
        title: 'Все рабочие смены',
        icon: PersonGear,
        onItemClick() {
            router.navigate('/work-time');
        },
    },
    // {
    //     id: 'requestInfo',
    //     title: 'Информация о заявке',
    //     icon: PencilToLine,
    // },
    // {
    //     id: 'requestCreate',
    //     title: 'Создание заявки',
    //     icon: PencilToLine,
    // },
    // {
    //     id: 'overview',
    //     title: 'Пассажир',
    //     icon: Person,
    // },
    // {
    //     id: 'overview',
    //     title: 'Сотрудники',
    //     icon: PersonGear,
    // },
    {
        id: 'divider2',
        title: '-',
        type: 'divider',
    },
];

const filterAside = (items: MenuItem[]): MenuItem[] => {
    const {name} = useLocation();
    const user = useStore(store, (state) => state['user']);
    const userRole = 'Admin';
    items = items.map((item) => ({
        ...item,
        current: item.name === name,
    }));
    // if (idx !== -1) {
    //     items[idx].current = true;
    // }
    // const patchedItems = items.map((item) => {
    //     const route = routes.find((route) => route.name === name);
    //     return {
    //         ...item,
    //         // onItemClick() {
    //         //     router.navigate(route?.path ?? '/');
    //         // },
    //     };
    // });
    let allItems = [
        ...items,
        {
            id: 'action2',
            name: 'createRequest',
            title: 'Создать заявку',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/requests/create');
            },
        },
        {
            id: 'action2',
            name: 'createPassenger',
            title: 'Создать пассажира',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/passengers/create');
            },
        },
        {
            id: 'action2',
            name: 'createEmployee',
            title: 'Создать сотрудника',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/employee/create');
            },
        },
        {
            id: 'action2',
            name: 'createWorkTime',
            title: 'Создать расписание',
            type: 'action',
            icon: Plus,
            onItemClick() {
                router.navigate('/work-time/create');
            },
        },
    ] as MenuItem[];

    if (userRole) {
        allItems = allItems.filter(
            (item) => accessPages[userRole].includes(item.name) || item.type === 'divider',
        );
        return allItems;
    }

    return allItems;
};

export const useMenuItems = (): typeof defaultMenuItems => {
    return filterAside(defaultMenuItems);
};
