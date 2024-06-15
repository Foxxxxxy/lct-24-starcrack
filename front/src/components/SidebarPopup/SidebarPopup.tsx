import {FC} from 'react';
import {Avatar, Button, Icon, User} from '@gravity-ui/uikit';
import {ArrowRightFromSquare} from '@gravity-ui/icons';

import css from './SidebarPopup.module.scss';

type SidebarPopupProps = {
    username: string;
    status: string;
};

export const SidebarPopup: FC<SidebarPopupProps> = (props) => {
    const {username, status} = props;
    return (
        <div className={css.SidebarPopup}>
            <User 
                avatar={<Avatar imgUrl="https://lh3.googleusercontent.com/ogw/AF2bZyjQPFn3Mvwvp3JNzQqP7Xo_V9jGARrJ8RHSAxCG_09c7Ac=s64-c-mo" size="m" />}
                name={username}
                description={status}
                size="l"
            />
            <Button onClick={() => {
                console.log('logout')
            }}>
                <Icon data={ArrowRightFromSquare}></Icon>
            </Button>
        </div>
    )
};