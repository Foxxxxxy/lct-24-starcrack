import {ThemeProvider} from '@gravity-ui/uikit';
import React from 'react';
import {useAuth} from 'src/hooks/useAuth';
import {Loader} from 'src/components/Loader/Loader';

type LayoutProps = {
    children?: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({children}) => {
    if (window.location.pathname !== '/auth') {
        const {isLoading} = useAuth();

        if (isLoading) {
            return (
                <Loader />
            );
        }
    }

    return <ThemeProvider>{children}</ThemeProvider>;
};
