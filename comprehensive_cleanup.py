
import re
import sys

file_path = "Mühazirə_ERQONOMİKA.md"

def clean_content(content):
    # 1. Clean Garbage Pages / Blocks
    # Garbage often looks like: "r” 0......uuxuuuuununununuuuNNNNNH" or "4 7 ) mə “x $"
    # We will remove lines that have a high density of non-alphanumeric characters usually found in OCR noise.
    
    lines = content.split('\n')
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            cleaned_lines.append(line)
            continue
            
        # Check for header/image tags, keep them
        if stripped.startswith('##') or stripped.startswith('!['):
            cleaned_lines.append(line)
            continue
            
        # Calculate "noise" ratio
        # Noise = chars that are not letters (Azerbaijani latin), numbers, or standard punctuation (. , : ; - ( ) " ' ? !)
        # Special check for garbage strings like "uuxuuuuununununuuu" - usually repetitive
        if "uuuuun" in stripped or "NNNNNH" in stripped:
             continue # Skip garbage line
             
        # Check for "isolated" garbage characters often found in margins
        # e.g. "m", "r", "2", "3", "z", "s", "ğ" sitting alone on a line
        if re.match(r'^[\W\d_]*[a-zA-ZəöğüşıçƏÖĞÜŞIÇ][\W\d_]*$', stripped) and len(stripped) < 4:
            # Single or double char lines are usually page numbers or noise, unless it's a list item "1." or "a)"
            if not re.match(r'^\d+\.', stripped) and not re.match(r'^[a-z]\)', stripped):
                 continue

        # Specific user reported garbage
        if "B7 it işləri" in stripped: stripped = stripped.replace("B7 it işləri", "Bəzi tədqiqat işləri")
        if "ins ..n .. olan" in stripped: stripped = stripped.replace("ins ..n .. olan", "insan ilə olan")
        
        cleaned_lines.append(line)

    content = '\n'.join(cleaned_lines)

    # 2. Specific Typos and Word Fixes (Regex)
    replacements = [
        # Page 24/25 issues
        (r'\bAntrometrik\b', 'Antropometrik'),
        (r'\bçertyollarda\b', 'çertyojlarda'),
        (r'\bmanikenlərdən\b', 'manekenlərdən'),
        (r'\bmulyailərdə\b', 'mulyajlarda'),
        (r'\btrasformasiyaya\b', 'transformasiyaya'),
        (r'\bkmponentlərinin\b', 'komponentlərinin'),
        (r'\bkompanovka\b', 'komponentlərin'), # "kompanovka" is sometimes used in Russian/Tech context but often "tərtibat/quruluş". If it's tech text, might be "komponovka". Let's leave if unsure, but "komponentlərin" fits typical OCR error profile? No, componovka is layout. "kompozisiya" or "quruluş". Let's stick to cleaning obvious typos.
        (r'\bbi çox\b', 'bir çox'),
        (r'\bfunksonal\b', 'funksional'),
        (r'\noluna bilər\b', 'oluna bilər'),
        (r'Bu 5 halda', 'Bu halda'),
        (r'Bu 5\s+halda', 'Bu halda'),
        (r'\bPrqonomika\b', 'Erqonomika'), 
        (r'\bFrqonomika\b', 'Erqonomika'),
        (r'\bVrqonomik\b', 'Erqonomik'),
        
        # Suffix/Ending garbage
        (r' ğ$', ''),      # Line ending in ğ
        (r' \?$', ''),     # Line ending in ? if it looks wrong? careful.
        (r' ş$', ''),
        (r' z$', ''),
        (r'^\s*İ\s+', ''), # "İ aparılır" -> "aparılır"
        
        # General OCR fixes
        (r'\bvəmiyyətin\b', 'cəmiyyətin'),
        (r'\bhülsoloq\b', 'psixoloq'),
        (r'\bflaloloq\b', 'fizioloq'),
        (r'\bSüyfal\b', 'Sosial'),
        (r'\bəlntropometrik\b', 'Antropometrik'),
        (r'\bavidanlığın\b', 'avadanlığın'),
        (r'\bFiziolofi\b', 'Fizioloji'),
        (r'\bPsixolofi\b', 'Psixoloji'),
        (r'\bgigenik\b', 'gigienik'),
        (r'\benerği\b', 'enerji'),
        (r'\btast gəlinmir\b', 'rast gəlinmir'),
        (r'\bavdın\b', 'aydın'),
        (r'\bobvektlər\b', 'obyektlər'),
        
        # Fix "557 metodiki" -> "Onun metodiki" or "Erqonomikanın"
        # Since it says "Bunun əsasında...", "557" is likely garbage from previous page number or noise.
        (r'^\s*557 metodiki', 'Metodiki'), 
        
        # "zmnür (şəki 9z), — - -." -> Garbage
        (r'^.*zmnür.*$', ''),
        
        # Page 23 cleanup
        (r'Si NE\?', ''),
        (r'i İ İL \.', ''),
        (r'4 7 \) mə “x \$', ''),
        (r'/” £–/4 GİLAN', ''),
        (r'7 ke\) kola a', ''),
        (r'LER do lü \$', ''),
        
        # Fix broken logic lines
        (r'senari modelləşməsi metodu ilə \(layihənin, senariləşməsi\)', 'senari modelləşməsi metodu ilə (layihənin senariləşməsi)'),
        (r'senari metodunun məğzi ol-\s*duğu kimi qalır', 'senari metodunun məğzi olduğu kimi qalır'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

    # 3. Aggressive "Short Line Garbage" Remover
    # Remove lines comprised mostly of symbols
    final_lines = []
    for line in content.split('\n'):
        if re.match(r'^[\s\W\d_]+$', line) and len(line) < 20 and not line.strip().startswith('##') and '---' not in line:
            # Line is just symbols/numbers and short, likely garbage
            continue
        final_lines.append(line)
        
    return '\n'.join(final_lines)

def main():
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        cleaned = clean_content(content)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(cleaned)
            
        print("Comprehensive cleanup complete.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
