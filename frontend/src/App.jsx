import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

function App() {

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();

      console.log("ID Token received");

      const response = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div>
      <h1>Cortex AI</h1>

      <button onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </div>
  );
}

export default App;