# Language Learning App V2

## This project is publicly available to document my progress in developing a language learning quiz/flashcard app. However, please note that it is still in the development phase and is not currently functional outside of my local environment. If you attempt to run it locally, it will not work correctly due to the missing env file.

This project builds on the functionality built for [version 1](https://github.com/TimFau/language-learning-app). 

The main goals of this version (V2) are as follows:
- Integrating backend functionality with Directus, including:
    - Account functionality
    - User list management within the app
    - Importing lists from Google Sheets and saving them in the app's backend
    - Saving user progress in the app's backend
    - Reducing dependency on Google Sheets by introducing new ways to retrieve and store data.
- Transitioning to Typescript to enhance learning opportunities and simplify maintenance.
- Creating a robust foundation for implementing various new functionalities.
- Using Vite as the build tool for faster development and production builds.

## Running Project Locally

Before running the project, please ensure that you have Node.js version 18 or higher installed.

To run the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```
