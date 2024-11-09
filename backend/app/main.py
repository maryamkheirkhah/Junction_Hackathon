from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from ensure_schema import ensure_schema

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.on_event("startup")
async def startup():
    ensure_schema()

@app.get("/")
async def root():
    return {"message": "Hello World"}
