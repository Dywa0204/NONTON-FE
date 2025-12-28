/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_DATABASE_URL: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APPID: string;
    readonly VITE_FIREBASE_MEASUREMENT_ID: string;
    readonly VITE_AUTH0_CLIENT_ID: string;
    readonly VITE_AUTH0_DOMAIN: string;
    readonly VITE_COGNITO_USER_POOL_ID: string;
    readonly VITE_COGNITO_CLIENT_ID: string;
    readonly VITE_API_URL: string;

    readonly VITE_KEYCLOAK_REALM: string;
    readonly VITE_KEYCLOAK_AUTHORITY: string;
    readonly VITE_KEYCLOAK_CLIENT_ID: string;
    readonly VITE_KEYCLOAK_CLIENT_SECRET: string;
    
    readonly VITE_RECAPTHA_SITE_KEY: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
  