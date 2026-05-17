"""
Custom exceptions for the restaurant application
"""


class RestaurantException(Exception):
    """Base exception for restaurant application"""
    pass


class ValidationError(RestaurantException):
    """Raised when validation fails"""
    pass


class ServiceError(RestaurantException):
    """Raised when a service operation fails"""
    pass


class DatabaseError(RestaurantException):
    """Raised when database operation fails"""
    pass


class EmailError(RestaurantException):
    """Raised when email sending fails"""
    pass


class ReservationError(RestaurantException):
    """Raised when reservation operation fails"""
    pass


class NotFoundError(RestaurantException):
    """Raised when resource is not found"""
    pass


class ConflictError(RestaurantException):
    """Raised when there's a conflict (e.g., double booking)"""
    pass

# Made with Bob
