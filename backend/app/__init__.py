from flask import Flask
from app.routes.tax_routes import tax_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(tax_bp)
    return app