const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const authRoute = require("./routes/authRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const cors = require("cors");
const path = require("path");

//check
const userSchema = require("./models/userModel");
const productModel = require("./models/productModel");
const categoryModel = require("./models/categoryModel");

dotenv.config();
connectDB();

// app
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static access
app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.get("/", (req, res) => {
  res.send("Heyy gamers");
});

app.get("/check", async (req, res) => {
  const pro = await categoryModel.find();
  res.send(pro);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`.bgCyan);
});
