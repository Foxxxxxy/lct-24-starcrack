import {FC, ReactNode} from 'react';
import {createBrowserRouter, RouteObject} from 'react-router-dom';
import {LayoutProps} from 'src/Layouts/LayoutMain';

type RouteWithLayout = {
    path: string;
    PageComponent: FC;
    LayoutComponent: FC<LayoutProps>;
};

type CreateRouteProps = {
    route: RouteWithLayout;
};

export const createRoute = (props: CreateRouteProps): RouteObject => {
    const {PageComponent, LayoutComponent, path} = props.route;

    const element: ReactNode = (
        <LayoutComponent>
            <PageComponent />
        </LayoutComponent>
    );

    return {
        path,
        element,
        // loader: checkAuthentication,
    };
};

export const useCreateRoutesWithLayouts = (props: {routes: RouteWithLayout[]}) => {
    const parsedRoutes = props.routes.map((route) => createRoute({route}));

    return createBrowserRouter(parsedRoutes);
};
