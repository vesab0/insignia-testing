"""
Data models for the restaurant application
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class Reservation:
    """Reservation model"""

    name: str
    email: str
    phone: str
    guests: int
    date: str
    time: str
    message: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    status: str = "pending"  # pending, confirmed, cancelled

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "guests": self.guests,
            "date": self.date,
            "time": self.time,
            "message": self.message,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self) -> str:
        return f"<Reservation {self.id}: {self.name} - {self.date} {self.time}>"


@dataclass
class Newsletter:
    """Newsletter subscription model"""

    email: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    subscribed_at: datetime = field(default_factory=datetime.utcnow)
    active: bool = True

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "email": self.email,
            "subscribed_at": self.subscribed_at.isoformat(),
            "active": self.active,
        }

    def __repr__(self) -> str:
        return f"<Newsletter {self.id}: {self.email}>"


@dataclass
class MenuItem:
    """Menu item model"""

    name: str
    description: str
    price: float
    category: str  # appetizers, mains, desserts
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    tags: list = field(default_factory=list)
    available: bool = True
    image_url: Optional[str] = None
    popular: bool = False
    signature: bool = False

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "tags": self.tags,
            "available": self.available,
            "image_url": self.image_url,
            "popular": self.popular,
            "signature": self.signature,
        }

    def __repr__(self) -> str:
        return f"<MenuItem {self.id}: {self.name} - ${self.price}>"


@dataclass
class ContactMessage:
    """Contact form message model"""

    name: str
    email: str
    subject: str
    message: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    read: bool = False

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.created_at.isoformat(),
            "read": self.read,
        }

    def __repr__(self) -> str:
        return f"<ContactMessage {self.id}: {self.name} - {self.subject}>"
