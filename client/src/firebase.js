/* Copyright (c) 2023, Jason Oltzen */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTUjcNeb1oTYE7FeeQQLq59bbD8qKaY5Q",
  authDomain: "fiananceforstudents.firebaseapp.com",
  projectId: "fiananceforstudents",
  storageBucket: "fiananceforstudents.firebasestorage.app",
  messagingSenderId: "88948014185",
  appId: "1:88948014185:web:2dd2d62b2c31ab13d476f8",
  measurementId: "G-LYPKBHRFPD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
