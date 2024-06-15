import {FC} from 'react';
import {Text} from '@gravity-ui/uikit';
import css from './MobileTableField.module.scss';
import {RequestItemResolved} from 'src/resolvers/useResolvedRequests';

type MobileTableFieldProps = {
    data: RequestItemResolved;
}

export const MobileTableField: FC<MobileTableFieldProps> = (props) => {
    const {data} = props;

    return (
        <div className={css.MobileTableField}>
            <div>{data.status}</div>
            <Text>ID заявки: {data.id}</Text>
            <Text>ID Пассажира: {data.passenger_id}</Text>
            <Text>Кол-во м / ж: {data.females_males_needed}</Text>
            <Text>Путь: {data.route}</Text>
            <Text>Время начала: {data.start_time}</Text>
            <Text>Время завершения: {data.finish_time}</Text>
        </div>
    );
}