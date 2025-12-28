export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const auth0Config = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
};

export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

export const apiConfig = {
  BASE_URL: import.meta.env.VITE_API_URL
}

export const keycloakConfig = {
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORITY,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  client_secret: import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET,
  response_type: "code",
  scope: "openid profile email",
  redirect_uri: `${window.location.origin}/auth/sign-in`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  grant_type: "password"
}

export const recapchaConfig = {
  SITE_KEY: import.meta.env.VITE_RECAPTHA_SITE_KEY
}