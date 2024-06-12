import {ListUl, PencilToLine, Person, PersonGear, ScalesUnbalanced} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';

const menuItems: MenuItem[] = [
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
];

export const useMenuItems = (): typeof menuItems => {
    return menuItems;
};
