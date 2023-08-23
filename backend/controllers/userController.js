const User = require("../models/usermodel");
const OTP = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

//REGISTER USER

const signUP = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "please fill user name" });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: "please fill user email" });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "please fill user password" });
  }

  try {
    const userData = await User.findOne({ email: req.body.email });
    if (!userData) {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      res.status(200).json(user);
    } else {
      return res.status(400).json("user already exist");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//LOGIN USER

const loginUser = async (req, res) => {
  if (!req.body.email) {
    return res.status(401).json("fill username");
  }

  if (!req.body.password) {
    return res.status(401).json("fill password");
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("user not found");
    }
    if (req.body.email !== user.email) {
      return res.status(401).json("username not valid");
    }
    if (req.body.password !== user.password) {
      return res.status(401).json("incorrect password");
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.jwtSec
    );

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

//FORGET PASSWORD

const forgotPassword = async (req, res) => {
  try {
    let otp = Math.floor(Math.random() * 9000 + 1000);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json("no user found");
    }

    let EmailTemplate = `<div> <h3> Your Verification Code Is ${otp}<h3/> </div>`;
    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.email,
      subject: "Forget Password - OTP Verification",
      text: `${otp}`,
      html: EmailTemplate,
    };
    await OTP.create({
      user_id: user._id,
      otp: otp,
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent successfully!");
      }
    });
    return res.status(200).send({ success: true });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// CHANGE PASSWORD

const changePassword = async (req, res) => {
  try {
    if (!req.body.password || !req.body.otp) {
      return res
        .status(400)
        .json("Please provide all the information such as password and otp");
    } else {
      const user = await OTP.find({
        user_id: req.body.user_id,
        otp: req.body.otp,
      });

      if (user.length === 0) {
        return res.status(400).json("No user found, please try again");
      } else {
        await User.findByIdAndUpdate(
          { _id: req.body.user_id },
          { $set: req.body },
          { new: true }
        );
      }
    }
    return res.status(200).json("password succesfully updated");
  } catch (error) {}
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { signUP, loginUser, forgotPassword, changePassword, logout };
