
import json
import re
from collections import Counter

# Load content
with open('Mühazirə_ERQONOMİKA.md', 'r', encoding='utf-8') as f:
    markdown_text = f.read()

with open('src/data/erqonomika-suallari.json', 'r', encoding='utf-8') as f:
    questions_data = json.load(f)

# Split markdown into paragraphs or chunks
chunks = markdown_text.split('\n\n')
# Filter small chunks
chunks = [c for c in chunks if len(c) > 50]

def get_best_match(question, chunks):
    # Simple word overlap
    q_words = set(re.findall(r'\w+', question.lower()))
    best_chunk = ""
    best_score = 0
    
    for chunk in chunks:
        c_words = set(re.findall(r'\w+', chunk.lower()))
        # Intersection
        common = q_words.intersection(c_words)
        score = len(common)
        if score > best_score:
            best_score = score
            best_chunk = chunk
            
    return best_chunk

output = []
for q in questions_data['questions']:
    match = get_best_match(q['question'], chunks)
    output.append({
        "id": q['id'],
        "question": q['question'],
        "context": match[:500] + "..." if len(match) > 500 else match
    })

with open('question_contexts.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Contexts extracted.")
