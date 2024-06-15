from typing import Annotated

import fastapi
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from db.base import get_db
from service import auth_service

from model.dto.auth_models import *

auth_router = APIRouter()


@auth_router.post("/get_token")
async def get_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    result = auth_service.get_access_token(db, form_data)
    return result


@auth_router.post("/sign_up", response_model=UserOutputSchema)
async def sign_up(form: SignUpSchema,
                  db: Session = Depends(get_db)
):
    if form.role in [RoleType.Attendant, RoleType.Operator]:
        raise fastapi.exceptions.HTTPException(status_code=400)

    result = auth_service.sign_up(form, db)
    return result


@auth_router.get("/me", response_model=UserOutputSchema)
async def get_me(user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)]):
    return user.__dict__


@auth_router.post("/refresh_token")
async def refresh_access_token(refresh_token: str):
    username = auth_service.verify(refresh_token)
    access_token = auth_service.create_access_token(data={"sub": username})
    return {"access_token": access_token, "token_type": "bearer"}
