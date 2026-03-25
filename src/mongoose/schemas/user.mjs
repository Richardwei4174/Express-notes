import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true, // this is so we cannot store the same username in our database
  },
  displayName : mongoose.Schema.Types.String,
  displayName: {
    type: mongoose.Schema.Types.String,
    required: true,
  }
});

export const User = mongoose.model("User", UserSchema);