import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
});