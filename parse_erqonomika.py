
import json
import re

def parse_questions():
    input_file = r"c:\Users\KhayalTurkic\Desktop\imtahan-magistr\src\data\erqonomika-bilet.txt"
    output_file = r"c:\Users\KhayalTurkic\Desktop\imtahan-magistr\src\data\erqonomika-suallari.json"

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    questions = []
    # Identify blocks separated by multiple newlines
    # The format seems to vary slightly but generally it's numbered lines.
    # We can split by lines and look for "1.", "2." etc.
    
    lines = content.split('\n')
    current_question = None
    
    count = 1
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if line starts with a number followed by dot
        match = re.match(r'^(\d+)\.\s*(.*)', line)
        if match:
            question_text = match.group(2).strip()
            # Some questions might span multiple lines if they were wrapped, 
            # but looking at the file, they seem to be single lines mostly.
            
            # Extract category or just proceed. 
            # We don't have categories in the text, so we'll leave it generic or inferred?
            # Actually, let's just create the question object.
            
            # Clean up the question text
            if not question_text and len(line) > 3:
                 # Case where there might be no space after dot "2.Question"
                 question_text = line[line.find('.')+1:].strip()

            if question_text:
                questions.append({
                    "id": count,
                    "question": question_text,
                    "answer": "", # No answer provided in text
                    "category": "Erqonomika ümumi" # Placeholder category
                })
                count += 1
        else:
            # Maybe a continuation of previous question?
            if questions:
                questions[-1]["question"] += " " + line

    data = {
        "subject": "Erqonomika və texniki dizayn",
        "totalQuestions": len(questions),
        "questions": questions,
        "categories": ["Erqonomika ümumi"]
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Parsed {len(questions)} questions to {output_file}")

if __name__ == "__main__":
    parse_questions()
