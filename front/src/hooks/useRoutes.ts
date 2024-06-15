import {FC} from 'react';
import {LayoutMain} from 'src/Layouts/LayoutMain';
import {AuthPage} from 'src/pages/AuthPage';
import {EmoloyeePage} from 'src/pages/EmoloyeePage';
import {MainPage} from 'src/pages/MainPage';
import {PassengerPage} from 'src/pages/PassengerPage';
import {RequestInfoPage} from 'src/pages/RequestInfoPage';
import {RequestPage} from 'src/pages/RequestPage';
import {WorkTimePage} from 'src/pages/WorkTimePage';

export type CustomRoute = {
    name: string;
    path: string;
    LayoutComponent: FC;
    PageComponent: FC;
};

export const routes: CustomRoute[] = [
    {
        name: 'main',
        path: '/',
        LayoutComponent: LayoutMain,
        PageComponent: MainPage,
    },
    {
        name: 'auth',
        path: '/auth',
        LayoutComponent: LayoutMain,
        PageComponent: AuthPage,
    },
    {
        name: 'requestCreate',
        path: '/requests/create',
        LayoutComponent: LayoutMain,
        PageComponent: RequestPage,
    },
    {
        name: 'request',
        path: '/requests/:id',
        LayoutComponent: LayoutMain,
        PageComponent: RequestInfoPage,
    },
    {
        name: 'passenger',
        path: '/passenger',
        LayoutComponent: LayoutMain,
        PageComponent: PassengerPage,
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
