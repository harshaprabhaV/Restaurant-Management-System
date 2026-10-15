def calculate_order_total(items):
    if not isinstance(items, list) or not items:
        raise ValueError("Order items cannot be empty")

    total = 0

    for item in items:
        if not isinstance(item, dict):
            raise ValueError("Each item must be an object")

        try:
            price = float(item["price"])
            quantity = int(item["quantity"])
        except (KeyError, TypeError, ValueError):
            raise ValueError("Each item needs a valid price and quantity")

        if price <= 0 or quantity <= 0:
            raise ValueError("Price and quantity must be positive")

        total += price * quantity

    return round(total, 2)