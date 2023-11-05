import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  Username: String,
  Password: String,
});

export const User = mongoose.model("user", userSchema);
export const RegisterSchema = new mongoose.Schema({
  Username: String,
  Email: String,
  Password: String,
});

export const Register = mongoose.model("register", RegisterSchema);
