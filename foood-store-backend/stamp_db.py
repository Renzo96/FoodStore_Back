"""
Registra todas las migraciones como ya aplicadas en alembic_version
sin ejecutar ningún DDL. Útil cuando la BD fue creada con create_all().
"""
from alembic.config import Config
from alembic import command

cfg = Config("alembic.ini")
command.stamp(cfg, "head")
print("✅ alembic_version actualizado a HEAD correctamente.")
