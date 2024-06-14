import {ListUl, PencilToLine, Person, PersonGear, Plus, ScalesUnbalanced} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';
import {router} from 'src/main';
import {useLocation} from './useLocation';

const defaultMenuItems: MenuItem[] = [
    {
        id: 'overview',
        title: 'Все заявки',
        icon: ListUl,
    },
    {
        id: 'overview',
        title: 'Распределение заявок',
        icon: ScalesUnbalanced,
    },
    {
        id: 'overview',
        title: 'Заявка',
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
    if (name === 'main') {
        return [
            ...items,
            {
                id: 'action2',
                title: 'Создать заявку',
                type: 'action',
                icon: Plus,
                onItemClick() {
                    router.navigate('/requests/create');
                },
            },
        ];
    }

    return items;
};

export const useMenuItems = (): typeof defaultMenuItems => {
    return filterAside(defaultMenuItems);
};
