import {Passenger, Shift, Request as RequestT} from './types';

export const passengerCategories = [
    'ИЗТ',
    'ИЗ',
    'ИС',
    'ИК',
    'ИО',
    'ДИ',
    'ПЛ',
    'РД',
    'РДК',
    'ОГД',
    'ОВ',
    'ИУ',
];

export const FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

export const mapSex: Record<string, Passenger['sex']> = {
    М: 'Male',
    Ж: 'Female',
};

export const mapSexBack: Record<Passenger['sex'], string> = {
    Male: 'М',
    Female: 'Ж',
};

export const weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const mapWeeksBack: Record<Shift['weekday'], string> = {
    Monday: 'Понедельник',
    Tuesday: 'Вторник',
    Wednesday: 'Среда',
    Thursday: 'Четверг',
    Friday: 'Пятница',
    Saturday: 'Суббота',
    Sunday: 'Воскресенье',
}

export const mapMethod: Record<string, Request['method']> = {
    Telephone: 'Электронные сервисы',
    WebServices: 'По телефону',
};

export const mapMethodBack: Record<string, RequestT['method']> = {
    'Электронные сервисы': 'Telephone',
    'По телефону': 'WebServices',
};

export const accessPages = {
    'Admin': ['main', 'gant', 'passengersList', 'employeeList', 'workTimeList', 'createRequest', 'createPassenger', 'createEmployee', 'createWorkTime'],
    'Specialist': ['main', 'gant', 'passengersList', 'employeeList', 'workTimeList', 'createRequest', 'createPassenger', 'createEmployee', 'createWorkTime'],
    'Attendant': ['main'],
    'Operator': ['main', 'gant', 'passengersList', 'employeeList', 'workTimeList', 'createRequest', 'createPassenger', 'createWorkTime']
}