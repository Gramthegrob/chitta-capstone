# app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os, uvicorn, logging
from typing import List

# ---------------- Settings ----------------
class Settings:
    def __init__(self):
        self.app_name    = os.getenv("APP_NAME", "Mental Health Screening API - SECURE")
        self.app_version = os.getenv("APP_VERSION", "1.0.0")
        self.api_prefix  = os.getenv("API_PREFIX", "/api/v1")

        # default dev-friendly; ubah via .env saat production
        self.debug         = os.getenv("DEBUG", "true").lower() == "true"
        self.require_https = os.getenv("REQUIRE_HTTPS", "false").lower() == "true"

        self.host = os.getenv("HOST", "0.0.0.0")
        self.port = int(os.getenv("PORT", "8000"))

        # CORS/Host
        self.allowed_hosts   = [h.strip() for h in os.getenv("ALLOWED_HOSTS", "*" if self.debug else "localhost,127.0.0.1,::1").split(",")]
        self.allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*" if self.debug else "").split(",") if o.strip()]

        # SSL files (only used if require_https=True)
        self.ssl_keyfile  = os.getenv("SSL_KEYFILE", "./ssl/key.pem")
        self.ssl_certfile = os.getenv("SSL_CERTFILE", "./ssl/cert.pem")

settings = Settings()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("screening-api")

def ssl_config_ok() -> bool:
    return os.path.exists(settings.ssl_keyfile) and os.path.exists(settings.ssl_certfile)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting API %s v%s", settings.app_name, settings.app_version)
    logger.info("Mode: %s", "DEBUG" if settings.debug else "PRODUCTION")
    logger.info("Require HTTPS: %s", settings.require_https)

    if settings.require_https and not settings.debug and not ssl_config_ok():
        # Validasi SSL hanya saat benar2 diperlukan (prod + https)
        raise RuntimeError("SSL certificates not found (SSL_CERTFILE / SSL_KEYFILE).")

    yield
    logger.info("Shutting down API")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    description=(
        "SECURE API untuk Screening Kesehatan Mental (Certainty Factor). "
        "Data sensitif diproses secara ephemeral dan dianjurkan lewat HTTPS di production."
    ),
)

# ------------- Middlewares -------------
# Redirect ke HTTPS hanya ketika di production & diharuskan
if settings.require_https and not settings.debug:
    app.add_middleware(HTTPSRedirectMiddleware)

# Trusted hosts (longgar di dev, ketat di prod)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts if settings.allowed_hosts else ["*"]
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins if settings.allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    expose_headers=["Content-Length", "X-Total-Count"],
    max_age=600
)

# Security headers (HSTS hanya saat HTTPS)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
    return response

# ------------- Routers -------------
from app.api.endpoints.screening import router as screening_router
app.include_router(screening_router, prefix=settings.api_prefix, tags=["screening"])

# ------------- Basic endpoints -------------
@app.get("/")
async def root():
    return {
        "message": "Secure Mental Health Screening API",
        "version": settings.app_version,
        "status": "operational",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "screening": f"{settings.api_prefix}/screening"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "version": settings.app_version,
        "https_enforced": settings.require_https and not settings.debug,
        "ssl_ready": ssl_config_ok(),
    }

# ------------- Entrypoint -------------
def create_ssl_kwargs() -> dict:
    if settings.require_https and not settings.debug and ssl_config_ok():
        return {"ssl_keyfile": settings.ssl_keyfile, "ssl_certfile": settings.ssl_certfile}
    return {}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info",
        **create_ssl_kwargs()
    )
