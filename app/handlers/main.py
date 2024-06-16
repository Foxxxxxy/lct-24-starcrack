from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from algorithms.DijkstraAlgorithm import DijkstraAlgorithm
from handlers.requisitions_router import requisitions_router
from handlers.employee_router import employee_router
from handlers.shifts_router import shifts_router
from cron.Scheduler import Scheduler
from handlers.passenger_router import passenger_router
from handlers.auth_router import auth_router
from .metro_stations_router import metro_stations_router
from .routes_router import routes_router
from handlers.schedule_build_router import schedule_router


def get_application() -> FastAPI:
    application = FastAPI(docs_url="/api/docs")
    application.include_router(passenger_router, prefix='/api/passenger', tags=['passenger'])
    application.include_router(employee_router, prefix='/api/employee', tags=['employee'])
    application.include_router(requisitions_router, prefix='/api/requisitions', tags=['requisitions'])
    application.include_router(shifts_router, prefix='/api/shifts', tags=['shifts'])
    application.include_router(auth_router, prefix='/api/user', tags=['auth'])
    application.include_router(routes_router, prefix='/api/routes', tags=['routes'])
    application.include_router(metro_stations_router, prefix='/api/metro_stations', tags=['metro_stations'])
    application.include_router(schedule_router, prefix='/api/schedule', tags=['schedule'])

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

    app.state.dijkstra_algorithm = DijkstraAlgorithm()


@app.on_event("shutdown")
def shutdown_actions():
    scheduler.shutdown()

