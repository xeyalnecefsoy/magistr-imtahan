# Project Development Notes & User Preferences

## Content Style Guidelines
- **Simplification is Priority**: Exam answers must be rewritten in very simple, conversational language. Avoid overly academic or complex phrasing.
- **Structure**: Use clear Markdown structuring for answers:
  - **Headings**: Use `**Bold Questions?**` for sub-sections.
  - **Bullet Points**: Break down long paragraphs into lists.
  - **Analogies**: Use "Soul vs Body" or similar simple analogies to explain abstract concepts.

## Functional Logic Preferences
- **Dynamic over Generic**: The user strongly dislikes generic static text (e.g., "This is a design question").
- **Smart Context**: Features like "Ticket Strategy" or "Guides" must dynamically analyze the specific content (e.g., specific questions in a ticket) to provide tailored advice.
- **Narrative summaries**: Advice algorithms should construct clear, cohesive narrative sentences (e.g., "This ticket combines X and Y concepts...") rather than just listing tags.
- **Keyword Filtering**: When extracting keywords programmatically, simplified "stop word" lists must be used to exclude generic terms (e.g., "xülasə", "haqqında") and prioritize high-value concepts.

## Tech Stack Notes
- **Markdown Rendering**: We are using `react-markdown` to render simplified answers. Ensure all new content fields support markdown.
