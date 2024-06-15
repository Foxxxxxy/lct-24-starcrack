def db_model_from_dto(dto_entity, db_model):
    db_entity = db_model()
    for field in dto_entity.__fields__.keys():
        if hasattr(db_entity, field):
            setattr(db_entity, field, getattr(dto_entity, field))
    return db_entity


def update_bd_objects(base_obj, update_obj):
    for key, value in update_obj.items():
        if hasattr(base_obj, key) and value is not None:
            setattr(base_obj, key, value)
    return base_obj
