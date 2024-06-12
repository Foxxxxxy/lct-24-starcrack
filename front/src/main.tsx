import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {useCreateRoutesWithLayouts} from './hooks/useCreateRoutesWithLayouts';
import {useRoutes} from './hooks/useRoutes';
import {Layout} from './Layouts/Layout';
import './styles/globals.scss';

const routes = useRoutes();
const router = useCreateRoutesWithLayouts({routes});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Layout>
            <RouterProvider router={router}></RouterProvider>
        </Layout>
    </React.StrictMode>,
);
