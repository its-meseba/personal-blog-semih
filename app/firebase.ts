import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, set, increment, runTransaction } from "firebase/database";

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isFirebaseConfigured =
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    !firebaseConfig.apiKey.includes("your_api_key") &&
    !firebaseConfig.databaseURL.includes("your_project_id");

// Initialize Firebase app (singleton pattern)
const app = isFirebaseConfigured && getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

// Get database instance
const database = isFirebaseConfigured ? getDatabase(app) : null;

// Mock implementations for when Firebase is not configured
const createMockDatabase = () => ({
    getViews: async () => ({}),
    getView: async () => 0,
    incrementView: async () => 0,
});

// Timeout wrapper to prevent hanging
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((resolve) => setTimeout(() => {
            console.warn(`Firebase operation timed out after ${ms}ms, using fallback`);
            resolve(fallback);
        }, ms))
    ]);
};

// Firebase database operations
const firebaseOperations = {
    // Get all views
    getViews: async (): Promise<Record<string, number>> => {
        if (!database) return {};
        try {
            const viewsRef = ref(database, "views");
            const snapshot = await withTimeout(get(viewsRef), 3000, null);
            if (snapshot === null) return {};
            return snapshot.exists() ? snapshot.val() : {};
        } catch (error) {
            console.warn("Failed to fetch views from Firebase:", error);
            return {};
        }
    },

    // Get view count for a specific post
    getView: async (postId: string): Promise<number> => {
        if (!database) return 0;
        try {
            const viewRef = ref(database, `views/${postId}`);
            const snapshot = await get(viewRef);
            return snapshot.exists() ? snapshot.val() : 0;
        } catch (error) {
            console.warn(`Failed to fetch view for ${postId}:`, error);
            return 0;
        }
    },

    // Increment view count for a post
    incrementView: async (postId: string): Promise<number> => {
        if (!database) return 0;
        try {
            const viewRef = ref(database, `views/${postId}`);
            let newValue = 0;
            await runTransaction(viewRef, (currentValue) => {
                newValue = (currentValue || 0) + 1;
                return newValue;
            });
            return newValue;
        } catch (error) {
            console.warn(`Failed to increment view for ${postId}:`, error);
            return 0;
        }
    },
};

// Export the appropriate implementation
export const db = isFirebaseConfigured ? firebaseOperations : createMockDatabase();
export { database, isFirebaseConfigured };
