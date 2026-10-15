import re


def validate_email(email):
    if not isinstance(email, str):
        return False

    pattern = r"^[\w.+-]+@[\w-]+\.[\w.-]+$"
    return bool(re.fullmatch(pattern, email.strip()))


def validate_password(password):
    return isinstance(password, str) and len(password) >= 8


def validate_name(name):
    return isinstance(name, str) and bool(name.strip())


def validate_price(price):
    try:
        return float(price) > 0
    except (TypeError, ValueError):
        return False