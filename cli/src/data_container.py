from utils import remove_accents

local_data = {"products": [], "waiters": []}


def set_products(products):
    processed_products = _process_products(products)
    local_data["products"] = processed_products
    print(local_data["products"])


def set_waiters(waiters):
    processed_waiters = _process_waiters(waiters)
    local_data["waiters"] = processed_waiters
    print(local_data["waiters"])


def _process_waiters(waiters):
    processed_waiters = []
    for waiter in waiters:
        if waiter["active"] == False or waiter["active"] == "false":
            continue

        processed_waiter = {}
        for key, value in waiter.items():
            if key in ["name", "lastName"]:  # Procesar solo las claves deseadas
                processed_waiter[key] = remove_accents(value).lower()
            else:
                processed_waiter[key] = value  # Dejar los demás campos intactos
        processed_waiters.append(processed_waiter)
    return processed_waiters


def _process_products(products):
    processed_products = []
    for product in products:
        if product["showInScreen"] == False or product["showInScreen"] == "false":
            continue

        processed_product = {}
        for key, value in product.items():
            if key in ["name", "description"]:  # Procesar solo las claves deseadas
                processed_product[key] = remove_accents(value).lower()
            else:
                processed_product[key] = value  # Dejar los demás campos intactos
        processed_products.append(processed_product)
    return processed_products
