# Vaia Backend

Express.js TypeScript API with Firestore integration.

## Prerequisites

- Node.js (v16 or higher)
- npm
- Firebase project with Firestore enabled

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Firebase configuration:
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: Service account JSON (optional, uses Application Default Credentials if not provided)

3. **Firebase Authentication:**
   - Option 1: Set `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env` with your service account JSON
   - Option 2: Use Application Default Credentials (recommended for local development)

## Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app.ts              # Main Express application
└── config/
    └── firebase.ts     # Firestore configuration
```

## API Endpoints

- `GET /` - Health check endpoint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Service account JSON | No* |

*Required for production deployment, optional for local development with Application Default Credentials.

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Start the server:
   ```bash
   npm start
   ```# veronique-vaia-backend
