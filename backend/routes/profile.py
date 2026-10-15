from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


@profile_bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }), 200


@profile_bp.route("/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    name = data.get("name")

    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "Valid name is required"}), 400

    user.name = name.strip()
    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "id": user.id,
        "name": user.name,
        "email": user.email
    }), 200