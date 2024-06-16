import {FooterItem} from '@gravity-ui/navigation';
import {Avatar} from '@gravity-ui/uikit';
import {useStore} from '@tanstack/react-store';
import {FC, useState} from 'react';
import {SidebarPopup} from 'src/components/SidebarPopup/SidebarPopup';
import {store} from 'src/store/state';

type FooterItemsProps = {
    compact: boolean;
};

export const FooterItems: FC<FooterItemsProps> = (props) => {
    const {compact} = props;
    const [popupVisible, setPopupVisible] = useState(false);

    const user = useStore(store, (state) => state['user']);

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
                            <Avatar
                                imgUrl="https://lh3.googleusercontent.com/ogw/AF2bZyjQPFn3Mvwvp3JNzQqP7Xo_V9jGARrJ8RHSAxCG_09c7Ac=s64-c-mo"
                                size="m"
                            />
                        ),
                    });
                },
                onItemClick: () => {
                    setPopupVisible(!popupVisible);
                },
            }}
            enableTooltip={!popupVisible}
            popupVisible={popupVisible}
            onClosePopup={() => setPopupVisible(false)}
            renderPopupContent={() => {
                return <SidebarPopup username={user?.full_name} status={user?.role} />;
            }}
        />,
    ];
    return <>{footerItems}</>;
};
