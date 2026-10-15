from flask import Blueprint, request, jsonify
from extensions import db
from models.booking import Booking
from datetime import date, time

bookings_bp = Blueprint(
    "bookings", __name__, url_prefix="/api/bookings"
)


def booking_to_dict(booking):
    return {
        "id": booking.id,
        "customer_name": booking.customer_name,
        "email": booking.email,
        "booking_date": booking.booking_date,
        "booking_time": booking.booking_time,
        "guests": booking.guests,
        "status": booking.status
    }


@bookings_bp.route("/", methods=["POST"])
def create_booking():
    data = request.get_json(silent=True) or {}

    name = data.get("customer_name", "").strip()
    email = data.get("email", "").strip().lower()
    booking_date = data.get("booking_date", "")
    booking_time = data.get("booking_time", "")
    guests = data.get("guests")

    if not all([name, email, booking_date, booking_time, guests]):
        return jsonify({"error": "All fields are required"}), 400

    try:
        date.fromisoformat(booking_date)
        time.fromisoformat(booking_time)
        guests = int(guests)
        if guests < 1 or guests > 20:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date, time or guest count"}), 400

    if date.fromisoformat(booking_date) < date.today():
        return jsonify({"error": "Booking date cannot be in the past"}), 400

    booking = Booking(
        customer_name=name,
        email=email,
        booking_date=booking_date,
        booking_time=booking_time,
        guests=guests
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Table booking submitted successfully",
        "booking": booking_to_dict(booking)
    }), 201


@bookings_bp.route("/", methods=["GET"])
def get_bookings():
    email = request.args.get("email", "").strip().lower()

    query = Booking.query
    if email:
        query = query.filter_by(email=email)

    bookings = query.order_by(Booking.id.desc()).all()

    return jsonify([booking_to_dict(b) for b in bookings])


@bookings_bp.route("/<int:booking_id>/cancel", methods=["PATCH"])
def cancel_booking(booking_id):
    booking = db.session.get(Booking, booking_id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    if booking.status == "cancelled":
        return jsonify({"error": "Booking already cancelled"}), 400

    booking.status = "cancelled"
    db.session.commit()

    return jsonify({
        "message": "Booking cancelled successfully",
        "booking": booking_to_dict(booking)
    })