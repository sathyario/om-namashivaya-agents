from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import products, orders, categories, users, admin, ai

app = FastAPI(
    title="Om Namashivaya Agents API",
    description="Backend API for Om Namashivaya Agents — electronics and food distribution",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "Om Namashivaya Agents API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
