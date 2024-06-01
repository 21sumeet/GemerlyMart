const express = require("express");
const router = express.Router();
const {
  registerController,
  loginContoller,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
} = require("../controllers/registerController.js");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

router.get("/register", (req, res) => {
  res.send("register get vala");
});

//routes
//http://localhost:8080/api/v1/auth/register
router.post("/register", registerController);

//http://localhost:8080/api/v1/auth/login
router.post("/login", loginContoller);

//http://localhost:8080/api/v1/auth/test
router.get("/test", requireSignIn, isAdmin, testController);

//Forgot Password || POST
//http://localhost:8080/api/v1/auth/forgot-password
router.post("/forgot-password", forgotPasswordController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
//update profile
//http://localhost:8080/api/v1/auth/update-profile
router.put("/update-profile", requireSignIn, updateProfileController);

//order
//http://localhost:8080/api/v1/auth/order
router.get("/order", requireSignIn, getOrdersController);

module.exports = router;
