from difflib import SequenceMatcher
import unicodedata


def similarity(data: str, to_compare: str):
    return SequenceMatcher(None, data, to_compare).ratio()


def remove_accents(input_str):
    if not isinstance(input_str, str):
        return input_str
    # Descomponer caracteres acentuados
    nfkd_form = unicodedata.normalize("NFKD", input_str)
    # Filtrar solo caracteres ASCII (eliminando los diacríticos)
    return "".join([c for c in nfkd_form if unicodedata.category(c) != "Mn"])


def is_valid_waiter(name, data, threshold: float = 0.8):

    for waiter in data:
        sim_score = similarity(name.lower(), waiter["name"].lower())
        if sim_score >= threshold:
            return (True, waiter)
    return (False, None)


def is_valid_product(name, data, threshold: float = 0.8):
    for product in data:
        sim_score = similarity(name.lower(), product["name"].lower())
        if sim_score >= threshold:
            print(product)
            return (True, product)
    return (False, None)
