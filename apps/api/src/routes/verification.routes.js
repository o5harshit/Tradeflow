import express from "express";

import {
  verifyOtp,
  resendOtp,
} from "../controllers/verification.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  verifyOtpSchema,
  resendOtpSchema,
} from "../validations/verification.validation.js";

const router = express.Router();

router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  verifyOtp
);

router.post(
  "/resend-otp",
  validate(resendOtpSchema),
  resendOtp
);

export default router;