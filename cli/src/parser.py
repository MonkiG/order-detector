import re
import console
import unicodedata

count_dictionary = {
    "un": "1",
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
    print(type, text_parsed)

    if type == "mesero":
        waiter = text_parsed.split(" ")[-1]
        if waiter != "":
            return {"type": "waiter", "data": waiter.replace(".", "")}
        else:
            raise ValueError(
                f"No se pudo extraer el nombre del mesero del texto: '{text}'"
            )
    elif type == "orden":
        table_regex = r"(T|t)\s*(\d)"
        products_regex = r"(productos|productos,)"

        console.log("Retrieving table and products")

        table = re.split(table_regex, text_parsed)[2]
        products = re.split(products_regex, text_parsed)[-1].strip()

        if table:
            # TODO: Devolver el json
            # products = parse_products(products)
            # serialized = {"table": table, "products": products}
            print("Order serializer", table, products)
            console.success("Order serialized correctly")
            return {"type": "order", "data": "serialized"}
        else:
            console.error("Error retrieving data")

        print("Order parser")
    else:
        console.error("Unrecognized type")


def parse_products(products):
    products_splited = list(
        filter(
            lambda x: x != "" and x != "y" and x != " ",
            re.split(
                r"(un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)", products
            ),
        )
    )

    products_list = []


def _remove_accents(input_str):
    # Descomponer caracteres acentuados
    nfkd_form = unicodedata.normalize("NFKD", input_str)
    # Filtrar solo caracteres ASCII (eliminando los diacríticos)
    return "".join([c for c in nfkd_form if unicodedata.category(c) != "Mn"])
