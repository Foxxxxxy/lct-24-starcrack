from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from handlers.requisitions_router import requisitions_router
from handlers.employee_router import employee_router
from handlers.shifts_router import shifts_router
from cron.Scheduler import Scheduler
from handlers.passenger_router import passenger_router
from handlers.auth_router import auth_router


def get_application() -> FastAPI:
    application = FastAPI()
    application.include_router(passenger_router, prefix='/passenger', tags=['passenger'])
    application.include_router(employee_router, prefix='/employee', tags=['employee'])
    application.include_router(requisitions_router, prefix='/requisitions', tags=['requisitions'])
    application.include_router(shifts_router, prefix='/shifts', tags=['shifts'])
    application.include_router(auth_router, prefix='/user', tags=['auth'])
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
