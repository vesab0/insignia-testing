# Restaurant Reservation App

A Flask-based restaurant website with reservation, newsletter, menu, and health-check endpoints. The project keeps backend business rules, validation, and presentation code in separate modules so the API can be tested independently from the frontend.

## Project Structure

```text
backend/
  app.py          Flask application factory and API routes
  config.py       Environment-specific configuration
  exceptions.py   Application exception hierarchy
  models.py       Dataclass models
  services.py     Reservation, email, and menu services
  validators.py   Input and business-rule validation
frontend/
  templates/      Jinja templates
  static/         CSS and JavaScript assets
tests/
  test_app.py     Unit and API tests
```

## Requirements

- Python 3.9+
- pip

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

## Run Locally

```bash
python run.py
```

The app starts on `http://localhost:5000`.

## Test and Quality Checks

```bash
python -m pytest
python -m black --check backend tests
python -m flake8 backend tests --count --select=E9,F63,F7,F82 --show-source --statistics
```

## API

### `GET /api/health`

Returns service health and a UTC timestamp.

### `GET /api/menu`

Returns menu items grouped by category.

### `POST /api/reservations`

Creates a reservation after server-side validation.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "guests": 4,
  "date": "2026-06-17",
  "time": "19:00",
  "message": "Window seat please"
}
```

### `POST /api/newsletter`

Subscribes an email address to the newsletter.

```json
{
  "email": "john@example.com"
}
```

## Business Rules

- Reservations must be made at least 2 hours in advance.
- Reservations can be made up to 90 days ahead.
- The restaurant is closed on Mondays.
- Available reservation slots run from 17:00 to 21:00 in 30-minute intervals.
- Reservations are limited to 10 guests.

## Current Limitations

- Reservation and newsletter data are stored in memory.
- Email delivery is simulated through the service layer.
- Database models and migrations are intentionally not active yet.
