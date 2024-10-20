from termcolor import colored


def log(text: str, flag=False) -> None | str:
    colored_text = colored(text, "blue")
    if flag:
        return colored_text
    else:
        print(colored_text)


def success(text: str) -> None:
    colored_text = colored(text, "green")
    print(colored_text)


def warn(text: str) -> None:
    colored_text = colored(text, "yellow")
    print(colored_text)


def error(text: str, error="") -> None:
    colored_text = colored(text, "red")
    print(colored_text + str(error))
