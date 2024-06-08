from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import psycopg2
from handlers.employee_router import employee_router

from cron.Scheduler import Scheduler
from .passenger_router import passenger_router


def get_application() -> FastAPI:
    application = FastAPI()
    application.include_router(passenger_router, prefix='/passenger', tags=['passenger'])
    application.include_router(employee_router, prefix='/employee', tags=['requisitions'])
    return application


app = get_application()

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scheduler = Scheduler(BackgroundScheduler())


@app.on_event("startup")
def startup_actions():
    scheduler.register_executors()
    scheduler.start()


@app.on_event("shutdown")
def shutdown_actions():
    scheduler.shutdown()
