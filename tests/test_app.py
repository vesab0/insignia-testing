"""
Unit tests for the restaurant application
"""

import pytest
from datetime import datetime, timedelta

from backend.app import create_app
from backend.config import TestingConfig
from backend.models import Reservation, Newsletter
from backend.validators import (
    EmailValidator,
    PhoneValidator,
    DateValidator,
    TimeValidator,
    GuestsValidator,
    ReservationValidator
)
from backend.services import ReservationService, EmailService


@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app(TestingConfig)
    return app


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


class TestEmailValidator:
    """Test email validation"""
    
    def test_valid_email(self):
        validator = EmailValidator("test@example.com")
        assert validator.is_valid() is True
    
    def test_invalid_email_format(self):
        validator = EmailValidator("invalid-email")
        assert validator.is_valid() is False
        assert "Invalid email format" in validator.get_errors()
    
    def test_empty_email(self):
        validator = EmailValidator("")
        assert validator.is_valid() is False
        assert "Email is required" in validator.get_errors()
    
    def test_email_too_long(self):
        long_email = "a" * 250 + "@example.com"
        validator = EmailValidator(long_email)
        assert validator.is_valid() is False


class TestPhoneValidator:
    """Test phone validation"""
    
    def test_valid_phone(self):
        validator = PhoneValidator("+1 (555) 123-4567")
        assert validator.is_valid() is True
    
    def test_valid_phone_no_formatting(self):
        validator = PhoneValidator("5551234567")
        assert validator.is_valid() is True
    
    def test_invalid_phone(self):
        validator = PhoneValidator("123")
        assert validator.is_valid() is False
    
    def test_empty_phone(self):
        validator = PhoneValidator("")
        assert validator.is_valid() is False


class TestDateValidator:
    """Test date validation"""
    
    def test_valid_future_date(self):
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        validator = DateValidator(future_date)
        assert validator.is_valid() is True
    
    def test_past_date(self):
        past_date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        validator = DateValidator(past_date)
        assert validator.is_valid() is False
        assert "cannot be in the past" in validator.get_errors()
    
    def test_monday_closed(self):
        # Find next Monday
        today = datetime.now()
        days_ahead = 0 - today.weekday()
        if days_ahead <= 0:
            days_ahead += 7
        next_monday = (today + timedelta(days=days_ahead)).strftime('%Y-%m-%d')
        
        validator = DateValidator(next_monday)
        assert validator.is_valid() is False
        assert "closed on Mondays" in validator.get_errors()
    
    def test_invalid_date_format(self):
        validator = DateValidator("2024/01/01")
        assert validator.is_valid() is False


class TestTimeValidator:
    """Test time validation"""
    
    def test_valid_time(self):
        validator = TimeValidator("19:00")
        assert validator.is_valid() is True
    
    def test_invalid_time(self):
        validator = TimeValidator("12:00")
        assert validator.is_valid() is False
    
    def test_empty_time(self):
        validator = TimeValidator("")
        assert validator.is_valid() is False


class TestGuestsValidator:
    """Test guests validation"""
    
    def test_valid_guests(self):
        validator = GuestsValidator(4)
        assert validator.is_valid() is True
    
    def test_zero_guests(self):
        validator = GuestsValidator(0)
        assert validator.is_valid() is False
    
    def test_too_many_guests(self):
        validator = GuestsValidator(20)
        assert validator.is_valid() is False
    
    def test_invalid_guests_type(self):
        validator = GuestsValidator("abc")
        assert validator.is_valid() is False


class TestReservationValidator:
    """Test complete reservation validation"""
    
    def test_valid_reservation(self):
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '+1 (555) 123-4567',
            'guests': 4,
            'date': future_date,
            'time': '19:00',
            'message': 'Window seat please'
        }
        validator = ReservationValidator(data)
        assert validator.is_valid() is True
    
    def test_missing_required_fields(self):
        data = {'name': 'John Doe'}
        validator = ReservationValidator(data)
        assert validator.is_valid() is False
        assert len(validator.errors) > 0
    
    def test_invalid_email_in_reservation(self):
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        data = {
            'name': 'John Doe',
            'email': 'invalid-email',
            'phone': '+1 (555) 123-4567',
            'guests': 4,
            'date': future_date,
            'time': '19:00'
        }
        validator = ReservationValidator(data)
        assert validator.is_valid() is False


