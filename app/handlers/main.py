from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

from .passenger_router import passenger_router


def get_application() -> FastAPI:
    application = FastAPI()
    application.include_router(passenger_router, prefix='/passenger', tags=['passenger'])
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


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/db")
def read_db():
    try:
        connection = psycopg2.connect(user="user",
                                      password="password",
                                      host="db",
                                      port="5432",
                                      database="db")
        cursor = connection.cursor()
        cursor.execute("SELECT 1;")
        return {"Database": "Connected"}
    except Exception as e:
        return {"error": str(e)}
