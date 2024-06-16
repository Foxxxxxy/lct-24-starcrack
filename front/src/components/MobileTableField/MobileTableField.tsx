import {Select, Text} from '@gravity-ui/uikit';
import {FC, useCallback, useState} from 'react';
import {useFetchUpdateStatus} from 'src/api/routes';
import {statuses, useStatus} from 'src/hooks/useStatus';
import {RequestItemResolved} from 'src/resolvers/useResolvedRequests';
import {RequestStatus} from 'src/types';
import css from './MobileTableField.module.scss';

type MobileTableFieldProps = {
    data: RequestItemResolved;
};

export const MobileTableField: FC<MobileTableFieldProps> = (props) => {
    const {data} = props;

    const [currentStatus, setCurrentStatus] = useState(data.status);

    const {fetch: updateStatus} = useFetchUpdateStatus();

    const handleSelectUpdate = useCallback((status) => {
        setCurrentStatus(useStatus(status[0]));

        //@ts-ignore
        updateStatus({
            id: data._id,
            new_status: status[0],
        });
    }, []);

    return (
        <div className={css.MobileTableField}>
            <Select
                onUpdate={handleSelectUpdate}
                // value={['IN_PROGRESS']}
                renderControl={({onClick, onKeyDown, ref}) => {
                    return (
                        <div ref={ref} onClick={onClick} extraProps={{onKeyDown}}>
                            {currentStatus}
                        </div>
                    );
                }}
            >
                {Object.keys(statuses).map((status: RequestStatus) => {
                    return (
                        <Select.Option key={statuses[status].name} value={status}>
                            {useStatus(status)}
                        </Select.Option>
                    );
                })}
            </Select>
            <Text>ID заявки: {data.id}</Text>
            <Text>ID Пассажира: {data.passenger_id}</Text>
            <Text>Кол-во м / ж: {data.females_males_needed}</Text>
            <Text>Путь: {data.route}</Text>
            <Text>Время начала: {data.start_time}</Text>
            <Text>Время завершения: {data.finish_time}</Text>
        </div>
    );
};
