import React from 'react';

import {PageLayout} from '@gravity-ui/navigation';

type LayoutProps = {
    children?: React.ReactNode;
};

export const LayoutEmpty: React.FC<LayoutProps> = ({children}) => {
    return (
        <PageLayout.Content>{children}</PageLayout.Content>
    );
};
