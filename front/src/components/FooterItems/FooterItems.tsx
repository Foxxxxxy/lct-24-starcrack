import {useState} from 'react';
import {FC} from 'react';
import {FooterItem} from '@gravity-ui/navigation';
import {Avatar} from '@gravity-ui/uikit';
import {SidebarPopup} from 'src/components/SidebarPopup/SidebarPopup';

type FooterItemsProps = {
    compact: boolean;
}


export const FooterItems: FC<FooterItemsProps> = (props) => {
    const {compact} = props
    const [popupVisible, setPopupVisible] = useState(false);

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
};