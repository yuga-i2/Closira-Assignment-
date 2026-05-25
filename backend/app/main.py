from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.database import init_db
from app.api import enquiry, health
from app.core.logging import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Closira API", extra={"event": "startup"})
    init_db()
    logger.info("Database initialised", extra={"event": "db_init"})
    yield
    logger.info("Shutting down Closira API", extra={"event": "shutdown"})


app = FastAPI(
    title="Closira Enquiry API",
    description=(
        "REST API powering Closira's enquiry-handling pipeline. "
        "Handles inbound customer enquiries from WhatsApp, email, and phone, "
        "processes them asynchronously against SOPs, and exposes status and history endpoints."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────
app.include_router(enquiry.router)
app.include_router(health.router)


# ── Global Exception Handlers ────────────────────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(
        "Unhandled exception",
        extra={"event": "unhandled_exception", "path": str(request.url), "error": str(exc)},
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )


@app.get("/", include_in_schema=False)
def root():
    return {"message": "Closira API is running. Visit /docs for interactive documentation."}
