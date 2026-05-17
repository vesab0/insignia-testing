"""
Restaurant Management System - Main Application
Flask backend for La Maison Élégante restaurant website
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import logging

from .config import Config
from .models import Reservation, Newsletter
from .validators import ReservationValidator, EmailValidator
from .services import ReservationService, EmailService
from .exceptions import ValidationError, ServiceError

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def create_app(config_class=Config) -> Flask:  # noqa: C901
    """Application factory pattern"""
    app = Flask(
        __name__,
        template_folder="../frontend/templates",
        static_folder="../frontend/static",
    )
    app.config.from_object(config_class)

    # Enable CORS for API endpoints
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize services
    reservation_service = ReservationService()
    email_service = EmailService(app.config)

    # Error handlers
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        """Handle validation errors"""
        logger.warning(f"Validation error: {error}")
        return (
            jsonify(
                {"success": False, "error": str(error), "type": "validation_error"}
            ),
            400,
        )

    @app.errorhandler(ServiceError)
    def handle_service_error(error):
        """Handle service errors"""
        logger.error(f"Service error: {error}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "An error occurred processing your request",
                    "type": "service_error",
                }
            ),
            500,
        )

    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({"success": False, "error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        logger.error(f"Internal error: {error}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

    # Routes
    @app.route("/")
    def index():
        """Render main page"""
        try:
            return render_template("index.html")
        except Exception as e:
            logger.error(f"Error rendering index: {e}")
            return "Error loading page", 500

    @app.route("/api/health")
    def health_check():
        """Health check endpoint"""
        return jsonify(
            {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
        )

    @app.route("/api/reservations", methods=["POST"])
    def create_reservation():
        """Create a new reservation"""
        try:
            data = request.get_json()

            if not data:
                raise ValidationError("No data provided")

            # Validate reservation data
            validator = ReservationValidator(data)
            if not validator.is_valid():
                raise ValidationError(validator.get_errors())

            # Create reservation object
            reservation = Reservation(
                name=data["name"],
                email=data["email"],
                phone=data["phone"],
                guests=int(data["guests"]),
                date=data["date"],
                time=data["time"],
                message=data.get("message", ""),
            )

            # Process reservation
            result = reservation_service.create_reservation(reservation)

            # Send confirmation email
            try:
                email_service.send_reservation_confirmation(reservation)
            except Exception as e:
                logger.error(f"Failed to send confirmation email: {e}")
                # Don't fail the reservation if email fails

            logger.info(f"Reservation created: {reservation.email}")

            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Reservation confirmed! Check your email for details.",
                        "reservation_id": result["id"],
                    }
                ),
                201,
            )

        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error creating reservation: {e}")
            raise ServiceError("Failed to create reservation")

    @app.route("/api/newsletter", methods=["POST"])
    def subscribe_newsletter():
        """Subscribe to newsletter"""
        try:
            data = request.get_json()

            if not data or "email" not in data:
                raise ValidationError("Email is required")

            # Validate email
            validator = EmailValidator(data["email"])
            if not validator.is_valid():
                raise ValidationError("Invalid email address")

            # Create newsletter subscription
            newsletter = Newsletter(email=data["email"])

            # Process subscription
            email_service.subscribe_newsletter(newsletter)

            logger.info(f"Newsletter subscription: {newsletter.email}")

            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Successfully subscribed to newsletter!",
                    }
                ),
                201,
            )

        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error subscribing to newsletter: {e}")
            raise ServiceError("Failed to subscribe to newsletter")

    @app.route("/api/menu")
    def get_menu():
        """Get menu items"""
        try:
            # In production, this would fetch from database
            menu_items = {
                "appetizers": [
                    {
                        "id": 1,
                        "name": "Seared Scallops",
                        "description": (
                            "Pan-seared scallops with cauliflower puree and truffle oil"
                        ),
                        "price": 24.00,
                        "tags": ["Gluten-free", "Seafood"],
                        "popular": True,
                    },
                    {
                        "id": 2,
                        "name": "Foie Gras Terrine",
                        "description": "Classic French terrine with fig compote and brioche",
                        "price": 28.00,
                        "tags": ["Chef's Special"],
                    },
                    {
                        "id": 3,
                        "name": "Burrata Caprese",
                        "description": "Fresh burrata with heirloom tomatoes and basil pesto",
                        "price": 18.00,
                        "tags": ["Vegetarian"],
                    },
                ],
                "mains": [
                    {
                        "id": 4,
                        "name": "Wagyu Beef Tenderloin",
                        "description": (
                            "Premium wagyu with roasted vegetables and red wine reduction"
                        ),
                        "price": 65.00,
                        "tags": ["Premium"],
                        "signature": True,
                    },
                    {
                        "id": 5,
                        "name": "Chilean Sea Bass",
                        "description": "Miso-glazed sea bass with bok choy and jasmine rice",
                        "price": 48.00,
                        "tags": ["Seafood", "Gluten-free"],
                    },
                    {
                        "id": 6,
                        "name": "Duck Confit",
                        "description": (
                            "Slow-cooked duck leg with potato gratin and cherry gastrique"
                        ),
                        "price": 42.00,
                        "tags": ["Traditional"],
                    },
                ],
                "desserts": [
                    {
                        "id": 7,
                        "name": "Creme Brulee",
                        "description": "Classic vanilla custard with caramelized sugar crust",
                        "price": 14.00,
                        "tags": ["Classic"],
                    },
                    {
                        "id": 8,
                        "name": "Chocolate Souffle",
                        "description": "Dark chocolate souffle with vanilla ice cream",
                        "price": 16.00,
                        "tags": ["Chef's Special"],
                        "popular": True,
                    },
                    {
                        "id": 9,
                        "name": "Lemon Tart",
                        "description": "Tangy lemon curd in buttery pastry with meringue",
                        "price": 12.00,
                        "tags": ["Light"],
                    },
                ],
            }

            return jsonify({"success": True, "menu": menu_items})

        except Exception as e:
            logger.error(f"Error fetching menu: {e}")
            raise ServiceError("Failed to fetch menu")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
