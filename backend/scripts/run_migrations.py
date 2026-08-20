import asyncio
from pathlib import Path

from app.db import pool


MIGRATIONS_DIR = Path(__file__).resolve().parent.parent / "migrations"


async def create_migrations_table():
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    id SERIAL PRIMARY KEY,
                    migration_name TEXT NOT NULL UNIQUE,
                    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )


async def get_applied_migrations():
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                """
                SELECT migration_name
                FROM schema_migrations
                ORDER BY id;
                """
            )

            return {row[0] for row in await cur.fetchall()}


async def run_migrations():
    await create_migrations_table()

    applied_migrations = await get_applied_migrations()

    migration_files = sorted(MIGRATIONS_DIR.glob("*.sql"))

    for migration_file in migration_files:

        if migration_file.name in applied_migrations:
            print(f"Skipping {migration_file.name}")
            continue

        print(f"Running {migration_file.name}")

        sql = migration_file.read_text()

        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(sql)

                await cur.execute(
                    """
                    INSERT INTO schema_migrations (migration_name)
                    VALUES (%s);
                    """,
                    (migration_file.name,),
                )

        print(f"Applied {migration_file.name}")


if __name__ == "__main__":

    async def main():
        await pool.open()

        try:
            await run_migrations()
        finally:
            await pool.close()

    asyncio.run(main())