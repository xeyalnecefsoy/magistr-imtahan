import json
import os

try:
    with open('temp_part1.json', encoding='utf-8') as f:
        p1 = json.load(f)
    print("Part 1 loaded.")
except Exception as e:
    print(f"Error loading Part 1: {e}")
    p1 = []

try:
    with open('temp_part2.json', encoding='utf-8') as f:
        p2 = json.load(f)
    print("Part 2 loaded.")
except Exception as e:
    print(f"Error loading Part 2: {e}")
    p2 = []

try:
    with open('temp_part3.json', encoding='utf-8') as f:
        p3 = json.load(f)
    print("Part 3 loaded.")
except Exception as e:
    print(f"Error loading Part 3: {e}")
    p3 = []

questions = p1 + p2 + p3
print(f"Total questions: {len(questions)}")

# Create categories
categories = [f"Bilet {i}" for i in range(1, 13)]

final_data = {
    "subject": "Erqonomika və texniki dizayn",
    "totalQuestions": len(questions),
    "questions": questions,
    "categories": categories
}

output_path = 'src/data/erqonomika-suallari.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)

print(f"File created successfully at {output_path}")

# Cleanup
try:
    if os.path.exists('temp_part1.json'): os.remove('temp_part1.json')
    if os.path.exists('temp_part2.json'): os.remove('temp_part2.json')
    if os.path.exists('temp_part3.json'): os.remove('temp_part3.json')
    if os.path.exists(output_path):
        print("Cleanup successful.")
except Exception as e:
    print(f"Error cleaning up: {e}")
