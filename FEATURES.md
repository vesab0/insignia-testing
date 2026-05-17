# Features

## Backend

- Flask application factory with environment-based configuration.
- JSON API endpoints for health checks, menu data, reservations, and newsletter subscriptions.
- Server-side validation for email, phone, reservation date, time, guest count, and optional notes.
- Reservation conflict detection for duplicate active bookings in the same time slot.
- Centralized service layer for reservation, menu, and email-related operations.
- Custom exception types with consistent API error responses.

## Frontend

- Responsive restaurant landing page served through Flask templates.
- Client-side interactions for navigation, menu filtering, forms, and notifications.
- Static assets organized under `frontend/static`.

## Quality

- Pytest coverage for validators, models, services, and API endpoints.
- Black and flake8 checks in CI.
- GitHub Actions workflow for test, lint, and security scan jobs.

## Known Limitations

- Data is currently stored in memory and resets when the process restarts.
- Email sending is simulated by the service layer.
- Authentication, admin workflows, and database migrations are out of scope for the current implementation.
