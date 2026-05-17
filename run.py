"""
Development server runner
"""

import os
from backend.app import create_app
from backend.config import get_config

if __name__ == "__main__":
    # Get environment from environment variable or default to development
    env = os.environ.get("FLASK_ENV", "development")
    config = get_config(env)

    # Create and run the application
    app = create_app(config)

    # Run with debug mode in development
    debug = env == "development"

    print(f"Starting server in {env} mode...")
    print(f"Debug mode: {debug}")
    print(f"Access the application at: http://localhost:5000")

    app.run(host="0.0.0.0", port=5000, debug=debug)
