# Magistr Exam Prep

A high-velocity, dark-themed exam preparation app built with Next.js, Tailwind CSS, and Shadcn UI.

## Features

- **Blitz Mode**: Answer questions against a 60-second timer. Points are awarded for speed and accuracy.
- **Flashcard Mode**: Flip cards to test your knowledge. Track how many you've learned in a session.
- **Import Questions**: Load your own schema-compliant JSON file.
- **Progress Tracking**: Visual mastery & streak indicators.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## JSON Format

To import your own questions, use the following format:

```json
[
  {
    "id": "1",
    "type": "mcq", // or "flashcard"
    "question": "Your Question Here",
    "options": ["Option A", "Option B", ...], // Required for MCQ
    "answer": "Option A", // The correct string match
    "category": "Topic"
  }
]
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI 
- **Animations**: Framer Motion
- **Icons**: Lucide React
