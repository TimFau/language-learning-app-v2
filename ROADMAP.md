# 🗺️ LangPulse Feature Roadmap

This document outlines planned and proposed features for future development of LangPulse. Features are categorized by priority and scope.

---

## ✅ MVP (Completed)
- Google Sheets import for decks
- Flashcard UI with term-by-term study mode
- Speech Synthesis API for audible pronunciation (basic)

---

## 🔧 In Progress / Experimental
- Article-style lesson plans linking to decks
- Pro feature planning (saved term lists, spaced repetition)

---

## 🚀 Planned Features

### 🧠 Core Learning Experience
- [ ] **Session-based Chunking**  
  Break large decks (100+ terms) into shorter sessions for more digestible studying.

- [ ] **Smart Resume**  
  Save user progress within decks to allow easy continuation.

- [ ] **Spaced Repetition** *(Pro feature)*  
  Move beyond deck-based memorization with intelligent scheduling of reviews, stored in Directus backend.

- [ ] **Deck Completion Milestones**  
  Gamified progress tracking (e.g., streaks, XP, badges).

- [ ] **Audio Pronunciation Upgrade**  
  Explore improved voice options (e.g., ElevenLabs, Azure TTS) for higher-quality audio—especially for iOS and non-Chrome browsers.

---

### 💾 Saved Terms & Personalized Learning *(Pro)*
- [ ] **Save Individual Terms**  
  Let users bookmark specific words/phrases from any deck into a private saved list per language.

- [ ] **Save Entire Decks to Profile**  
  Allow saving of public/shared decks into a user's personal library for extended tracking and repetition.

- [ ] **Multi-Deck Master List per Language**  
  Enable a master review mode that spans all saved terms in a language.

---

### 🧑‍🏫 Lessons and Content
- [ ] **Integrated Lesson Pages**  
  Article-style lessons (hosted on LangPulse) with deck links at the end for post-lesson review.

- [ ] **Deck Suggestions Based on Lesson**  
  Surface relevant decks beneath lessons for deeper engagement.

---

### 💻 UI/UX Improvements
- [ ] **Flashcard UI Redesign**  
  More balanced layout and cleaner interaction on mobile and desktop.

- [ ] **Mobile Optimization**  
  Improve touch interactions, especially for swiping or tapping between cards.

- [ ] **Dark Mode Toggle**  
  Manual dark/light mode or follow system preferences.

---

### 📱 Distribution
- [ ] **Capacitor App Build**  
  Package LangPulse frontend as a mobile app for iOS and Android via Capacitor.

- [ ] **Play Store + App Store Publishing**  
  Distribute as a free app with optional in-app purchases for Pro features.

---

### 📈 Growth & Monetization
- [ ] **Beta Access Program**  
  "Free for beta" access to Pro features in exchange for feedback.

- [ ] **Pro Subscription Tier**  
  Monetize saved lists, smart review, and advanced audio via optional subscription.

- [ ] **Referral or Sharing Features**  
  Incentivize users to share decks or invite friends.

---

### 🛠️ Dev & Infra
- [ ] **Public GitHub Pages FE Optimization**  
  Performance tuning for TTFB and hydration.

- [ ] **Backend Scaling**  
  Monitor Fly.io usage and explore autoscaling or resource upgrades as user base grows.

- [ ] **Basic Analytics**  
  Track deck usage, lesson views, and feature engagement (privacy-respecting).

---

## 🧪 Nice-to-Haves / Future Ideas
- [ ] **Deck Rating or Feedback**  
  Let users rate decks or flag errors.

- [ ] **Multi-language Support for UI**  
  Translate LangPulse's interface for non-English speakers.

- [ ] **Offline Mode (App Only)**  
  Cached decks and study history in mobile app version.

- [ ] **Improve UX for Adding Decks**  
  Provide clear guidance and UI for obtaining the Google Sheet ID and publishing a sheet as a deck. Currently, users lack direction on how to get the ID or publish a Google Sheet.

---

## 📌 Notes
- All features tied to user accounts should leverage the existing Directus backend.
- Sheet-based decks remain stateless by design, preserving flexibility.

---

*Last updated: 2025-05-23*