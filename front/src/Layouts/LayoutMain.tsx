import React, {useState} from 'react';

import {PageLayout, PageLayoutAside} from '@gravity-ui/navigation';
import {useMenuItems} from 'src/hooks/useMenuItems';

import metroLogo from './vite.svg';

export type LayoutProps = {
    children?: React.ReactNode;
};

export const LayoutMain: React.FC<LayoutProps> = ({children}) => {
    const [isCompact, setIsCompact] = useState(false);

    const menuItems = useMenuItems();

    return (
        <PageLayout compact={isCompact}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItems}
                logo={{
                    text: 'Service',
                    icon: metroLogo,
                }}
                onChangeCompact={(val) => setIsCompact(val)}
            />

            <PageLayout.Content>{children}</PageLayout.Content>
        </PageLayout>
    );
};
