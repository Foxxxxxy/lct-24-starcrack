import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

type LayoutProps = {
    children?: React.ReactNode;
};

const queryClient = new QueryClient();

export const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
    );
};
