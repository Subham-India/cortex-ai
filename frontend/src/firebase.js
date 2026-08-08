import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAt-iwjqha02Ikc0qC1DOlPjBoG24vXTp8",
  authDomain: "cortex-ai-a55e0.firebaseapp.com",
  projectId: "cortex-ai-a55e0",
  storageBucket: "cortex-ai-a55e0.firebasestorage.app",
  messagingSenderId: "421267811542",
  appId: "1:421267811542:web:b0196eba5b5ccdfcc92d77",
  measurementId: "G-0RZHKMGFB2"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);