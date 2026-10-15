from flask import Blueprint, jsonify
from extensions import db
from models.dish import Dish
from models.order import Order
from models.booking import Booking

owner_bp = Blueprint(
    "owner", __name__, url_prefix="/api/owner"
)


@owner_bp.route("/dashboard", methods=["GET"])
def dashboard():
    total_foods = Dish.query.count()
    total_orders = Order.query.count()
    total_bookings = Booking.query.count()

    revenue = db.session.query(
        db.func.sum(Order.total_amount)
    ).filter(
        Order.status == "delivered"
    ).scalar() or 0

    return jsonify({
        "total_foods": total_foods,
        "total_orders": total_orders,
        "total_bookings": total_bookings,
        "total_revenue": round(float(revenue), 2)
    })


@owner_bp.route("/orders", methods=["GET"])
def owner_orders():
    orders = Order.query.order_by(Order.id.desc()).all()

    return jsonify([
        {
            "id": order.id,
            "customer_email": order.customer_email,
            "items": order.items,
            "total_amount": order.total_amount,
            "status": order.status
        }
        for order in orders
    ])


@owner_bp.route("/bookings", methods=["GET"])
def owner_bookings():
    bookings = Booking.query.order_by(
        Booking.id.desc()
    ).all()

    return jsonify([
        {
            "id": booking.id,
            "customer_name": booking.customer_name,
            "email": booking.email,
            "booking_date": booking.booking_date,
            "booking_time": booking.booking_time,
            "guests": booking.guests,
            "status": booking.status
        }
        for booking in bookings
    ])