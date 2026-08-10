import User from "../models/user.model.js";
import redisClient from "../config/redis.js";

// =====================================================
// LOGIN / AUTO REGISTER
// =====================================================

export const loginUser = async (req, res) => {
  try {
    // -------------------------------------------------
    // 1. Get Firebase user from authentication middleware
    // -------------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User authentication information missing",
      });
    }

    const {
      uid,
      email,
      name,
      picture,
    } = req.user;

    console.log("🔥 Firebase user:");
    console.log({
      uid,
      email,
      name,
      picture,
    });

    // -------------------------------------------------
    // 2. Validate Firebase UID
    // -------------------------------------------------

    if (!uid) {
      console.error("❌ Firebase UID is missing");

      return res.status(400).json({
        success: false,
        message: "Firebase UID missing",
      });
    }

    // -------------------------------------------------
    // 3. Check MongoDB for existing user
    // -------------------------------------------------

    let user = await User.findOne({
      firebaseUid: uid,
    });

    // -------------------------------------------------
    // 4. If user doesn't exist → create user
    // -------------------------------------------------

    if (!user) {
      console.log("🆕 New user. Creating account...");

      user = await User.create({
        firebaseUid: uid,
        email: email || "",
        name: name || "",
        avatar: picture || "",
      });

      console.log("✅ New user created:", user.email);
    } else {
      console.log("✅ Existing user:", user.email);
    }

    // -------------------------------------------------
    // 5. Prepare user data
    // -------------------------------------------------

    const userData = {
      id: user._id.toString(),
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    // -------------------------------------------------
    // 6. Store user in Redis
    // -------------------------------------------------

    await redisClient.set(
      `user:${uid}`,
      JSON.stringify(userData),
      {
        EX: 3600,
      }
    );

    console.log("✅ User cached in Redis");

    // -------------------------------------------------
    // 7. Send response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });

  } catch (error) {

    console.error("🔥 LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};


// =====================================================
// GET CURRENT USER
// =====================================================

export const getMe = async (req, res) => {
  try {

    // -------------------------------------------------
    // 1. Check authentication
    // -------------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { uid } = req.user;

    console.log("🔥 GetMe UID:", uid);

    // -------------------------------------------------
    // 2. Validate UID
    // -------------------------------------------------

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID missing",
      });
    }

    // -------------------------------------------------
    // 3. Check Redis
    // -------------------------------------------------

    const cachedUser = await redisClient.get(
      `user:${uid}`
    );

    if (cachedUser) {

      console.log("⚡ User found in Redis");

      return res.status(200).json({
        success: true,
        user: JSON.parse(cachedUser),
        source: "redis",
      });
    }

    // -------------------------------------------------
    // 4. Redis miss → MongoDB
    // -------------------------------------------------

    console.log(
      "🔍 User not found in Redis. Checking MongoDB..."
    );

    const user = await User.findOne({
      firebaseUid: uid,
    }).lean();

    // -------------------------------------------------
    // 5. User doesn't exist
    // -------------------------------------------------

    if (!user) {

      console.log("❌ User not found in MongoDB");

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // 6. Prepare user data
    // -------------------------------------------------

    const userData = {
      id: user._id.toString(),
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    // -------------------------------------------------
    // 7. Store MongoDB result in Redis
    // -------------------------------------------------

    await redisClient.set(
      `user:${uid}`,
      JSON.stringify(userData),
      {
        EX: 3600,
      }
    );

    console.log(
      "✅ User loaded from MongoDB and cached"
    );

    // -------------------------------------------------
    // 8. Return user
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      user: userData,
      source: "mongodb",
    });

  } catch (error) {

    console.error("🔥 GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get user",
    });
  }
};