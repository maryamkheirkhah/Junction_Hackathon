# FinGrid

## Creating and activating .vevn

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## Installing requirements

```bash
pip install -r requirements.txt
```

## Initializing database

```bash
alembic init alembic
```

## Manage migrations

### Create a new migration

```bash
alembic revision --autogenerate -m "Initial schema"
```

### Apply migrations

```bash
alembic upgrade head
```

## Example of .env file content

is contained int he example file .env.example

## Running the translataion script

```bash
python tranlate.py
```
