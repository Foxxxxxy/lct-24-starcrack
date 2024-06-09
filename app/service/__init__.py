def db_model_from_dto(dto_entity, db_model):
    db_entity = db_model()
    for field in dto_entity.__fields__.keys():
        if hasattr(db_entity, field):
            setattr(db_entity, field, getattr(dto_entity, field))
    return db_entity
