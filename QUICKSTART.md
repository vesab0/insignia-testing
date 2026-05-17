# Quick Start Guide

Get the Restaurant Management System up and running in 5 minutes!

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git (optional)

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd insignia-testing
```

### 2. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment (Optional)

```bash
# Copy example environment file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Linux/Mac

# Edit .env if needed (optional for development)
```

### 5. Run the Application

```bash
python run.py
```

You should see:
```
Starting server in development mode...
Debug mode: True
Access the application at: http://localhost:5000
 * Running on http://0.0.0.0:5000
```

### 6. Open in Browser

Navigate to: **http://localhost:5000**

## Testing the Application

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=backend --cov-report=html
```

View coverage report: Open `htmlcov/index.html` in browser

## Using the API

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Create Reservation

```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "guests": 4,
    "date": "2024-12-25",
    "time": "19:00",
    "message": "Window seat please"
  }'
```

### Subscribe to Newsletter

```bash
curl -X POST http://localhost:5000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

### Get Menu

```bash
curl http://localhost:5000/api/menu
```

## Project Structure Overview

```
insignia-testing/
├── backend/           # Python backend
│   ├── app.py        # Main Flask app
│   ├── models.py     # Data models
│   ├── services.py   # Business logic
│   └── validators.py # Input validation
├── frontend/         # Frontend assets
│   ├── static/       # CSS, JS
│   └── templates/    # HTML templates
├── tests/            # Test suite
├── run.py           # Run script
└── requirements.txt # Dependencies
```

## Common Commands

### Development

```bash
# Run server
python run.py

# Run tests
pytest

# Run tests with coverage
pytest --cov=backend

# Format code
black backend/ tests/

# Lint code
flake8 backend/ tests/
```

### Production

```bash
# Set environment
export FLASK_ENV=production  # Linux/Mac
set FLASK_ENV=production     # Windows

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 "backend.app:create_app()"
```

## Troubleshooting

### Port Already in Use

Change port in `run.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=debug)
```

### Module Not Found

Make sure virtual environment is activated:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Import Errors

Reinstall dependencies:
```bash
pip install -r requirements.txt --force-reinstall
```

## Next Steps

1. **Read Documentation**
   - `README_NEW.md` - Complete documentation
   - `ARCHITECTURE.md` - Architecture details
   - `CONTRIBUTING.md` - Contribution guidelines

2. **Explore the Code**
   - Start with `backend/app.py`
   - Check `backend/models.py` for data structures
   - Review `tests/test_app.py` for examples

3. **Make Changes**
   - Follow the contribution guidelines
   - Write tests for new features
   - Update documentation

## Support

- Check documentation files
- Review test cases for examples
- Open an issue for questions

## Quick Reference

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Main page |
| GET | `/api/health` | Health check |
| POST | `/api/reservations` | Create reservation |
| POST | `/api/newsletter` | Subscribe newsletter |
| GET | `/api/menu` | Get menu items |

### Business Rules

- **Opening Hours**: 5:00 PM - 11:00 PM
- **Closed**: Mondays
- **Max Guests**: 10 per reservation
- **Advance Booking**: 2 hours min, 90 days max

### Available Time Slots

17:00, 17:30, 18:00, 18:30, 19:00, 19:30, 20:00, 20:30, 21:00

---

**Happy Coding! 🚀**