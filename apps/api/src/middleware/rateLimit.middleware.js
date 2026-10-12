import { RateLimiterRedis } from "rate-limiter-flexible";

import redis from "../config/redis.js";

const loginLimiter = new RateLimiterRedis({
  storeClient: redis,

  keyPrefix: "tradeflow:login",

  points: 5,

  duration: 60,

  blockDuration: 300,
});

export const loginRateLimiter = async (req, res, next) => {
  try {
    const key = req.ip;

    await loginLimiter.consume(key);

    next();
  } catch (error) {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  }
};