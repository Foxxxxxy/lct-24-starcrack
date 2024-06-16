from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta

from db.base import get_db
from db.crud_auth import *
from typing import Union
import re
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from db.models.employees import *
from db.crud_employee import *

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

password_pattern = r'[A-Za-z0-9@#$%^&+=]{8,}'


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(name: str, password: str, db: Session) -> Union[UserOutputSchema, None]:
    user = suggest_by_name(name, db)[0]
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    # user_return = UserOutputSchema.from_orm(user)
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_password_hash(password):
    return pwd_context.hash(password)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/get_token")
oauth2_scheme_no_error = OAuth2PasswordBearer(tokenUrl="user/get_token", auto_error=False)


def check_user_level(level):
    if level not in [RoleType.Admin, RoleType.Operator, RoleType.Attendant, RoleType.Specialist]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="no such user level")
    return level


async def _get_user_secured(token: str, db: Session):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_employee_by_name(db, username)
    if user is None:
        raise credentials_exception
    return user


async def get_user_secured(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserOutputSchema:
    return await _get_user_secured(token, db)


# async def get_user_secured_safely(token: str = Depends(oauth2_scheme_no_error), db: Session) -> Union[UserModel,
# None]: if token is None: return None try: return await _get_user_secured(token, db) except HTTPException: return None

async def _check_for_permission(user: SignUpSchema, role: list, name: str):
    if user.role not in role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You need to be at least {name}"
        )
    return user


async def auth_user(user: UserOutputSchema = Depends(get_user_secured)):
    return await _check_for_permission(user,
                                       [RoleType.Specialist, RoleType.Operator, RoleType.Admin, RoleType.Attendant],
                                       'authed')


async def auth_moderator(user: Employee = Depends(get_user_secured)) -> Employee:
    return await _check_for_permission(user, [RoleType.Operator], 'operator')


async def auth_admin_spec(user: Employee = Depends(get_user_secured)) -> Employee:
    return await _check_for_permission(user, [RoleType.Admin, RoleType.Specialist], 'admin or specialist')


async def auth_admin_spec_op(user: Employee = Depends(get_user_secured)) -> Employee:
    return await _check_for_permission(user, [RoleType.Admin, RoleType.Specialist, RoleType.Operator],
                                       'admin or specialist or operator')


async def auth_admin(user: Employee = Depends(get_user_secured)) -> Employee:
    return await _check_for_permission(user, [RoleType.Admin], 'admin')


def sign_up(form: SignUpSchema, db: Session):
    if not re.fullmatch(password_pattern, form.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    form.password = get_password_hash(form.password)
    check_user_level(form.role)
    if get_employee_by_name(db, form.full_name) is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="there is already a user with such email")
    result = create_user(db, form)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return result


def get_access_token(db: Session, form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.full_name}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.full_name})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "level": user.role,
            "refresh_token": refresh_token}


def get_user(id: int, db: Session, user: Employee = Depends(auth_user)):
    result = get_user_by_id(db, id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="no such user")
    return result


def update_user(
        id: int, user_update: UserUpdateSchema, db: Session,
        user: Employee = Depends(auth_user)
):
    if user_update.level is not None and user.level != RoleType.Admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="you are not admin, you can not change level of user")

    return update_user(db, id, user_update)


def get_users_list(
        skip: int, limit: int, db: Session,
        user: Employee = Depends(auth_admin)
):
    result = get_users(db, skip, limit)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="no such user")
    return result


def verify(refresh_token: str, ):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username
