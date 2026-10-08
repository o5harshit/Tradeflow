import express from "express";
import dotenv from "dotenv";


dotenv.config();

app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  

const app = express();
const PORT = process.env.PORT || 8747;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

