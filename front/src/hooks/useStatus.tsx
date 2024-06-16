import {Label, LabelProps} from '@gravity-ui/uikit';
import {RequestStatus} from 'src/types';

type StatusContent = {
    name: string;
    theme: LabelProps['theme'];
};

export const statuses: Record<RequestStatus, StatusContent> = {
    SELECTED_FOR_SCHEDULING: {name: 'На рассмотрении', theme: 'info'},
    NEED_DYNAMIC_SCHEDULING: {name: 'Не подтверждена', theme: 'danger'},
    SCHEDULED: {name: 'Принята', theme: 'info'},
    INSPECTOR_EN_ROUTE: {name: 'Инспектор выехал', theme: 'info'},
    INSPECTOR_ARRIVED: {name: 'Инспектор на месте', theme: 'info'},
    IN_PROGRESS: {name: 'Поездка', theme: 'info'},
    FINISHED: {name: 'Заявка закончена', theme: 'success'},
    CANCELLED: {name: 'Отмена', theme: 'unknown'},
    REJECTED: {name: 'Отказ', theme: 'unknown'},
    PASSENGER_LATE: {name: 'Пассажир опаздывает', theme: 'warning'},
    INSPECTOR_LATE: {name: 'Инспектор опаздывает', theme: 'warning'},
};

export const useStatus = (status: RequestStatus) => {
    if (!status) {
        return null;
    }
    return <Label theme={statuses[status].theme}>{statuses[status].name}</Label>;
};
