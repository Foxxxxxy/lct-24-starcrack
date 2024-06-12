import {LayoutMain} from 'src/Layouts/LayoutMain';
import {MainPage} from 'src/pages/MainPage';
import {PassengersPage} from 'src/pages/PassengersPage';

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
];

export const useRoutes = (): typeof routes => {
    return routes;
};
