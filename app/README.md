# Pocket Interviewer - AI-Powered Interview Practice

This is an AI-powered interview practice application that allows users to practice interviews with real-time feedback. The application features voice recognition, AI-powered feedback, and multiple interview modes with MongoDB for data persistence.

## Features

- Real-time voice recognition and transcription
- AI-powered interview feedback using local LLMs
- Multiple interview types (behavioral, technical, rapid-fire, etc.)
- Progress tracking and analytics
- Bold, vibrant UI/UX with engaging animations
- MongoDB integration for user data and interview history

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Ollama (for local AI processing)
- MongoDB (local installation or cloud Atlas)

### Installation

#### Frontend Setup

1. Install frontend dependencies:
```bash
cd app
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

#### Backend Setup

1. Navigate to the server directory:
```bash
cd ../server
```

2. Install backend dependencies:
```bash
npm install
```

3. Set up MongoDB:
   - Option 1: Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Option 2: Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas/database) for cloud hosting

4. Create a `.env` file in the server directory with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/pocket_interviewer  # For local MongoDB
# OR
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pocket_interviewer  # For MongoDB Atlas
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

5. Start the backend server:
```bash
npm run dev  # For development with nodemon
# OR
npm start   # For production
```

#### Ollama Setup

1. Install and run Ollama:
- Download Ollama from [ollama.com](https://ollama.com)
- Follow installation instructions for your OS

2. Pull the required model:
```bash
# Recommended: Llama 3.2 (smaller, efficient)
ollama pull llama3.2:3b

# Alternative: Original Llama 3 (larger, more capable)
ollama pull llama3:8b

# Or use the 7b version
ollama pull llama3:7b
```

3. Start Ollama server:
```bash
ollama serve
```

The application will be available at `http://localhost:5173` with the backend running on `http://localhost:5000`.

## Checking MongoDB Connection

To verify that MongoDB is connected properly:

1. Look for the "Connected to MongoDB" message in the backend server console when starting the server
2. Check the server logs for any connection errors
3. You can also use MongoDB Compass or MongoDB Shell to verify that collections are being created

## Model Options

You can use different models depending on your hardware capabilities:

- `llama3.2:3b` - Smaller, faster, good for most systems
- `llama3.2:1b` - Even smaller, fastest option
- `llama3:8b` - Larger, more capable but requires more resources
- `llama3:7b` - Alternative to 8b version

To change the model, update the `model` parameter in `src/utils/ollamaService.ts`.

## Usage

1. Start both the backend and frontend servers
2. Sign up or log in to the application
3. Select your domain and interview type
4. Start an interview session
5. Speak your answers to the interview questions
6. Receive AI-powered feedback after the session
7. Your data will be persisted in MongoDB

## Architecture

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + MongoDB
- Authentication: JWT tokens
- AI Processing: Local Ollama models
- Data Persistence: MongoDB with Mongoose ODM

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
