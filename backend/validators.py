"""
Validation logic for the restaurant application
"""

import re
from datetime import datetime, timedelta
from typing import Dict, List


class ValidationError(Exception):
    """Custom validation error"""

    pass


class BaseValidator:
    """Base validator class"""

    def __init__(self, data: any):
        self.data = data
        self.errors: List[str] = []

    def is_valid(self) -> bool:
        """Check if data is valid"""
        raise NotImplementedError

    def get_errors(self) -> str:
        """Get validation errors as string"""
        return "; ".join(self.errors)

    def add_error(self, error: str):
        """Add validation error"""
        self.errors.append(error)


class EmailValidator(BaseValidator):
    """Email validation"""

    EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

    def is_valid(self) -> bool:
        """Validate email format"""
        if not self.data:
            self.add_error("Email is required")
            return False

        if not isinstance(self.data, str):
            self.add_error("Email must be a string")
            return False

        email = self.data.strip().lower()

        if len(email) > 254:
            self.add_error("Email is too long")
            return False

        if not self.EMAIL_REGEX.match(email):
            self.add_error("Invalid email format")
            return False

        return True


class PhoneValidator(BaseValidator):
    """Phone number validation"""

    PHONE_REGEX = re.compile(
        r"^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$"
    )

    def is_valid(self) -> bool:
        """Validate phone number format"""
        if not self.data:
            self.add_error("Phone number is required")
            return False

        if not isinstance(self.data, str):
            self.add_error("Phone number must be a string")
            return False

        phone = self.data.strip()

        if not self.PHONE_REGEX.match(phone):
            self.add_error("Invalid phone number format. Use format: +1 (555) 123-4567")
            return False

        return True


class DateValidator(BaseValidator):
    """Date validation"""

    def __init__(
        self, data: str, min_advance_hours: int = 2, max_advance_days: int = 90
    ):
        super().__init__(data)
        self.min_advance_hours = min_advance_hours
        self.max_advance_days = max_advance_days

    def is_valid(self) -> bool:
        """Validate reservation date"""
        if not self.data:
            self.add_error("Date is required")
            return False

        try:
            # Parse date (format: YYYY-MM-DD)
            reservation_date = datetime.strptime(self.data, "%Y-%m-%d").date()
            today = datetime.now().date()

            # Check if date is in the past
            if reservation_date < today:
                self.add_error("Reservation date cannot be in the past")
                return False

            # Check minimum advance booking
            min_date = (datetime.now() + timedelta(hours=self.min_advance_hours)).date()
            if reservation_date < min_date:
                self.add_error(
                    f"Reservations must be made at least {self.min_advance_hours} hours in advance"
                )
                return False

            # Check maximum advance booking
            max_date = today + timedelta(days=self.max_advance_days)
            if reservation_date > max_date:
                self.add_error(
                    f"Reservations can only be made up to {self.max_advance_days} days in advance"
                )
                return False

            # Check if restaurant is closed on this day (Monday = 0)
            if reservation_date.weekday() == 0:  # Monday
                self.add_error("Restaurant is closed on Mondays")
                return False

            return True

        except ValueError:
            self.add_error("Invalid date format. Use YYYY-MM-DD")
            return False


class TimeValidator(BaseValidator):
    """Time validation"""

    VALID_TIMES = [
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
    ]

    def is_valid(self) -> bool:
        """Validate reservation time"""
        if not self.data:
            self.add_error("Time is required")
            return False

        if self.data not in self.VALID_TIMES:
            self.add_error(
                f"Invalid time. Available times: {', '.join(self.VALID_TIMES)}"
            )
            return False

        return True


class GuestsValidator(BaseValidator):
    """Guest count validation"""

    def __init__(self, data: any, max_guests: int = 10):
        super().__init__(data)
        self.max_guests = max_guests

    def is_valid(self) -> bool:
        """Validate number of guests"""
        if not self.data:
            self.add_error("Number of guests is required")
            return False

        try:
            guests = int(self.data)

            if guests < 1:
                self.add_error("At least 1 guest is required")
                return False

            if guests > self.max_guests:
                self.add_error(
                    f"Maximum {self.max_guests} guests per reservation. "
                    "Please contact us for larger parties."
                )
                return False

            return True

        except (ValueError, TypeError):
            self.add_error("Number of guests must be a valid number")
            return False


class ReservationValidator(BaseValidator):
    """Complete reservation validation"""

    def __init__(self, data: Dict):
        super().__init__(data)
        self.required_fields = ["name", "email", "phone", "guests", "date", "time"]

    def is_valid(self) -> bool:  # noqa: C901
        """Validate all reservation fields"""
        # Check required fields
        for field in self.required_fields:
            if field not in self.data or not self.data[field]:
                self.add_error(f"{field.capitalize()} is required")

        if self.errors:
            return False

        # Validate name
        name = self.data["name"].strip()
        if len(name) < 2:
            self.add_error("Name must be at least 2 characters")
        if len(name) > 100:
            self.add_error("Name is too long")

        # Validate email
        email_validator = EmailValidator(self.data["email"])
        if not email_validator.is_valid():
            self.errors.extend(email_validator.errors)

        # Validate phone
        phone_validator = PhoneValidator(self.data["phone"])
        if not phone_validator.is_valid():
            self.errors.extend(phone_validator.errors)

        # Validate guests
        guests_validator = GuestsValidator(self.data["guests"])
        if not guests_validator.is_valid():
            self.errors.extend(guests_validator.errors)

        # Validate date
        date_validator = DateValidator(self.data["date"])
        if not date_validator.is_valid():
            self.errors.extend(date_validator.errors)

        # Validate time
        time_validator = TimeValidator(self.data["time"])
        if not time_validator.is_valid():
            self.errors.extend(time_validator.errors)

        # Validate optional message
        if "message" in self.data and self.data["message"]:
            message = self.data["message"].strip()
            if len(message) > 500:
                self.add_error("Message is too long (max 500 characters)")

        return len(self.errors) == 0
