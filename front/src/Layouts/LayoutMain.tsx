import React, {useState} from 'react';

import {PageLayout, PageLayoutAside} from '@gravity-ui/navigation';
import {FooterItems} from 'src/components/FooterItems/FooterItems';
import {useMenuItems} from 'src/hooks/useMenuItems';

import metroLogo from './vite.svg';

export type LayoutProps = {
    children?: React.ReactNode;
};

export const LayoutMain: React.FC<LayoutProps> = ({children}) => {
    const [isCompact, setIsCompact] = useState(window.screen.width <= 760 ? true : false);

    const menuItems = useMenuItems();
    return (
        <PageLayout compact={isCompact}>
            <PageLayoutAside
                headerDecoration
                menuItems={menuItems}
                logo={{
                    text: 'Starcrack',
                    icon: metroLogo,
                }}
                onChangeCompact={(val) => setIsCompact(val)}
                renderFooter={({compact}) => {
                    return <FooterItems compact={compact} />;
                }}
            />

            <PageLayout.Content>{children}</PageLayout.Content>
        </PageLayout>
    );
};
