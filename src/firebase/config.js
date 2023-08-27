// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDur_06UX6FI8NJL0Pg08pUjy9CdsO32uw",
  authDomain: "pixel-dam.firebaseapp.com",
  projectId: "pixel-dam",
  storageBucket: "pixel-dam.appspot.com",
  messagingSenderId: "338865545935",
  appId: "1:338865545935:web:31ef161d7685dc176b4dba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore();
export const auth=getAuth();