import React from 'react';

import {ThemeProvider} from '@gravity-ui/uikit';

type LayoutProps = {
    children?: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({children}) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};
