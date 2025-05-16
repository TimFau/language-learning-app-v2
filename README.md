# LangPulse

**LangPulse** is a modern, flexible web app for building, studying, and sharing language flashcard decks. Designed for learners who want total control over their vocabulary, LangPulse lets you instantly turn any Google Sheet into a quiz-ready deck and join a growing community of language enthusiasts.

> **Note:** This project is in active development. The app is accessible at [langpulse.com](https://langpulse.com) and is **not supported for local or self-hosted use** due to its reliance on a private Directus backend.

## Features

- **Instant Deck Creation:** Import vocabulary lists directly from Google Sheets by simply pasting the sheet ID.
- **Multiple Study Modes:** Practice with Flashcard, Wordbank (multiple choice), or Keyboard (typed answer) modes.
- **Personal & Community Decks:** Create private decks or share them with the community. Browse and study decks shared by others.
- **Account Management:** Register, log in, and manage your decks and profile.
- **Modern UI:** Built with React, Material UI, and Vite for a fast, responsive experience.
- **TypeScript Codebase:** Ensures type safety and maintainability.
- **Backend Integration:** Uses Directus as a headless CMS for user accounts and deck management.
- **End-to-End Tested:** Automated tests with Playwright for critical user flows.

## How It Works

1. **Sign Up / Log In:** Create an account to save your decks.
2. **Create a Deck:** Enter a name, select your languages, and paste a Google Sheet ID. The app fetches your vocab and builds a deck.
3. **Study:** Choose your preferred study mode and start practicing.
4. **Community:** Browse public decks, save them to your collection, or share your own.

## Supported Languages

- English
- Spanish
- French
- German

*(More languages can be added by editing the language options in the code.)*

## Project Structure

- `src/` – Main application code (components, pages, services, context, styles)
- `public/` – Static assets (images, etc.)
- `tests/` – Playwright end-to-end tests
- `docs/` – Documentation and test plans

## Tech Stack

- **Frontend:** React, TypeScript, Material UI, Redux, Apollo Client, Vite
- **Backend:** Directus (headless CMS, not included in this repo)
- **Testing:** Playwright

## Contributing

This project is currently a personal learning project and not open for external contributions. If you have feedback or suggestions, feel free to open an issue.

## License

The source code is provided for reference and learning purposes only. No permission is granted to use, copy, modify, or distribute this code for any purpose without explicit written consent.

---

**LangPulse** is built and maintained by [TimFau](https://github.com/TimFau).  
For more details, see [langpulse.com](https://langpulse.com).
