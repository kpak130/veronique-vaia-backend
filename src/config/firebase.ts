import * as admin from 'firebase-admin';

// Build service account object from individual environment variables
const buildServiceAccount = (): admin.ServiceAccount | undefined => {
  const requiredFields = [
    'FIREBASE_TYPE',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_AUTH_URI',
    'FIREBASE_TOKEN_URI',
    'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
    'FIREBASE_CLIENT_X509_CERT_URL'
  ];

  // Check if all required fields are present
  const hasAllFields = requiredFields.every(field => process.env[field]);
  
  if (!hasAllFields) {
    return undefined;
  }

  return {
    type: process.env.FIREBASE_TYPE!,
    project_id: process.env.FIREBASE_PROJECT_ID!,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
    private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL!,
    client_id: process.env.FIREBASE_CLIENT_ID!,
    auth_uri: process.env.FIREBASE_AUTH_URI!,
    token_uri: process.env.FIREBASE_TOKEN_URI!,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL!,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL!
  } as admin.ServiceAccount;
};

const serviceAccount = buildServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount 
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const db = admin.firestore();
export { admin };