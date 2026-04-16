from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_role_key: str
    supabase_jwt_secret: str
    frontend_url: str = "http://localhost:5174"

    class Config:
        env_file = ".env"

settings = Settings()
