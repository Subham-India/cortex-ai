import { adminAuth } from "../config/firebase.js";

const SEVEN_DAYS = 7 * 24 * 60 * 60;

const authMiddleware = async (req, res, next) => {
  try {
    console.log("🔥 Auth middleware reached");

    const authHeader = req.headers.authorization;
    console.log("Authorization header:", !!authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    console.log(" Token received");

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log(" Token verified:", decodedToken.uid);

    // Session expiry: reject if the user signed in more than 7 days ago
    if (Date.now() / 1000 - decodedToken.auth_time > SEVEN_DAYS) {
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(" Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;