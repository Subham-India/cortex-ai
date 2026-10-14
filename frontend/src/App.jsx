import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

import { auth } from "./firebase";
import { setUser, clearUser } from "./features/auth/authSlice";
import { isSessionExpired } from "./utils/session";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(clearUser());
        return;
      }

      try {
        if (await isSessionExpired(firebaseUser)) {
          await signOut(auth);
          dispatch(clearUser());
          return;
        }

        const token = await firebaseUser.getIdToken();
        const res = await axios.post(
          "/api/auth/login",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        dispatch(
          setUser({
            ...res.data.user,
            displayName: res.data.user.name || firebaseUser.displayName,
          })
        );
      } catch (err) {
        console.error("Session restore failed:", err);
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;