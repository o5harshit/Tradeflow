import { randomInt, createHmac, timingSafeEqual } from "node:crypto";

import redis from "../config/redis.js";
import User from "../models/User.js";
import { sendVerificationEmail } from "./email.service.js";

const OTP_TTL_SECONDS = 300;
const OTP_MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

const normalizeEmail = (email) => email.trim().toLowerCase();

const getOtpKeys = (email) => {
  // Hash the email for safer, consistent Redis key names.
  const emailKey = createHmac("sha256", process.env.OTP_HASH_SECRET)
    .update(email)
    .digest("hex");

  return {
    otpKey: `tradeflow:otp:${emailKey}`,
    attemptsKey: `tradeflow:otp-attempts:${emailKey}`,
    cooldownKey: `tradeflow:otp-cooldown:${emailKey}`,
  };
};

const hashOtp = (email, otp) => {
  return createHmac("sha256", process.env.OTP_HASH_SECRET)
    .update(`${normalizeEmail(email)}:${otp}`)
    .digest("hex");
};

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const sendEmailOtp = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  const { otpKey, attemptsKey, cooldownKey } =
    getOtpKeys(normalizedEmail);

  // Prevent repeatedly requesting new OTPs.
  const cooldownSet = await redis.set(
    cooldownKey,
    "1",
    "EX",
    RESEND_COOLDOWN_SECONDS,
    "NX"
  );

  if (cooldownSet !== "OK") {
    throw createError(
      "Please wait before requesting another OTP",
      429
    );
  }

  // Generate a zero-padded six-digit code.
  const otp = randomInt(0, 1_000_000)
    .toString()
    .padStart(6, "0");

  const otpDigest = hashOtp(normalizedEmail, otp);

  try {
    // Store the hash, never the plaintext OTP.
    await redis
      .multi()
      .set(otpKey, otpDigest, "EX", OTP_TTL_SECONDS)
      .set(attemptsKey, "0", "EX", OTP_TTL_SECONDS)
      .exec();

    await sendVerificationEmail(normalizedEmail, otp);
  } catch (error) {
    // Clean up temporary state if issuing the OTP fails.
    await redis
      .del(otpKey, attemptsKey, cooldownKey)
      .catch(() => {});

    throw error;
  }
};

export const verifyEmailOtp = async (email, otp) => {
  const normalizedEmail = normalizeEmail(email);

  const { otpKey, attemptsKey } = getOtpKeys(normalizedEmail);

  const storedDigest = await redis.get(otpKey);

  if (!storedDigest) {
    throw createError("OTP expired or not found", 400);
  }

  const attempts = await redis.incr(attemptsKey);

  if (attempts > OTP_MAX_ATTEMPTS) {
    await redis.del(otpKey, attemptsKey);

    throw createError(
      "Too many verification attempts. Request a new OTP.",
      429
    );
  }

  const submittedDigest = hashOtp(normalizedEmail, otp);

  const matches = timingSafeEqual(
    Buffer.from(storedDigest, "hex"),
    Buffer.from(submittedDigest, "hex")
  );

  if (!matches) {
    throw createError("Invalid OTP", 400);
  }

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { isVerified: true } },
    { new: true }
  );

  if (!user) {
    throw createError("User not found", 404);
  }

  // Make the OTP one-time use.
  await redis.del(otpKey, attemptsKey);

  return user;
};