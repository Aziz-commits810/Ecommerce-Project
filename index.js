const express = require("express");
const { sequelize, connectDb } = require("./Config/database");
const User = require("./Model/userModel");
const transporter = require("./Config/emailConfig");
const profileRoutes = require("./Router/profileRouter");
const Association = require("./Association/association");
const bcrypt = require("bcrypt");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const orderRoutes = require("./Router/orderRoutes");
const userRoutes = require("./Router/userRoutes");
const productRoutes = require("./Router/productRouter");
const cartRoutes = require("./Router/cartRouter");
const app = express();
require("dotenv").config();
const port = 4000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//passport
app.use(passport.initialize());

//routerss
app.use("/api/auth", userRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Ecommerce Application ");
});
connectDb();

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
