import React, {useState} from 'react';

import {PageLayout, PageLayoutAside, FooterItem} from '@gravity-ui/navigation';
import {useMenuItems} from 'src/hooks/useMenuItems';
import {Avatar} from '@gravity-ui/uikit';
import {SidebarPopup} from 'src/components/SidebarPopup/SidebarPopup';

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
                    const footerItems = [
                        <FooterItem 
                            key="1"
                            compact={compact}
                            item={{
                                id: 'account',
                                title: 'Учётная запись',
                                itemWrapper: ({title}: any, makeItem: any) => {
                                    return makeItem({
                                        title,
                                        icon: (
                                            <Avatar imgUrl="https://lh3.googleusercontent.com/ogw/AF2bZyjQPFn3Mvwvp3JNzQqP7Xo_V9jGARrJ8RHSAxCG_09c7Ac=s64-c-mo" size="m" />
                                        ),
                                    });
                                },
                                onItemClick: () => {setPopupVisible(!popupVisible);},
                            }}
                            enableTooltip={!popupVisible}
                            popupVisible={popupVisible}
                            onClosePopup={() => setPopupVisible(false)}
                            renderPopupContent={() => {
                                return (
                                    <SidebarPopup username='Рыбко Алексей Александрович' status='Администратор' />
                                )
                            }}
                        />,
                    ];
                    return <>{footerItems}</>
                }}
            />

            <PageLayout.Content>{children}</PageLayout.Content>
        </PageLayout>
    );
};
