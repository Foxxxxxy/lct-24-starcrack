export type RequestMethod = 'Telephone' | 'WebServices';

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
    passengers_amount: number;
    start_time: string;
    meet_time: string | null;
    finish_time: string;
    status: RequestStatus;
    creation_time: string;
    males_needed: number;
    females_needed: number;
    start_station: string;
    start_station_comment: string | null;
    end_station: string;
    end_station_comment: string | null;
    method: RequestMethod;
    baggage: string | null;
    comment: string | null;
    employees: Employer[];
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

export type MetroStation = {
    id: number;
    line_id: string;
    line_name: string;
    station_name: string;
};

export type Passenger = {
    id?: number;
    sex: 'Male' | 'Female';
    passenger_category: PassengersCategories;
    name: string;
    phone: string;
    comment: string;
    pacemaker: boolean;
};

export type Request = {
    id?: number;
    passenger_id: number;
    passengers_amount: number;
    start_time: string;
    males_needed: number;
    females_needed: number;
    start_station: string;
    end_station: string;
    method: RequestMethod;
    baggage: string;
    comment: string;
    start_station_comment: string;
    end_station_comment: string;
};

export type Employer = {
    id?: number;
    full_name: string;
    sex: 'Male' | 'Female';
    role: 'Admin' | 'Specialist' | 'Inspector' | 'Operator'; //TODO check sub_roles
    sub_role: 'Head_of_the_section' | 'Senior_inspector' | 'Inspector'; //TODO check sub_roles
    phone: string;
    easy_work: boolean;
    password?: string;
    username?: string;
};

export type Shift = {
    id?: number;
    employee_id: number;
    time_start: string;
    time_end: string;
    place_start: string | undefined;
    weekday: string;
};

export type User = {
    id: number;
    role: string;
    full_name: string;
    username: string;
};
