"""
Restaurant Management System Backend
"""

__version__ = '1.0.0'
__author__ = 'Bob - Senior Backend Developer'

from .app import create_app
from .config import Config, get_config
from .models import Reservation, Newsletter, MenuItem, ContactMessage
from .exceptions import (
    RestaurantException,
    ValidationError,
    ServiceError,
    DatabaseError,
    EmailError,
    ReservationError,
    NotFoundError,
    ConflictError
)

__all__ = [
    'create_app',
    'Config',
    'get_config',
    'Reservation',
    'Newsletter',
    'MenuItem',
    'ContactMessage',
    'RestaurantException',
    'ValidationError',
    'ServiceError',
    'DatabaseError',
    'EmailError',
    'ReservationError',
    'NotFoundError',
    'ConflictError',
]

# Made with Bob
