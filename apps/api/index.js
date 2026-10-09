import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { connectDatabase } from "./src/config/database.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();



app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TradeFlow API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);



app.use((error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
});


const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`TradeFlow API running on port ${PORT}`);
  });
};

startServer();