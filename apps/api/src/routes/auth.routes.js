import express from "express";

import {
  register,
  login,
  logout,
  logoutAll,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { verifyCaptchaMiddleware } from "../middleware/captcha.middleware.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  verifyCaptchaMiddleware,
  register,
);

router.post(
  "/login",
  validate(loginSchema),
  verifyCaptchaMiddleware,
  loginRateLimiter,
  login,
);

router.post("/logout", logout);

router.post("/logout-all", authenticate, logoutAll);

router.get("/me", authenticate, getCurrentUser);

export default router;
