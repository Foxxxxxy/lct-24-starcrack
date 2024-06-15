import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {useCreateRoutesWithLayouts} from './hooks/useCreateRoutesWithLayouts';
import {useRoutes} from './hooks/useRoutes';
import {Layout} from './Layouts/Layout';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './styles/globals.scss';

const queryClient = new QueryClient();
const routes = useRoutes();
export const router = useCreateRoutesWithLayouts({routes});

//TODO RETURN STRICT MODE
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <QueryClientProvider client={queryClient}>
        <Layout>
            <RouterProvider router={router}></RouterProvider>
        </Layout>
    </QueryClientProvider>,
);
