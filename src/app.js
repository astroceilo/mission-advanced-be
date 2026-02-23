import express from "express";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server jalan 🚀");
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("DB ERROR:", error.message);
  }
};

startServer();