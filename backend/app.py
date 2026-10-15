from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db
from config import Config

from models.user import User
from models.dish import Dish
from models.order import Order
from models.booking import Booking

from routes.auth import auth_bp
from routes.food import food_bp
from routes.orders import orders_bp
from routes.bookings import bookings_bp
from routes.recipes import recipes_bp
from routes.profile import profile_bp
from routes.owner import owner_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(food_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(bookings_bp)
app.register_blueprint(recipes_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(owner_bp)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Saffron & Sage API is running!",
        "status": "success"
    })


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5000)