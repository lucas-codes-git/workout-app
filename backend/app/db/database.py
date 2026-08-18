# database connection stuff goes here, nothing table specific

from psycopg_pool import AsyncConnectionPool
from app.core import fetch_secrets

secrets = fetch_secrets()

pool = AsyncConnectionPool(
    conninfo=secrets["db_url"],
    min_size=1,
    max_size=5,
    open=False
)