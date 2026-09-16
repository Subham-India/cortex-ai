// authService.js - login function
import { signOut, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import axios from "axios";

export async function loginWithGoogle() {
  try {
    // 1. Clear any existing Firebase session first
    await signOut(auth);

    // 2. Force Google to show account chooser (don't auto-pick last account)
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    // 3. Open Google popup
    const result = await signInWithPopup(auth, googleProvider);

    // 4. Get a FRESH ID token — never reuse a cached/stale one
    const idToken = await result.user.getIdToken(/* forceRefresh */ true);

    // 5. Send token to your backend
    const response = await axios.post(
      "/api/auth/login",
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    console.log("✅ Backend login response:", response.data);
    return response.data;

  } catch (error) {
    console.error("🔥 Google login error:", error);
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
  localStorage.removeItem("token"); // if you were caching a token anywhere — remove it
}