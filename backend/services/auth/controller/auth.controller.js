import User from "../models/user.model.js";

export const loginUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    // Check if user already exists
    let user = await User.findOne({
      firebaseUid: uid,
    });

    // First login → create user
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        avatar: picture,
      });

      console.log("New user created:", user.email);
    }

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