# Template file for internal use
# Edit manually anytime additional test data is needed

import datetime
import json
import os
import random
import string

from model.enum.enums import PassengerCategory, RoleType, SubRoleType
from model.enum.enums import Status as RequisitionStatus
from model.enum.enums import SexType


def generate_test_passengers():
    amount = 100
    sql = "INSERT INTO passenger(name, passenger_category)  VALUES" + "\n"

    for i in range(amount):
        passenger_category = random.choice(list(PassengerCategory)).value
        name = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(10))

        cortege = f"('{name}', '{passenger_category}'::passenger_category_type)"
        if i < amount - 1:
            cortege += ",\n"
        else:
            cortege += ";"

        sql += cortege

    with open(f"{os.path.dirname(os.path.realpath(__file__))}/test_data/passengers.sql", "w+") as f:
        f.write(sql)


def generate_test_employees():
    amount = 100
    sql = "INSERT INTO employees(full_name, sex, role, sub_role) VALUES" + "\n"

    for i in range(amount):
        full_name = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase) for _ in range(10))
        sex = random.choice(list(SexType)).value
        role = random.choice(list(RoleType)).value
        if role == RoleType.Attendant:
            sub_role = random.choice(list(SubRoleType)).value
        else:
            sub_role = None

        cortege = f"('{full_name}', '{sex}'::sex_type, '{role}'::role_type, "
        if sub_role is None:
            cortege += "null)"
        else:
            cortege += f"'{sub_role}'::sub_role_type)"

        if i < amount - 1:
            cortege += ",\n"
        else:
            cortege += ";"

        sql += cortege

    with open(f"{os.path.dirname(os.path.realpath(__file__))}/test_data/employees.sql", "w+") as f:
        f.write(sql)


def generate_metro_stations():
    sql = "INSERT INTO metro_stations(id, line_name, line_id, station_name) VALUES" + "\n"

    with open(f"{os.path.dirname(os.path.realpath(__file__))}/test_data/metro_stations_raw.json", "r") as data_file:
        data = json.load(data_file)

        for index, station in enumerate(data):
            cortege = f"({station['id']}, '{station['name_line']}', {station['id_line']}, '{station['name_station']}')"
            if index < len(data) - 1:
                cortege += ",\n"
            else:
                cortege += " ON CONFLICT DO NOTHING;"

            sql += cortege

    with open(f"{os.path.dirname(os.path.realpath(__file__))}/test_data/metro_stations.sql", "w+") as f:
        f.write(sql)


def generate_test_requisitions():
    amount = 30
    sql = "INSERT INTO requisitions(passenger_id, start_time, meet_time, finish_time, status, creation_time, males_needed, females_needed, start_station, end_station) VALUES" + "\n"

    for i in range(amount):
        passenger_id = random.randint(1, 100)

        today = datetime.date.today()
        dates = [today, today + datetime.timedelta(days=1), today + datetime.timedelta(days=2)]

        date = random.choice(dates)
        start_time = datetime.datetime.combine(
            date,
            datetime.time(hour=random.randint(0, 23), minute=random.randint(0,59), second=0)
        )
        finish_time = start_time + datetime.timedelta(minutes=random.randint(10, 50), hours=random.randint(0, 2))

        status = random.choice(list(RequisitionStatus)).value

        creation_time = datetime.datetime.combine(today, datetime.time(hour=0, minute=0, second=0))

        males_needed = random.randint(1, 4)
        females_needed = random.randint(0, 2)

        start_station = random.randint(1, 196)
        end_station = random.randint(1, 196)

        cortege = f"('{passenger_id}', '{start_time}'::timestamp, null, '{finish_time}'::timestamp, '{status}'::status_type, '{creation_time}'::timestamp, {males_needed}, {females_needed}, {start_station}, {end_station})"
        if i < amount - 1:
            cortege += ",\n"
        else:
            cortege += ";"

        sql += cortege

    with open(f"{os.path.dirname(os.path.realpath(__file__))}/test_data/requisitions.sql", "w+") as f:
        f.write(sql)


def main():
    generate_metro_stations()
    generate_test_passengers()
    generate_test_employees()
    generate_test_requisitions()


if __name__ == "__main__":
    main()
