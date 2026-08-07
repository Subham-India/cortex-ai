import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firebaseuid: {
    type: String,
    required: true,
    unique: true,
  },
  email: String,
  name: String,
  avatar: String
},
{
  timestamps: true,
})

const User = mongoose.model("User", userSchema);
export default User;

