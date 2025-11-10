# app/config.py (atau app/services/config.py)
import os
from typing import List

TRUE_SET = {"1", "true", "yes", "y", "on"}

def parse_bool(val: str, default: bool = False) -> bool:
    if val is None:
        return default
    return str(val).strip().lower() in TRUE_SET

def parse_csv(val: str, default: List[str] = None) -> List[str]:
    if not val:
        return default or []
    return [item.strip() for item in val.split(",") if item.strip()]

class Settings:
    def __init__(self):
        # App
        self.app_name    = os.getenv("APP_NAME", "Mental Health Screening API")
        self.app_version = os.getenv("APP_VERSION", "1.0.0")
        self.api_prefix  = os.getenv("API_PREFIX", "/api/v1")

        # Server
        self.host  = os.getenv("HOST", "0.0.0.0")
        self.port  = int(os.getenv("PORT", "8000"))
        self.debug = parse_bool(os.getenv("DEBUG"), default=True)

        # Security / CORS
        # NOTE: gunakan '*' hanya saat dev & tanpa allow_credentials
        self.allowed_origins: List[str] = parse_csv(
            os.getenv("ALLOWED_ORIGINS", "*" if self.debug else "")
        )
        self.allowed_hosts: List[str] = parse_csv(
            os.getenv("ALLOWED_HOSTS", "*" if self.debug else "localhost,127.0.0.1,::1")
        )
        self.require_https = parse_bool(os.getenv("REQUIRE_HTTPS"), default=not self.debug)

        # Rate limiting
        self.enable_rate_limit = parse_bool(os.getenv("ENABLE_RATE_LIMIT"), default=True)
        self.rate_limit_max = int(os.getenv("RATE_LIMIT_MAX", "10"))
        self.rate_limit_window = int(os.getenv("RATE_LIMIT_WINDOW", "60"))

        # SSL files (dipakai jika require_https=True)
        self.ssl_keyfile  = os.getenv("SSL_KEYFILE", "./ssl/key.pem")
        self.ssl_certfile = os.getenv("SSL_CERTFILE", "./ssl/cert.pem")

settings = Settings()
