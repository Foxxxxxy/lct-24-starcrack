import enum


class EventType(enum.Enum):
    DYNAMIC_SCHEDULE_REQUEST = 'DYNAMIC_SCHEDULE_REQUEST'
    UNSCHEDULED_REQUEST = 'UNSCHEDULED_REQUEST'


class Criticality(enum.Enum):
    CRITICAL = 'CRITICAL'
    WARNING = 'WARNING'
    NORMAL = 'NORMAL'


class SexType(enum.Enum):
    Male = "Male"
    Female = "Female"


class RoleType(enum.Enum):
    Admin = 'Admin'
    Attendant = 'Attendant'
    Operator = 'Operator'
    Specialist = 'Specialist'


class SubRoleType(enum.Enum):
    Head_of_the_section = 'Head_of_the_section'
    Senior_inspector = 'Senior_inspector'
    Inspector = 'Inspector'


class PassengerCategory(enum.Enum):
    ИЗТ = 'ИЗТ'
    ИЗ = 'ИЗ'
    ИС = 'ИС'
    ИК = 'ИК'
    ИО = 'ИО'
    ДИ = 'ДИ'
    ПЛ = 'ПЛ'
    РД = 'РД'
    РДК = 'РДК'
    ОГД = 'ОГД'
    ОВ = 'ОВ'
    ИУ = 'ИУ'


class Status(enum.Enum):
    SELECTED_FOR_SCHEDULING = 'SELECTED_FOR_SCHEDULING'
    NEED_DYNAMIC_SCHEDULING = 'NEED_DYNAMIC_SCHEDULING'
    SCHEDULED = 'SCHEDULED'
    INSPECTOR_EN_ROUTE = 'INSPECTOR_EN_ROUTE'
    INSPECTOR_ARRIVED = 'INSPECTOR_ARRIVED'
    IN_PROGRESS = 'IN_PROGRESS'
    FINISHED = 'FINISHED'
    CANCELLED = 'CANCELLED'
    REJECTED = 'REJECTED'
    PASSENGER_LATE = 'PASSENGER_LATE'
    INSPECTOR_LATE = 'INSPECTOR_LATE'


class Weekday(enum.Enum):
    Monday = 'Monday'
    Tuesday = 'Tuesday'
    Wednesday = 'Wednesday'
    Thursday = 'Thursday'
    Friday = 'Friday'
    Saturday = 'Saturday'
    Sunday = 'Sunday'


class MethodType(enum.Enum):
    Telephone = 'Telephone'
    WebServices = 'WebServices'
