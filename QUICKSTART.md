# Quick Start

## Setup

```bash
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
```

On macOS or Linux, activate with `source venv/bin/activate`.

## Run

```bash
python run.py
```

Open `http://localhost:5000`.

## Verify

```bash
python -m pytest
python -m black --check backend tests run.py setup.py
python -m flake8 backend tests --count --max-complexity=10 --max-line-length=100 --statistics
```

## API Smoke Tests

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/menu
```

Create a reservation:

```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "guests": 4,
    "date": "2026-06-17",
    "time": "19:00",
    "message": "Window seat please"
  }'
```

Subscribe to the newsletter:

```bash
curl -X POST http://localhost:5000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```
