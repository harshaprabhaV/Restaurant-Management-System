import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
INSTANCE_DIR = BASE_DIR / "instance"
INSTANCE_DIR.mkdir(exist_ok=True)


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-change-later"
    )

    SQLALCHEMY_DATABASE_URI = (
        f"sqlite:///{INSTANCE_DIR / 'restaurant.db'}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False