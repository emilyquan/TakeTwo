// Firebase Authentification Set up
// Referenced in-class code

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replaced with my Firebase config from Firebase Console
const firebaseConfig = {
	apiKey: "AIzaSyBMBlcLCiE9U4k-j_Gu1SmXyXwTUV837Ng",
	authDomain: "taketwo-b44d7.firebaseapp.com",
	projectId: "taketwo-b44d7",
	storageBucket: "taketwo-b44d7.firebasestorage.app",
	messagingSenderId: "1048299220546",
	appId: "1:1048299220546:web:8be3952cb5d8c0381ac7db"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);
