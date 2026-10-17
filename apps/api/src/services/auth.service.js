
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import RefreshSession from "../models/RefreshSession.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  generateRefreshToken,
  generateSessionFamilyId,
  hashRefreshToken,
  REFRESH_TOKEN_TTL_MS,
} from "../utils/tokens.js";

// -----------------------------------------
// REGISTER
// -----------------------------------------

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
};

// -----------------------------------------
// LOGIN AUTHENTICATION
// -----------------------------------------

export const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.isBlocked) {
    const error = new Error("Account is blocked");
    error.statusCode = 403;
    throw error;
  }

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

  user.lastLoginAt = new Date();
  await user.save();

  return user;
};

// -----------------------------------------
// CREATE LOGIN SESSION
// -----------------------------------------

export const createLoginSession = async (user, userAgent = "") => {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const familyId = generateSessionFamilyId();

  await RefreshSession.create({
    userId: user._id,
    tokenHash,
    familyId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    userAgent: userAgent.slice(0, 500),
  });

  return {
    accessToken: generateAccessToken(user),
    refreshToken,
  };
};

// -----------------------------------------
// ROTATE REFRESH TOKEN
// -----------------------------------------

export const rotateRefreshSession = async (refreshToken) => {
  if (
    typeof refreshToken !== "string" ||
    refreshToken.length < 40 ||
    refreshToken.length > 100
  ) {
    const error = new Error("Invalid or expired session");
    error.statusCode = 401;
    throw error;
  }

  const tokenHash = hashRefreshToken(refreshToken);
  const now = new Date();

  const existing = await RefreshSession.findOne({ tokenHash });

  if (!existing) {
    const error = new Error("Invalid or expired session");
    error.statusCode = 401;
    throw error;
  }

  // Reuse of a consumed token can indicate token theft.
  if (existing.revokedAt) {
    await RefreshSession.updateMany(
      {
        familyId: existing.familyId,
        revokedAt: null,
      },
      {
        $set: { revokedAt: now },
      }
    );

    const error = new Error(
      "Refresh token reuse detected. Please log in again."
    );
    error.statusCode = 401;
    throw error;
  }

  if (existing.expiresAt <= now) {
    await RefreshSession.updateOne(
      { _id: existing._id, revokedAt: null },
      { $set: { revokedAt: now } }
    );

    const error = new Error("Refresh token expired");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(existing.userId);

  if (!user || user.isBlocked || !user.isVerified) {
    await RefreshSession.updateMany(
      { familyId: existing.familyId, revokedAt: null },
      { $set: { revokedAt: now } }
    );

    const error = new Error("Account is unavailable");
    error.statusCode = 401;
    throw error;
  }

  const nextRefreshToken = generateRefreshToken();
  const nextTokenHash = hashRefreshToken(nextRefreshToken);

  // Use a MongoDB transaction so consuming the old token and creating
  // its replacement succeed or fail together.
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const consumed = await RefreshSession.findOneAndUpdate(
        {
          _id: existing._id,
          revokedAt: null,
          expiresAt: { $gt: new Date() },
        },
        {
          $set: {
            revokedAt: new Date(),
            replacedByTokenHash: nextTokenHash,
          },
        },
        {
          new: false,
          session,
        }
      );

      if (!consumed) {
        const error = new Error(
          "Refresh session already used or expired"
        );
        error.statusCode = 401;
        throw error;
      }

      await RefreshSession.create(
        [
          {
            userId: user._id,
            tokenHash: nextTokenHash,
            familyId: existing.familyId,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
            userAgent: existing.userAgent || "",
          },
        ],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  return {
    accessToken: generateAccessToken(user),
    refreshToken: nextRefreshToken,
  };
};

// -----------------------------------------
// LOGOUT: REVOKE CURRENT REFRESH TOKEN
// -----------------------------------------

export const revokeRefreshSession = async (refreshToken) => {
  if (typeof refreshToken !== "string" || !refreshToken) {
    return;
  }

  const tokenHash = hashRefreshToken(refreshToken);

  await RefreshSession.updateOne(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: { revokedAt: new Date() },
    }
  );
};

// -----------------------------------------
// LOGOUT FROM ALL DEVICES
// -----------------------------------------

export const revokeAllUserSessions = async (userId) => {
  await RefreshSession.updateMany(
    {
      userId,
      revokedAt: null,
    },
    {
      $set: { revokedAt: new Date() },
    }
  );
};
