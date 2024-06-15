import {ThemeProvider} from '@gravity-ui/uikit';
import React from 'react';
import {useAuth} from 'src/hooks/useAuth';

type LayoutProps = {
    children?: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({children}) => {
    if (window.location.pathname !== '/auth') {
        const {isLoading} = useAuth();

        if (isLoading) {
            return <>LOADING</>;
        }
    }

    return <ThemeProvider>{children}</ThemeProvider>;
};
