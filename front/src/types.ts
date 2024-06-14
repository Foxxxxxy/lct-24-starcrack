export type RequestStatus =
    | 'SELECTED_FOR_SCHEDULING'
    | 'NEED_DYNAMIC_SCHEDULING'
    | 'SCHEDULED'
    | 'INSPECTOR_EN_ROUTE'
    | 'INSPECTOR_ARRIVED'
    | 'IN_PROGRESS'
    | 'FINISHED'
    | 'CANCELLED'
    | 'REJECTED'
    | 'PASSENGER_LATE'
    | 'INSPECTOR_LATE';

export type RequestItem = {
    id: number;
    passenger_id: number;
    start_time: string;
    finish_time: string;
    meet_time: string;
    status: RequestStatus;
    creation_time: string;
    males_needed: number;
    females_needed: number;
    start_station: string;
    end_station: string;
};

export type PassengersCategories =
    | 'ИЗТ'
    | 'ИЗ'
    | 'ИС'
    | 'ИК'
    | 'ИО'
    | 'ДИ'
    | 'ПЛ'
    | 'РД'
    | 'РДК'
    | 'ОГД'
    | 'ОВ'
    | 'ИУ';