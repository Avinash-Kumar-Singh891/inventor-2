from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # This forces it to save safely inside a local file named test.db
    DATABASE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()