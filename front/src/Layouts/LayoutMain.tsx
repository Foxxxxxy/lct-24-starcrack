import React, {useState} from 'react';

import {PageLayout, PageLayoutAside, FooterItem} from '@gravity-ui/navigation';
import {useMenuItems} from 'src/hooks/useMenuItems';
import {Avatar} from '@gravity-ui/uikit';
import {SidebarPopup} from 'src/components/SidebarPopup/SidebarPopup';
import {FooterItems} from 'src/components/FooterItems/FooterItems';

import metroLogo from './vite.svg';

export type LayoutProps = {
    children?: React.ReactNode;
};

export const LayoutMain: React.FC<LayoutProps> = ({children}) => {
    const [isCompact, setIsCompact] = useState(false);

    const menuItems = useMenuItems();
    const [popupVisible, setPopupVisible] = useState(false);

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
                renderFooter={({compact}) => {
                    return <FooterItems compact={compact} />;
                }}
            />

            <PageLayout.Content>{children}</PageLayout.Content>
        </PageLayout>
    );
};
