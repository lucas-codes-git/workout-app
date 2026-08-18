import os

def fetch_secrets():
    return {
        "db_url": os.getenv("DATABASE_URL")
    }