import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registerUser = async ({ email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
};

export const authenticateUser = async ({ email, password }) => {
  // Find user and explicitly include password
  const user = await User.findOne({ email }).select("+password");

  // User not found
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Check if account is blocked
  if (user.isBlocked) {
    const error = new Error("Account is blocked");
    error.statusCode = 403;
    throw error;
  }

  // Compare entered password with hashed password
  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isVerified) {
  const error = new Error(
    "Please verify your email before logging in"
  );

  error.statusCode = 403;
  throw error;
}

  // Update last login time
  user.lastLoginAt = new Date();

  await user.save();

  return user;
};