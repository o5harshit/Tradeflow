
import {
  registerUser,
  authenticateUser,
  createLoginSession,
  rotateRefreshSession,
  revokeRefreshSession,
  revokeAllUserSessions,
} from "../services/auth.service.js";

import { sendEmailOtp } from "../services/otp.service.js";
import User from "../models/User.js";
import { accessCookieOptions, refreshCookieOptions } from "../config/cookie.js";


function setSessionCookies(res, { accessToken, refreshToken }) {
  res.cookie("access_token", accessToken, {
    ...accessCookieOptions
  });

  res.cookie("refresh_token", refreshToken, {
    ...refreshCookieOptions
  });
}

function clearSessionCookies(res) {
  // Cookie name, path, and relevant options must match when clearing.
  res.clearCookie("access_token", accessCookieOptions);
  res.clearCookie("refresh_token", refreshCookieOptions);
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
}

// -----------------------------------------
// REGISTER
// -----------------------------------------

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    try {
      await sendEmailOtp(user.email); // if the email service is down so the user must login and say eamil is down when you make a withdraw or buy something then you could use verify your account 
    } catch (emailError) {
      // The account already exists. Do not pretend the email was sent.
      // The user can request another OTP through your resend endpoint.
      console.error("Registration OTP delivery failed:", emailError.message);

      return res.status(201).json({
        success: true,
        message:
          "Account created, but verification email could not be sent. Please request a new OTP.",
        data: {
          user: publicUser(user),
          verificationEmailSent: false,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Verify your email to continue.",
      data: {
        user: publicUser(user),
        verificationEmailSent: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------
// LOGIN
// -----------------------------------------

export const login = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body);

    const session = await createLoginSession(
      user,
      req.get("user-agent") || ""
    );

    setSessionCookies(res, session);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------
// REFRESH ACCESS TOKEN
// -----------------------------------------

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    const session = await rotateRefreshSession(refreshToken);

    setSessionCookies(res, session);

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully",
    });
  } catch (error) {
    // Clear cookies when the refresh attempt is rejected.
    // A database outage should not be converted into an authentication
    // failure; preserve server errors so clients can distinguish them.
    if (error.statusCode === 401) {
      clearSessionCookies(res);
    }

    next(error);
  }
};

// -----------------------------------------
// LOGOUT CURRENT SESSION
// -----------------------------------------

export const logout = async (req, res, next) => {
  try {
    await revokeRefreshSession(req.cookies?.refresh_token);

    clearSessionCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------
// LOGOUT ALL SESSIONS
// Requires access-token authentication.
// -----------------------------------------

export const logoutAll = async (req, res, next) => {
  try {
    await revokeAllUserSessions(req.user.sub);

    clearSessionCookies(res);

    return res.status(200).json({
      success: true,
      message: "All sessions have been revoked",
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------
// CURRENT USER
// -----------------------------------------

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select(
      "_id email role isVerified isBlocked"
    );

    if (!user || user.isBlocked || !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    return res.status(200).json({
      success: true,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};
