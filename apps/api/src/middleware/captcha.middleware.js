import { verifyCaptcha } from "../services/captcha.service.js";

export const verifyCaptchaMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const { captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "CAPTCHA verification is required",
      });
    }

    const isValid = await verifyCaptcha(
      captchaToken,
      req.ip // this is optional we can also remove this 
    );

    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: "CAPTCHA verification failed",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};