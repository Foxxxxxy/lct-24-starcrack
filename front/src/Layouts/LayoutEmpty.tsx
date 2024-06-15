import React, {useState} from 'react';

import {PageLayout} from '@gravity-ui/navigation';

type LayoutProps = {
    children?: React.ReactNode;
};

export const LayoutEmpty: React.FC<LayoutProps> = ({children}) => {
    const [isCompact] = useState(false);
    return (
        <PageLayout compact={isCompact}>
            <PageLayout.Content>{children}</PageLayout.Content>
        </PageLayout>
    );
};
