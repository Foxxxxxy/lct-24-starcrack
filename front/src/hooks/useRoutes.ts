import {LayoutMain} from 'src/Layouts/LayoutMain';
import {EmoloyeePage} from 'src/pages/EmoloyeePage';
import {MainPage} from 'src/pages/MainPage';
import {PassengersPage} from 'src/pages/PassengersPage';
import {WorkTimePage} from 'src/pages/WorkTimePage';

export const routes = [
    {
        path: '/',
        LayoutComponent: LayoutMain,
        PageComponent: MainPage,
    },
    {
        path: '/passengers',
        LayoutComponent: LayoutMain,
        PageComponent: PassengersPage,
    },
    {
        name: 'employeeCreate',
        path: '/employee/create',
        LayoutComponent: LayoutMain,
        PageComponent: EmoloyeePage,
    },
    {
        name: 'workTimeCreate',
        path: '/work-time/create',
        LayoutComponent: LayoutMain,
        PageComponent: WorkTimePage,
    },
];

export const useRoutes = (): typeof routes => {
    return routes;
};
