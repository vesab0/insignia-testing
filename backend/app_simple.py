"""
Restaurant Website Backend - Simplified Version
A straightforward Flask application for restaurant operations
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import logging
import re
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional

# Simple logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage (replace with database in production)
reservations_db = {}
newsletter_db = set()


@dataclass
class Reservation:
    """Simple reservation data structure"""
    name: str
    email: str
    phone: str
    guests: int
    date: str
    time: str
    message: str = ""
    
    def validate(self) -> tuple[bool, str]:
        """Validate reservation data"""
        # Check required fields
        if not all([self.name, self.email, self.phone, self.guests, self.date, self.time]):
            return False, "All fields are required"
        
        # Validate email
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', self.email):
            return False, "Invalid email format"
        
        # Validate phone
        if not re.match(r'^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$', self.phone):
            return False, "Invalid phone format"
        
        # Validate guests
        if not (1 <= int(self.guests) <= 10):
            return False, "Guests must be between 1 and 10"
        
        # Validate date
        try:
            res_date = datetime.strptime(self.date, '%Y-%m-%d').date()
            if res_date < datetime.now().date():
                return False, "Date cannot be in the past"
            if res_date.weekday() == 0:  # Monday
                return False, "Restaurant is closed on Mondays"
        except ValueError:
            return False, "Invalid date format"
        
        # Validate time
        valid_times = ["17:00", "17:30", "18:00", "18:30", "19:00", 
                      "19:30", "20:00", "20:30", "21:00"]
        if self.time not in valid_times:
            return False, f"Invalid time. Choose from: {', '.join(valid_times)}"
        
        return True, "Valid"


def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__,
                template_folder='../frontend/templates',
                static_folder='../frontend/static')
    
    # Basic configuration
    app.config['SECRET_KEY'] = 'dev-secret-key'
    app.config['JSON_SORT_KEYS'] = False
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Routes
    @app.route('/')
    def index():
        """Render main page"""
        return render_template('index.html')
    
    @app.route('/api/health')
    def health():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat()
        })
    
    @app.route('/api/reservations', methods=['POST'])
    def create_reservation():
        """Create a new reservation"""
        try:
            data = request.get_json()
            
            # Create reservation object
            reservation = Reservation(
                name=data.get('name', ''),
                email=data.get('email', ''),
                phone=data.get('phone', ''),
                guests=data.get('guests', 0),
                date=data.get('date', ''),
                time=data.get('time', ''),
                message=data.get('message', '')
            )
            
            # Validate
            is_valid, message = reservation.validate()
            if not is_valid:
                return jsonify({
                    'success': False,
                    'error': message
                }), 400
            
            # Check for conflicts
            key = f"{reservation.date}_{reservation.time}"
            if key in reservations_db:
                return jsonify({
                    'success': False,
                    'error': 'This time slot is already booked'
                }), 409
            
            # Save reservation
            reservations_db[key] = asdict(reservation)
            
            logger.info(f"Reservation created: {reservation.email}")
            
            return jsonify({
                'success': True,
                'message': 'Reservation confirmed!',
                'reservation': asdict(reservation)
            }), 201
            
        except Exception as e:
            logger.error(f"Error creating reservation: {e}")
            return jsonify({
                'success': False,
                'error': 'Failed to create reservation'
            }), 500
    
    @app.route('/api/newsletter', methods=['POST'])
    def subscribe_newsletter():
        """Subscribe to newsletter"""
        try:
            data = request.get_json()
            email = data.get('email', '').strip().lower()
            
            # Validate email
            if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
                return jsonify({
                    'success': False,
                    'error': 'Invalid email format'
                }), 400
            
            # Check if already subscribed
            if email in newsletter_db:
                return jsonify({
                    'success': True,
                    'message': 'Already subscribed'
                })
            
            # Add to newsletter
            newsletter_db.add(email)
            
            logger.info(f"Newsletter subscription: {email}")
            
            return jsonify({
                'success': True,
                'message': 'Successfully subscribed!'
            }), 201
            
        except Exception as e:
            logger.error(f"Error subscribing to newsletter: {e}")
            return jsonify({
                'success': False,
                'error': 'Failed to subscribe'
            }), 500
    
    @app.route('/api/menu')
    def get_menu():
        """Get menu items"""
        menu = {
            'appetizers': [
                {
                    'name': 'Seared Scallops',
                    'description': 'Pan-seared scallops with cauliflower purée',
                    'price': 24.00,
                    'tags': ['Gluten-free', 'Seafood']
                },
                {
                    'name': 'Foie Gras Terrine',
                    'description': 'Classic French terrine with fig compote',
                    'price': 28.00,
                    'tags': ["Chef's Special"]
                },
                {
                    'name': 'Burrata Caprese',
                    'description': 'Fresh burrata with heirloom tomatoes',
                    'price': 18.00,
                    'tags': ['Vegetarian']
                }
            ],
            'mains': [
                {
                    'name': 'Wagyu Beef Tenderloin',
                    'description': 'Premium wagyu with roasted vegetables',
                    'price': 65.00,
                    'tags': ['Premium', 'Signature']
                },
                {
                    'name': 'Chilean Sea Bass',
                    'description': 'Miso-glazed sea bass with bok choy',
                    'price': 48.00,
                    'tags': ['Seafood', 'Gluten-free']
                },
                {
                    'name': 'Duck Confit',
                    'description': 'Slow-cooked duck leg with potato gratin',
                    'price': 42.00,
                    'tags': ['Traditional']
                }
            ],
            'desserts': [
                {
                    'name': 'Crème Brûlée',
                    'description': 'Classic vanilla custard',
                    'price': 14.00,
                    'tags': ['Classic']
                },
                {
                    'name': 'Chocolate Soufflé',
                    'description': 'Dark chocolate soufflé with vanilla ice cream',
                    'price': 16.00,
                    'tags': ["Chef's Special", 'Popular']
                },
                {
                    'name': 'Lemon Tart',
                    'description': 'Tangy lemon curd in buttery pastry',
                    'price': 12.00,
                    'tags': ['Light']
                }
            ]
        }
        
        return jsonify({
            'success': True,
            'menu': menu
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal error: {error}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

# Made with Bob
