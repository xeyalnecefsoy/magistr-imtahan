# Magistr İmtahan Hazırlığı (Magistr Exam Prep)

Magistratura imtahanlarına (xüsusilə Azərbaycan Dövlət Rəssamlıq Akademiyası və digər texniki/yaradıcı ixtisaslar üzrə) hazırlaşmaq üçün hazırlanmış müasir, yüksək sürətli və qaranlıq rejimli (dark-themed) veb tətbiqi.

Bu layihə **Next.js 15**, **Tailwind CSS** və **Shadcn UI** texnologiyaları əsasında qurulub.

## 📚 Mövcud Fənlər

Tətbiq aşağıdakı fənlər üzrə imtahan suallarını və hazırlıq materiallarını əhatə edir:
- **Akademik yazı və etika** (Test/MCQ rejimi)
- **Erqonomika və texniki dizayn** (Yazılı/Flashcard rejimi)
- **Sənaye dizaynında fəaliyyət sahələri** (Yazılı/Flashcard rejimi)
- **Mühəndis yaradıcılıq prinsipləri**
- **Sənaye dizaynında kompüter layihələndirilməsi**

## 🚀 Əsas Xüsusiyyətlər

- **İnteraktiv İmtahan Cədvəli**: Əsas səhifədəki cədvəldən imtahan kartına klikləyərək birbaşa müvafiq hazırlıq rejiminə keçid.
- **Blitz Rejimi (Test)**: Sualları 60 saniyəlik zaman çərçivəsində cavablandırın. Sürət və dəqiqliyə görə xallar hesablanır. (Test imtahanları üçün idealdır).
- **Flashcard Rejimi (Yazılı)**: Kartları çevirərək biliklərinizi yoxlayın. Yazılı imtahanlara hazırlıq üçün nəzərdə tutulub.
- **Proqress İzləmə**: Öyrənilən sualların sayı və gündəlik "streak" (davamlılıq) izləmə sistemi.
- **Responsive Dizayn**: Mobil və masaüstü cihazlar üçün tam uyğunlaşdırılmış interfeys.

## 🛠 Texnologiya Stack-i

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Management**: JSON based static data extraction & processing

## 🏁 İşə Salma (Getting Started)

Layihəni lokal mühitdə işlətmək üçün:

1. Asılılıqları yükləyin:
   ```bash
   npm install
   ```

2. Development serverini işə salın:
   ```bash
   npm run dev
   ```

3. Brauzerdə açın: [http://localhost:3000](http://localhost:3000)

## 📝 Məlumat Strukturu (JSON)

Yeni suallar əlavə etmək üçün `src/data` qovluğunda aşağıdakı formatdan istifadə olunur:

```json
[
  {
    "id": "1",
    "type": "mcq", // və ya "flashcard"
    "question": "Sual mətni",
    "options": ["Variant A", "Variant B", ...], // Test sualları üçün
    "answer": "Düzgün cavab", // Və ya izahlı cavab mətni
    "category": "Fənnin adı"
  }
]
```

## ⚠️ Qeyd

Bu tətbiq şəxsi istifadə və təhsil məqsədləri üçün hazırlanmışdır. İmtahan tarixləri və məzmunu tədris planına uyğun olaraq dəyişdirilə bilər.
