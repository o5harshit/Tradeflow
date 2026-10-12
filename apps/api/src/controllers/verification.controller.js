import User from "../models/User.js";
import {
  sendEmailOtp,
  verifyEmailOtp,
} from "../services/otp.service.js";

export const verifyOtp = async (req, res, next) => {
  try {
    const user = await verifyEmailOtp(
      req.body.email,
      req.body.otp
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();

    const user = await User.findOne({ email });

    // Avoid revealing whether an email is registered.
    if (user && !user.isVerified) {
      await sendEmailOtp(email);
    }

    return res.status(200).json({
      success: true,
      message:
        "If the account needs verification, an OTP will be sent when permitted.",
    });
  } catch (error) {
    next(error);
  }
};