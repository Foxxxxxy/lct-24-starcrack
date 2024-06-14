import {Text} from '@gravity-ui/uikit';
import {FC} from 'react';
import css from './Field.module.scss';

type FieldProps = {
    label?: string;
    children: React.ReactNode;
};

export const Field: FC<FieldProps> = (props) => {
    const {label, children} = props;

    return (
        <div className={css.Field}>
            <div className={css.Field__left}>
                <Text>{label}</Text>
            </div>
            <div className={css.Field__right}>{children}</div>
        </div>
    );
};
