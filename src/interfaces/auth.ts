// third-party
import firebase from 'firebase/compat/app';

// project imports
import { UserProfile, UserProfileV2 } from './user-profile';

export type FirebaseContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => Promise<void>;
    login: () => void;
    firebaseRegister: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
    firebaseEmailPasswordSignIn: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
    firebaseGoogleSignIn: () => Promise<firebase.auth.UserCredential>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: VoidFunction;
};

export type Auth0ContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => void;
    login: () => void;
    resetPassword: (email: string) => void;
    updateProfile: VoidFunction;
};

export interface JWTDataProps {
    userId: string;
}

export type JWTContextType = {
    isLoggedIn: boolean;
    account?: Account;
    logout: () => void;
    login: (email: string, password: string) => Promise<void>;
};
export interface Account {
    username:string
    role:string
}
export type AWSCognitoContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<unknown>;
};

export interface InitialLoginContextProps {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfileV2 | null | undefined;
}
