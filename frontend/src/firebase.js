// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1ZyeKOfTLuXOi2kMtkTDkqaaxD9ZzBkk",
    authDomain: "earn-499c3.firebaseapp.com",
    projectId: "earn-499c3",
    storageBucket: "earn-499c3.firebasestorage.app",
    messagingSenderId: "917094437112",
    appId: "1:917094437112:web:bb68df62bd85500bb66b0d",
    measurementId: "G-3FQR3D0HKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;