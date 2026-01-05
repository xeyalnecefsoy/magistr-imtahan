
import re

file_path = "Mühazirə_ERQONOMİKA.md"

def clean_garbage():
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by pages
    # We look for "## Səhifə X (hdphotoX.png)"
    # We can regex replace specific page bodies.

    # Pattern for Page 3
    # Matches: ## Səhifə 3 ... \n\n![...]\n\n(CAPTURE CONTENT)\n\n---
    # We utilize that the separator is `---`
    
    pages_to_clean = [3, 18, 19, 20]
    
    for page_num in pages_to_clean:
        pattern = re.compile(rf"(## Səhifə {page_num} \(hdphoto{page_num}\.png\)\s+\n!\[.+?\]\(.+?\)\s+)([\s\S]+?)(\n---)", re.MULTILINE)
        
        def replacer(match):
            header_and_image = match.group(1)
            footer = match.group(3)
            return f"{header_and_image}\n***(Bu səhifədə oxunaqlı mətn yoxdur, yalnız sxem və ya diaqram ola bilər)***\n{footer}"
        
        content = pattern.sub(replacer, content)
        print(f"Cleaned Page {page_num}")

    # Fix Page 17 garbage lines
    # Look for the specific garbage string
    garbage_17_pattern = r"(## Səhifə 17 \(hdphoto17\.png\)\s+\n!\[.+?\]\(.+?\)\s+)(R ununnunuxunuunununuununununuuuu\s+H\s+)(iri obyekt)"
    
    match_17 = re.search(garbage_17_pattern, content)
    if match_17:
        print("Found garbage on Page 17, removing...")
        # We want to keep Group 1 and Group 3, discarding Group 2
        content = re.sub(garbage_17_pattern, r"\1\3", content)
    else:
        # Fallback if exact match fails, try looser match
        print("Exact match for Page 17 failed, trying looser match")
        pattern_17_loose = re.compile(r"(## Səhifə 17 \(hdphoto17\.png\)\s+\n!\[.+?\]\(.+?\)\s+)([\s\S]+?)(iri obyekt)", re.MULTILINE)
        def replacer_17(m):
            return f"{m.group(1)}{m.group(3)}" # simply drop the middle garbage
        # Check if the middle garbage is actually garbage
        m = pattern_17_loose.search(content)
        if m and "ununnunuxunu" in m.group(2):
             content = pattern_17_loose.sub(replacer_17, content)
             print("Cleaned Page 17 (loose match)")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Done cleaning garbage.")

if __name__ == "__main__":
    clean_garbage()
