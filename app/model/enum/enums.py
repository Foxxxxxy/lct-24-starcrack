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
    Head_of_the_section = 'Head of the section'
    Senior_inspector = 'Senior inspector'
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
    FINISHED = 'FINISHED'
    CANCELLED = 'CANCELLED'
    NEED_DYNAMIC_SCHEDULING = 'NEED_DYNAMIC_SCHEDULING'
    SCHEDULED = 'SCHEDULED'
    IN_PROGRESS = 'IN_PROGRESS'


class Weekday(enum.Enum):
    Monday = 'Monday'
    Tuesday = 'Tuesday'
    Wednesday = 'Wednesday'
    Thursday = 'Thursday'
    Friday = 'Friday'
    Saturday = 'Saturday'
    Sunday = 'Sunday'
