import express from "express";

import {
  register,
  login,
  logout,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";
import { verifyCaptchaMiddleware } from "../middleware/captcha.middleware.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
   verifyCaptchaMiddleware,
  register
);

router.post(
  "/login",
  validate(loginSchema),
  verifyCaptchaMiddleware,
  loginRateLimiter,
  login
);

router.post(
  "/logout",
  logout
);

export default router;