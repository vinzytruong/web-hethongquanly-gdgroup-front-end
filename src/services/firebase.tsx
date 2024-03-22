import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAaoOykOifkaAi7fQJzt4fJiJ69PwGaGPM",
    authDomain: "du-lich-cau-ke.firebaseapp.com",
    projectId: "du-lich-cau-ke",
    storageBucket: "du-lich-cau-ke.appspot.com",
    messagingSenderId: "970895108292",
    appId: "1:970895108292:web:3fe9a275ddbaddf7d60191",
    measurementId: "G-9HVRXPNJG8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


