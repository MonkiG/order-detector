import re
from data_container import local_data
from utils import remove_accents, is_valid_waiter, is_valid_product

count_dictionary = {
    "un": "1",
    "una": "1",
    "dos": "2",
    "tres": "3",
    "cuatro": "4",
    "cinco": "5",
    "seis": "6",
    "siete": "7",
    "ocho": "8",
    "nueve": "9",
    "diez": "10",
}


def parse_text_to_json(text: str, type: str):
    text_parsed = remove_accents(text.lower().strip())
    if type == "mesero":
        waiter = text_parsed.split(" ")[-1]
        valid_waiter, waiter_data = is_valid_waiter(waiter, local_data["waiters"])
        if waiter != "" and valid_waiter:
            return {
                "type": "waiter",
                "data": {"name": waiter_data["name"], "id": waiter_data["id"]},
            }
        else:
            raise ValueError(
                f"No se pudo extraer el nombre del mesero del texto: '{text}'"
            )
    elif type == "orden":
        # TODO: Manejar errores

        table_regex = r"(T|t|de|De)\s*(\d)"
        products_regex = r"(productos|productos,)"

        table = re.split(table_regex, text_parsed)[2]
        products = re.split(products_regex, text_parsed)[-1]

        notes = None
        if "nota" in products or "notas" in products:
            text_splited = re.split(r"(nota|notas)", products)
            products = text_splited[0]
            notes = text_splited[-1]

        if table and products:
            products_parsed = parse_products(products)
            dict = {
                "type": "order",
                "data": {"table": table, "products": products_parsed, "notes": notes},
            }
            return dict
        else:
            print("Error")


# TODO: serializar con lo que esta en la base de datos
# * Hacer prueba de similitud
def parse_products(products):
    # Expresión regular que captura la cantidad (en número o palabra) y el nombre del producto
    pattern = (
        r"\b(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+([\w\s\-]+)"
    )

    # Encontrar todas las coincidencias de cantidad y productos
    matches = re.findall(pattern, products)
    # Crear una lista de diccionarios con las claves 'amount' y 'name'
    result = []

    for match in matches:
        amount = count_dictionary.get(
            match[0], match[0]
        )  # Convertir cantidad a número si aplica
        name = match[1].strip()  # Limpiar el nombre del producto
        is_valid, product = is_valid_product(name, local_data["products"])
        if is_valid:
            result.append({"amount": int(amount), "id": product["id"]})
        else:
            print(f"Producto no válido: {name}")
    return result
