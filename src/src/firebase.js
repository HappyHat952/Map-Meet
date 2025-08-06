// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATDxS_3GNSm1EErb1ODbADitpoZssHwNo",
  authDomain: "technica-project-54dd1.firebaseapp.com",
  projectId: "technica-project-54dd1",
  storageBucket: "technica-project-54dd1.firebasestorage.app",
  messagingSenderId: "118478332901",
  appId: "1:118478332901:web:14faf36707dcd6014ac50c",
  measurementId: "G-NV4H6BDMK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);