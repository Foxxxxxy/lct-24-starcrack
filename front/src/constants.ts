import {Passenger} from './types';

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
