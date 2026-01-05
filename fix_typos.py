
import re

file_path = "Mühazirə_ERQONOMİKA.md"

replacements = [
    (r"Frqonomik", "Erqonomik"),
    (r"Frqonomiya", "Erqonomiya"),
    (r"antropoloyi", "antropoloji"),
    (r"psixoloyi", "psixoloji"),
    (r"fizioloyi", "fizioloji"),
    (r"bioloyi", "bioloji"),
    (r"texnoloyi", "texnoloji"),
    (r"metodoloyi", "metodoloji"),
    (r"gigenik", "gigienik"),
    (r"nəzə almaqla", "nəzərə almaqla"),
    (r"sosial-psixoloyi", "sosial-psixoloji"),
    # General fix for 'loyi' ending which is usually 'loji' in these contexts
    (r"([a-z])oloyi\b", r"\1oloji"), 
]

try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_len = len(content)
    print(f"Read {original_len} characters.")

    count = 0
    for pattern, replacement in replacements:
        new_content, n = re.subn(pattern, replacement, content)
        if n > 0:
            print(f"Replaced '{pattern}' with '{replacement}': {n} times.")
            content = new_content
            count += n

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Done. Total replacements: {count}")

except Exception as e:
    print(f"Error: {e}")
