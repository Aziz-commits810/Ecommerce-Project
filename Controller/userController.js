const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const transporter = require("../Config/emailConfig");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//signup
const signup = async (req, res) => {
  console.log("bod ", req.body);
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    return res
      .status(201)
      .json({ message: "signup successfully", User: newUser });
  } catch (error) {
    console.error(error);
    return res.status(501).json({ message: "internal server error" });
  }
};

//login

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "wrong password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "login successful",
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

//forget password

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("i am here");
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    console.log("otp ", otpExpiration);

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();
    // console.log(user);

    const e = await transporter.sendMail({
      from: "au7918316@gmail.com",
      to: email,
      subject: "reset the otp",
      text: `Your OTP for password reset is ${otp} It is valid for 10 minutes`,
    });
    console.log("I am here");
    console.log(e);

    // console.log("OTP sent to:", email);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
//verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email, otp } });
    if (!user) {
      return res.status(400).json({ message: "not valid otp" });
    }
    if (new Date() > user.otpExpiration) {
      return res.status(400).json({ message: "expired otp" });
    }
    res
      .status(200)
      .json({ message: "otp verified, you can now reset your password" });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
//Reset Password

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
//update password
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updatePassword,
};
