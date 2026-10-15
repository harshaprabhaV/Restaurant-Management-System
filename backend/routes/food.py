from flask import Blueprint, request, jsonify
from extensions import db
from models.dish import Dish

food_bp = Blueprint("food", __name__, url_prefix="/api/food")


def dish_to_dict(dish):
    return {
        "id": dish.id,
        "name": dish.name,
        "description": dish.description,
        "price": dish.price,
        "category": dish.category,
        "image_url": dish.image_url,
        "is_available": dish.is_available
    }


@food_bp.route("/", methods=["GET"])
def get_food():
    dishes = Dish.query.all()
    return jsonify([dish_to_dict(dish) for dish in dishes])


@food_bp.route("/", methods=["POST"])
def add_food():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    category = data.get("category", "").strip()

    try:
        price = float(data.get("price", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid price"}), 400

    if not name or not category or price <= 0:
        return jsonify({"error": "Name, category and positive price are required"}), 400

    dish = Dish(
        name=name,
        description=data.get("description", ""),
        price=price,
        category=category,
        image_url=data.get("image_url", ""),
        is_available=data.get("is_available", True)
    )

    db.session.add(dish)
    db.session.commit()

    return jsonify({
        "message": "Food added successfully",
        "dish": dish_to_dict(dish)
    }), 201


@food_bp.route("/<int:dish_id>", methods=["PUT"])
def update_food(dish_id):
    dish = db.session.get(Dish, dish_id)

    if not dish:
        return jsonify({"error": "Food not found"}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        dish.name = data["name"].strip()

    if "description" in data:
        dish.description = data["description"]

    if "category" in data:
        dish.category = data["category"].strip()

    if "price" in data:
        try:
            price = float(data["price"])
            if price <= 0:
                raise ValueError
            dish.price = price
        except (TypeError, ValueError):
            return jsonify({"error": "Price must be positive"}), 400

    if "image_url" in data:
        dish.image_url = data["image_url"]

    if "is_available" in data:
        dish.is_available = bool(data["is_available"])

    db.session.commit()

    return jsonify({
        "message": "Food updated successfully",
        "dish": dish_to_dict(dish)
    })


@food_bp.route("/<int:dish_id>", methods=["DELETE"])
def delete_food(dish_id):
    dish = db.session.get(Dish, dish_id)

    if not dish:
        return jsonify({"error": "Food not found"}), 404

    db.session.delete(dish)
    db.session.commit()

    return jsonify({"message": "Food deleted successfully"})