class TestReservationService:
    """Test reservation service"""
    
    def test_create_reservation(self):
        service = ReservationService()
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        reservation = Reservation(
            name='John Doe',
            email='john@example.com',
            phone='+1 (555) 123-4567',
            guests=4,
            date=future_date,
            time='19:00'
        )
        
        result = service.create_reservation(reservation)
        assert result['status'] == 'confirmed'
        assert 'id' in result
    
    def test_get_reservation(self):
        service = ReservationService()
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        reservation = Reservation(
            name='John Doe',
            email='john@example.com',
            phone='+1 (555) 123-4567',
            guests=4,
            date=future_date,
            time='19:00'
        )
        
        result = service.create_reservation(reservation)
        retrieved = service.get_reservation(result['id'])
        
        assert retrieved is not None
        assert retrieved.name == 'John Doe'
    
    def test_cancel_reservation(self):
        service = ReservationService()
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        reservation = Reservation(
            name='John Doe',
            email='john@example.com',
            phone='+1 (555) 123-4567',
            guests=4,
            date=future_date,
            time='19:00'
        )
        
        result = service.create_reservation(reservation)
        cancelled = service.cancel_reservation(result['id'])
        
        assert cancelled is True
        retrieved = service.get_reservation(result['id'])
        assert retrieved.status == 'cancelled'


class TestAPIEndpoints:
    """Test API endpoints"""
    
    def test_health_check(self, client):
        response = client.get('/api/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'
    
    def test_create_reservation_success(self, client):
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '+1 (555) 123-4567',
            'guests': 4,
            'date': future_date,
            'time': '19:00',
            'message': 'Window seat please'
        }
        
        response = client.post('/api/reservations',
                              json=data,
                              content_type='application/json')
        assert response.status_code == 201
        result = response.get_json()
        assert result['success'] is True
        assert 'reservation_id' in result
    
    def test_create_reservation_invalid_data(self, client):
        data = {'name': 'John Doe'}  # Missing required fields
        
        response = client.post('/api/reservations',
                              json=data,
                              content_type='application/json')
        assert response.status_code == 400
        result = response.get_json()
        assert result['success'] is False
    
    def test_newsletter_subscription(self, client):
        data = {'email': 'test@example.com'}
        
        response = client.post('/api/newsletter',
                              json=data,
                              content_type='application/json')
        assert response.status_code == 201
        result = response.get_json()
        assert result['success'] is True
    
    def test_newsletter_invalid_email(self, client):
        data = {'email': 'invalid-email'}
        
        response = client.post('/api/newsletter',
                              json=data,
                              content_type='application/json')
        assert response.status_code == 400
        result = response.get_json()
        assert result['success'] is False
    
    def test_get_menu(self, client):
        response = client.get('/api/menu')
        assert response.status_code == 200
        result = response.get_json()
        assert result['success'] is True
        assert 'menu' in result


class TestModels:
    """Test data models"""
    
    def test_reservation_model(self):
        reservation = Reservation(
            name='John Doe',
            email='john@example.com',
            phone='+1 (555) 123-4567',
            guests=4,
            date='2024-12-25',
            time='19:00'
        )
        
        assert reservation.name == 'John Doe'
        assert reservation.status == 'pending'
        assert reservation.id is not None
        
        data = reservation.to_dict()
        assert 'id' in data
        assert data['name'] == 'John Doe'
    
    def test_newsletter_model(self):
        newsletter = Newsletter(email='test@example.com')
        
        assert newsletter.email == 'test@example.com'
        assert newsletter.active is True
        assert newsletter.id is not None
        
        data = newsletter.to_dict()
        assert 'id' in data
        assert data['email'] == 'test@example.com'

# Made with Bob
