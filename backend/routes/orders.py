from flask import Blueprint, request, jsonify
from extensions import db
from models.order import Order

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

ALLOWED_STATUSES = {
    "pending",
    "confirmed",
    "preparing",
    "delivered",
    "cancelled"
}


@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.get_json(silent=True) or {}

    email = data.get("customer_email", "").strip().lower()
    items = data.get("items")
    total = data.get("total_amount")

    if not email or not isinstance(items, list) or not items:
        return jsonify({
            "error": "Email and order items are required"
        }), 400

    try:
        total = float(total)
        if total <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid total amount"}), 400

    order = Order(
        customer_email=email,
        items=items,
        total_amount=total
    )

    db.session.add(order)
    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order.id,
        "status": order.status
    }), 201


@orders_bp.route("/", methods=["GET"])
def get_orders():
    email = request.args.get("email", "").strip().lower()

    query = Order.query

    if email:
        query = query.filter_by(customer_email=email)

    orders = query.order_by(Order.id.desc()).all()

    return jsonify([
        {
            "id": order.id,
            "customer_email": order.customer_email,
            "items": order.items,
            "total_amount": order.total_amount,
            "status": order.status
        }
        for order in orders
    ]), 200


@orders_bp.route("/<int:order_id>/status", methods=["PATCH"])
def update_order_status(order_id):
    order = db.session.get(Order, order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json(silent=True) or {}
    status = data.get("status", "")

    if not isinstance(status, str):
        return jsonify({"error": "Status must be text"}), 400

    status = status.strip().lower()

    if status not in ALLOWED_STATUSES:
        return jsonify({"error": "Invalid order status"}), 400

    order.status = status
    db.session.commit()

    return jsonify({
        "message": "Order status updated successfully",
        "order_id": order.id,
        "status": order.status
    }), 200