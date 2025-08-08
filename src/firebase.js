// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Example: Save data
export async function saveData(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// Example: Retrieve data
export async function getData(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
}

// Sign in with Google popup and save user profile
export async function signInWithGoogleAndSaveProfile() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Save user profile to Firestore
    await saveData("users", {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

export { db, app, analytics, auth };