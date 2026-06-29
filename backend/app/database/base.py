"""
Why it exists: Defines the foundational Base model that all other SQLAlchemy ORM models inherit from.
Why this architecture is scalable: It centralizes common fields (id, created_at, updated_at). By enforcing UUIDs and timestamps globally, we avoid repeating this boilerplate across dozens of tables.
How it can evolve: Can easily add global 'deleted_at' (for soft deletes) or 'tenant_id' (for multi-tenancy) by modifying just this one file.
Common mistakes avoided: Forgetting to add created_at/updated_at to a new table, using auto-incrementing integer IDs (which expose business metrics and cause issues in distributed DBs).
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    """
    Standard Base class for all ORM models.
    """
    __abstract__ = True

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
