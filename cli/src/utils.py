from difflib import SequenceMatcher


def similarity(data: str, to_compare: str):
    return SequenceMatcher(None, data, to_compare).ratio()
