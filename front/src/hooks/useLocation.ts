import {useLocation as useRouterLocation} from 'react-router-dom';
import {useRoutes} from './useRoutes';

export const useLocation = () => {
    const location = useRouterLocation();
    const routes = useRoutes();

    const route = routes.find((item) => item.path === location.pathname);

    return {
        ...location,
        name: route?.name,
    };
};
