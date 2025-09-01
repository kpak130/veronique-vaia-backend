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
   - Individual Firebase service account fields (optional, uses Application Default Credentials if not provided)

3. **Firebase Authentication:**
   - Option 1: Set individual Firebase service account environment variables in `.env`
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
| `FIREBASE_TYPE` | Service account type (usually "service_account") | No* |
| `FIREBASE_PRIVATE_KEY_ID` | Service account private key ID | No* |
| `FIREBASE_PRIVATE_KEY` | Service account private key | No* |
| `FIREBASE_CLIENT_EMAIL` | Service account client email | No* |
| `FIREBASE_CLIENT_ID` | Service account client ID | No* |
| `FIREBASE_AUTH_URI` | OAuth2 auth URI | No* |
| `FIREBASE_TOKEN_URI` | OAuth2 token URI | No* |
| `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` | Auth provider x509 cert URL | No* |
| `FIREBASE_CLIENT_X509_CERT_URL` | Client x509 cert URL | No* |

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
