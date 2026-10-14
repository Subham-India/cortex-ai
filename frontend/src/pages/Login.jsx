import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Always show the Google account chooser
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      // Fresh token for the backend
      const idToken = await result.user.getIdToken(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        dispatch(setUser({ ...data.user, displayName: data.user.name }));
        navigate("/home");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // Already logged in (e.g. returning within 7 days) -> skip the login page
  if (!loading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  
    // ... your existing JSX, unchanged

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">
      {/* Blue light beam behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[70vw] -translate-x-1/2 -rotate-6 bg-gradient-to-b from-blue-600/40 via-indigo-700/10 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-px -translate-x-1/2 bg-gradient-to-b from-blue-400/50 to-transparent" />
      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-950/80 p-8 sm:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <h1 className="mb-3 text-center text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Sign In to Your Account
        </h1>
        <p className="mx-auto mb-8 max-w-md text-center text-sm leading-relaxed text-neutral-400">
          Welcome to a smarter way of managing tasks and products. Our
          comprehensive suite is designed to streamline your workflow, enhance
          collaboration.
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3.5 text-sm font-medium text-neutral-200 transition-all duration-200 hover:bg-neutral-800 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
            />
          </svg>
          <span>or Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-neutral-400">Or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-neutral-200">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3 text-sm text-white placeholder-neutral-500 transition focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="mb-2 block text-sm font-medium text-neutral-200">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3 pr-11 text-sm text-white placeholder-neutral-500 transition focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.22A10.48 10.48 0 0 0 1.93 12c1.29 4.06 5.06 7 9.57 7 1.44 0 2.82-.3 4.07-.84m1.98-1.16A10.44 10.44 0 0 0 22.07 12c-1.29-4.06-5.06-7-9.57-7-1.13 0-2.22.18-3.24.51M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1.93 12C3.22 7.94 6.99 5 11.5 5s8.28 2.94 9.57 7c-1.29 4.06-5.06 7-9.57 7s-8.28-2.94-9.57-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="mb-6 text-right">
          <a href="#" className="text-sm text-neutral-300 hover:text-white hover:underline underline-offset-2">
            Forgot your password?
          </a>
        </div>

        {/* Sign In button */}
        <button
          type="button"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:brightness-110 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400/60 active:brightness-95"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Login;
