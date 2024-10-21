import re
import console
import unicodedata

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
    text_parsed = _remove_accents(text.lower().strip())
    print(text_parsed, type)

    if type == "mesero":
        waiter = text_parsed.split(" ")[-1]
        if waiter != "":
            return {"type": "waiter", "data": waiter.replace(".", "")}
        else:
            raise ValueError(
                f"No se pudo extraer el nombre del mesero del texto: '{text}'"
            )
    elif type == "orden":
        # TODO: Manejar errores

        table_regex = r"(T|t|de|De)\s*(\d)"
        products_regex = r"(productos|productos,)"
        notes_regex = r"(?:nota|notas)[,:\s]+([\w\s\-]+)"

        table = re.split(table_regex, text_parsed)[2]
        products = re.split(products_regex, text_parsed)[
            -1
        ].strip()  # Todo las notas se pegan a los productos

        notes_match = re.search(notes_regex, text)
        notes = notes_match.group(1).strip() if notes_match else None
        print(table, products, notes)
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
    console.warn("Here parse")
    # Expresión regular que captura la cantidad (en número o palabra) y el nombre del producto
    pattern = (
        r"\b(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+([\w\s\-]+)"
    )

    console.warn("Here warn")
    # Encontrar todas las coincidencias de cantidad y productos
    matches = re.findall(pattern, products)
    console.warn("Here after fin")
    print(matches)
    # Crear una lista de diccionarios con las claves 'amount' y 'name'
    result = [
        {"amount": count_dictionary.get(match[0], match[0]), "name": match[1].strip()}
        for match in matches
    ]

    return result


def _remove_accents(input_str):
    # Descomponer caracteres acentuados
    nfkd_form = unicodedata.normalize("NFKD", input_str)
    # Filtrar solo caracteres ASCII (eliminando los diacríticos)
    return "".join([c for c in nfkd_form if unicodedata.category(c) != "Mn"])
