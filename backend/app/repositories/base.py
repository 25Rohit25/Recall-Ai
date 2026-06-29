"""
Why it exists: Standardizes CRUD (Create, Read, Update, Delete) operations across all models.
Why this architecture is scalable: It prevents code duplication. Custom queries can be built on top of this by extending the class, but 90% of basic DB interactions are handled here. Supports Soft Deletes natively.
"""
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class CRUDBase(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        query = select(self.model).where(self.model.id == id, self.model.deleted_at.is_(None))
        result = await db.execute(query)
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        query = select(self.model).where(self.model.deleted_at.is_(None)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, *, obj_in: Dict[str, Any]) -> ModelType:
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: ModelType, obj_in: Dict[str, Any]) -> ModelType:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: str, soft_delete: bool = True) -> Optional[ModelType]:
        obj = await self.get(db=db, id=id)
        if not obj:
            return None
        
        if soft_delete:
            from datetime import datetime, timezone
            obj.deleted_at = datetime.now(timezone.utc)
            db.add(obj)
        else:
            await db.delete(obj)
            
        await db.commit()
        return obj
