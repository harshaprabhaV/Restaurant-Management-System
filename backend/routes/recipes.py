from flask import Blueprint, request, jsonify

recipes_bp = Blueprint("recipes", __name__, url_prefix="/api/recipes")

recipes = [
    {
        "id": 1,
        "name": "Chicken Biryani",
        "category": "Main Course",
        "ingredients": ["Chicken", "Rice", "Onion", "Spices"],
        "instructions": "Cook the chicken with spices, add rice, and cook until done.",
        "prep_time": 20,
        "cook_time": 40
    },
    {
        "id": 2,
        "name": "Paneer Butter Masala",
        "category": "Main Course",
        "ingredients": ["Paneer", "Tomato", "Butter", "Cream", "Spices"],
        "instructions": "Prepare tomato gravy, add paneer, butter, and cream.",
        "prep_time": 15,
        "cook_time": 25
    }
]


@recipes_bp.route("/", methods=["GET"])
def get_recipes():
    return jsonify(recipes), 200


@recipes_bp.route("/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    recipe = next(
        (r for r in recipes if r["id"] == recipe_id),
        None
    )

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    return jsonify(recipe), 200


@recipes_bp.route("/", methods=["POST"])
def add_recipe():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    category = data.get("category")
    ingredients = data.get("ingredients")
    instructions = data.get("instructions")

    if not all([name, category, ingredients, instructions]):
        return jsonify({"error": "All recipe fields are required"}), 400

    if not isinstance(ingredients, list):
        return jsonify({"error": "Ingredients must be a list"}), 400

    new_recipe = {
        "id": max((r["id"] for r in recipes), default=0) + 1,
        "name": name.strip(),
        "category": category.strip(),
        "ingredients": ingredients,
        "instructions": instructions.strip(),
        "prep_time": data.get("prep_time", 0),
        "cook_time": data.get("cook_time", 0)
    }

    recipes.append(new_recipe)

    return jsonify({
        "message": "Recipe added successfully",
        "recipe": new_recipe
    }), 201