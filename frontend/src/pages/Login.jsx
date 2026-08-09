import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      if (data.success) {
        dispatch(setUser(data.user));

        console.log("User stored in Redux:", data.user);

        navigate("/home");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-2xl font-bold">
                C
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to Cortex AI
            </h1>

            <p className="text-slate-400 mt-3">
              Build, manage and interact with your AI agents.
            </p>
          </div>

          {/* Google Button */}
        <button
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3
             bg-white text-slate-900 font-medium
             py-3 px-4 rounded-xl
             shadow-lg
             transition-all duration-300
             hover:bg-slate-50
             hover:shadow-2xl
             hover:scale-[1.02]
             active:scale-[0.98]"
>
  {/* Google icon */}
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.09-1.92 3.28-4.74 3.28-8.07z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.68l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.7 6.7 0 0 1 0-4.2V7.06H2.15a11 11 0 0 0 0 9.88l3.69-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 4.58c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.45 1.09 14.97 0 12 0A11 11 0 0 0 2.15 7.06l3.69 2.84C6.71 6.51 9.14 4.58 12 4.58z"
    />
  </svg>

  Continue with Google
</button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-xs text-slate-500">
              SECURE AUTHENTICATION
            </span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-slate-300">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-slate-300">
              Privacy Policy
            </span>
            .
          </p>

        </div>

        {/* Bottom branding */}
        <p className="text-center text-slate-600 text-xs mt-6">
          © 2026 Cortex AI. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Login;