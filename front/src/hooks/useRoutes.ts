import {FC} from 'react';
import {LayoutEmpty} from 'src/Layouts/LayoutEmpty';
import {LayoutMain} from 'src/Layouts/LayoutMain';
import {AuthPage} from 'src/pages/AuthPage';
import {EmoloyeePage} from 'src/pages/EmoloyeePage';
import {MainPage} from 'src/pages/MainPage';
import {MainPageMobile} from 'src/pages/MainPageMobile';
import {PassengerInfoPage} from 'src/pages/PassengerInfoPage';
import {PassengerPage} from 'src/pages/PassengerPage';
import {RequestInfoPage} from 'src/pages/RequestInfoPage';
import {RequestPage} from 'src/pages/RequestPage';
import {WorkTimePage} from 'src/pages/WorkTimePage';
import {EmployeeList} from 'src/pages/EmployeeList';
import {PassengersList} from 'src/pages/PassengersList';

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
        PageComponent: window.screen.width <= 760 ? MainPageMobile : MainPage,
    },
    {
        name: 'requestCreate',
        path: '/requests/create',
        LayoutComponent: LayoutMain,
        PageComponent: RequestPage,
    },
    {
        name: 'requestInfo',
        path: '/requests/:id',
        LayoutComponent: LayoutMain,
        PageComponent: RequestInfoPage,
    },
    {
        name: 'passengerCreate',
        path: '/passengers/create',
        LayoutComponent: LayoutMain,
        PageComponent: PassengerPage,
    },
    {
        name: 'passengerInfo',
        path: '/passengers/:id',
        LayoutComponent: LayoutMain,
        PageComponent: PassengerInfoPage,
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
    {
        name: 'auth',
        path: '/auth',
        LayoutComponent: LayoutEmpty,
        PageComponent: AuthPage,
    },
    {
        name: 'mainMobile',
        path: '/mobile',
        LayoutComponent: LayoutMain,
        PageComponent: MainPageMobile,
    },
    {
        name: 'employeeList',
        path: '/employeelist',
        LayoutComponent: LayoutMain,
        PageComponent: EmployeeList,
    },
    {
        name: 'passengersList',
        path: '/passengerslist',
        LayoutComponent: LayoutMain,
        PageComponent: PassengersList,
    }
];

export const useRoutes = (): typeof routes => {
    return routes;
};
