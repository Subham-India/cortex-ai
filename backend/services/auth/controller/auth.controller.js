import User from "../models/user.model.js";
import redisClient from "../config/redis.js";

export const loginUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    let user = await User.findOne({
      firebaseUid: uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        avatar: picture,
      });

      console.log("New user created:", user.email);
    }

    // Cache user in Redis
    await redisClient.set(
      `user:${uid}`,
      JSON.stringify({
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      }),
      {
        EX: 3600,
      }
    );

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const uid = req.user.uid;

    // 1. Check Redis first
    const cachedUser = await redisClient.get(`user:${uid}`);

    if (cachedUser) {
      console.log("User found in Redis");

      return res.status(200).json({
        success: true,
        user: JSON.parse(cachedUser),
        source: "redis",
      });
    }

    // 2. Redis doesn't have user → MongoDB
    console.log("User not found in Redis. Checking MongoDB...");

    const user = await User.findOne({
      firebaseUid: uid,
    }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Store MongoDB result in Redis
    await redisClient.set(
      `user:${uid}`,
      JSON.stringify({
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      }),
      {
        EX: 3600,
      }
    );

    // 4. Return user
    return res.status(200).json({
      success: true,
      user,
      source: "mongodb",
    });

  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};