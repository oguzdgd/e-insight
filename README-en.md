## README Languages
- [Turkish](README.md)
- [English](README-en.md)

# E-Insight

E-Insight is a web application that analyzes product reviews on e-commerce platforms, providing insights for both buyers and sellers. It helps users make more informed decisions by leveraging AI-powered review analysis.

## Features

- **Product Review Analysis**: Fetches and analyzes reviews from Trendyol.
- **Dual Mode**:
  - User Mode: Focuses on buyer perspective with product ratings and summaries.
  - Seller Mode: Offers competitive analysis and improvement suggestions.
- **Custom Analysis**: Ability to add custom prompts for specific analytical needs.
- **AI Powered**: Utilizes Google's Gemini AI for smart review analysis.

## Tech Stack

### Frontend
- React + Vite
- React Router for navigation
- Zustand for state management
- SCSS for styling
- Axios for API requests

### Backend
- Express.js
- MongoDB for data storage
- Puppeteer for web scraping
- Google Gemini AI for review analysis
- CORS for cross-origin requests

## Getting Started

### Requirements
- Node.js
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. Clone the repository
2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```
3. Install frontend dependencies:
    ```bash
    cd frontend/insight
    npm install
    ```
4. Create a `backend/config.env` file in the backend directory:
    ```env
    ATLAS_URI=your_mongodb_connection_string
    PORT=5050
    GEMINI_API_KEY=your_gemini_api_key
    ```

### Running the App

1. Start the backend server:
    ```bash
    cd backend
    node --env-file=config.env server.js // You can use dotenv if preferred.
    ```
2. Start the frontend development server:
    ```bash
    cd frontend/insight
    npm run dev
    ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

## Technologies Used

- React Router for navigation
- Zustand for state management
- Google Gemini AI for analysis
- MongoDB for database