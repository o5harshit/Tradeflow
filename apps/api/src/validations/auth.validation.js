import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(8, "Password must contain at least 8 characters"),

  captchaToken: z.string().min(1, "CAPTCHA verification is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),

  captchaToken: z.string().min(1, "CAPTCHA verification is required"),
});
