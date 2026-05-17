"""
Business logic services for the restaurant application
"""

import logging
from typing import Dict, List, Optional
from datetime import datetime

from .models import Reservation, Newsletter
from .exceptions import ServiceError, EmailError, ConflictError

logger = logging.getLogger(__name__)


class ReservationService:
    """Service for handling reservations"""
    
    def __init__(self):
        # In production, this would use a database
        self.reservations: Dict[str, Reservation] = {}
    
    def create_reservation(self, reservation: Reservation) -> Dict:
        """Create a new reservation"""
        try:
            # Check for conflicts (same date/time)
            if self._has_conflict(reservation):
                raise ConflictError(
                    "This time slot is already booked. Please choose another time."
                )
            
            # Store reservation
            self.reservations[reservation.id] = reservation
            
            logger.info(f"Reservation created: {reservation.id}")
            
            return {
                'id': reservation.id,
                'status': 'confirmed',
                'reservation': reservation.to_dict()
            }
            
        except ConflictError:
            raise
        except Exception as e:
            logger.error(f"Error creating reservation: {e}")
            raise ServiceError(f"Failed to create reservation: {str(e)}")
    
    def get_reservation(self, reservation_id: str) -> Optional[Reservation]:
        """Get reservation by ID"""
        return self.reservations.get(reservation_id)
    
    def cancel_reservation(self, reservation_id: str) -> bool:
        """Cancel a reservation"""
        try:
            reservation = self.reservations.get(reservation_id)
            if not reservation:
                return False
            
            reservation.status = 'cancelled'
            logger.info(f"Reservation cancelled: {reservation_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error cancelling reservation: {e}")
            raise ServiceError(f"Failed to cancel reservation: {str(e)}")
    
    def get_reservations_by_date(self, date: str) -> List[Reservation]:
        """Get all reservations for a specific date"""
        return [
            r for r in self.reservations.values()
            if r.date == date and r.status != 'cancelled'
        ]
    
    def _has_conflict(self, reservation: Reservation) -> bool:
        """Check if reservation conflicts with existing ones"""
        existing = self.get_reservations_by_date(reservation.date)
        
        for existing_res in existing:
            if existing_res.time == reservation.time:
                # In production, would check table availability
                # For now, simple time slot check
                return True
        
        return False


class EmailService:
    """Service for handling email operations"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.newsletter_subscribers: Dict[str, Newsletter] = {}
    
    def send_reservation_confirmation(self, reservation: Reservation) -> bool:
        """Send reservation confirmation email"""
        try:
            # In production, this would use Flask-Mail or similar
            logger.info(f"Sending confirmation email to {reservation.email}")
            
            # Simulate email sending
            email_content = self._generate_confirmation_email(reservation)
            
            # In production: send actual email
            # mail.send(Message(...))
            
            logger.info(f"Confirmation email sent to {reservation.email}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending confirmation email: {e}")
            raise EmailError(f"Failed to send confirmation email: {str(e)}")
    
    def subscribe_newsletter(self, newsletter: Newsletter) -> Dict:
        """Subscribe email to newsletter"""
        try:
            # Check if already subscribed
            existing = self._find_subscriber(newsletter.email)
            if existing:
                if existing.active:
                    return {
                        'status': 'already_subscribed',
                        'message': 'This email is already subscribed'
                    }
                else:
                    # Reactivate subscription
                    existing.active = True
                    existing.subscribed_at = datetime.utcnow()
                    logger.info(f"Newsletter subscription reactivated: {newsletter.email}")
                    return {
                        'status': 'reactivated',
                        'message': 'Subscription reactivated'
                    }
            
            # Add new subscriber
            self.newsletter_subscribers[newsletter.id] = newsletter
            
            # Send welcome email
            self._send_welcome_email(newsletter)
            
            logger.info(f"New newsletter subscription: {newsletter.email}")
            
            return {
                'status': 'subscribed',
                'message': 'Successfully subscribed to newsletter'
            }
            
        except Exception as e:
            logger.error(f"Error subscribing to newsletter: {e}")
            raise ServiceError(f"Failed to subscribe to newsletter: {str(e)}")
    
    def unsubscribe_newsletter(self, email: str) -> bool:
        """Unsubscribe from newsletter"""
        try:
            subscriber = self._find_subscriber(email)
            if subscriber:
                subscriber.active = False
                logger.info(f"Newsletter unsubscribed: {email}")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error unsubscribing from newsletter: {e}")
            raise ServiceError(f"Failed to unsubscribe: {str(e)}")
    
    def _find_subscriber(self, email: str) -> Optional[Newsletter]:
        """Find subscriber by email"""
        for subscriber in self.newsletter_subscribers.values():
            if subscriber.email.lower() == email.lower():
                return subscriber
        return None
    
    def _generate_confirmation_email(self, reservation: Reservation) -> str:
        """Generate confirmation email content"""
        return f"""
        Dear {reservation.name},
        
        Your reservation has been confirmed!
        
        Details:
        - Date: {reservation.date}
        - Time: {reservation.time}
        - Guests: {reservation.guests}
        - Reservation ID: {reservation.id}
        
        We look forward to serving you at La Maison Élégante.
        
        If you need to modify or cancel your reservation, please contact us at:
        Phone: {self.config.get('RESTAURANT_PHONE')}
        Email: {self.config.get('RESTAURANT_EMAIL')}
        
        Best regards,
        La Maison Élégante Team
        """
    
    def _send_welcome_email(self, newsletter: Newsletter):
        """Send welcome email to new subscriber"""
        try:
            logger.info(f"Sending welcome email to {newsletter.email}")
            # In production: send actual email
            return True
        except Exception as e:
            logger.error(f"Error sending welcome email: {e}")
            # Don't fail subscription if welcome email fails
            return False


class MenuService:
    """Service for handling menu operations"""
    
    def __init__(self):
        # In production, this would fetch from database
        self.menu_items = []
    
    def get_menu(self, category: Optional[str] = None) -> List[Dict]:
        """Get menu items, optionally filtered by category"""
        try:
            if category:
                return [item for item in self.menu_items if item['category'] == category]
            return self.menu_items
            
        except Exception as e:
            logger.error(f"Error fetching menu: {e}")
            raise ServiceError(f"Failed to fetch menu: {str(e)}")
    
    def get_menu_item(self, item_id: str) -> Optional[Dict]:
        """Get specific menu item"""
        try:
            for item in self.menu_items:
                if item['id'] == item_id:
                    return item
            return None
            
        except Exception as e:
            logger.error(f"Error fetching menu item: {e}")
            raise ServiceError(f"Failed to fetch menu item: {str(e)}")

# Made with Bob
