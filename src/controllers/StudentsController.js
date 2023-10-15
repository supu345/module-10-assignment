const StudentsModel = require("../models/StudentsModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require("../Utiliy/SendEmailUtility");

// Registration
exports.registration = async (req, res) => {
  let reqBody = req.body;
  try {
    let result = await StudentsModel.create(reqBody);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};
//login
exports.login = async (req, res) => {
  try {
    let reqBody = req.body;
    let result = await StudentsModel.find(reqBody).count();
    if (result === 1) {
      // Create Token
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: reqBody["email"],
      };
      let token = jwt.sign(Payload, "SecretKey123456789");
      res.status(200).json({ status: "success", data: token });
    } else {
      // Login fail
      res.status(200).json({ status: "fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

//update

exports.studentsUpdate = async (req, res) => {
  try {
    let email = req.headers["email"];
    let reqBody = req.body;
    let result = await StudentsModel.updateOne({ email: email }, reqBody);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.deleteStudentProfile = async (req, res) => {
  try {
    let email = req.headers["email"];

    let reqBody = req.body;

    let data = await StudentsModel.deleteOne({ email: email }, reqBody);

    res.status(200).json({
      status: "Success",

      data: data,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",

      data: error.toString(),
    });
  }
};

exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  let OTPCode = Math.floor(100000 + Math.random() * 900000);
  let EmailText = "Your Verification Code is =" + OTPCode;
  let EmailSubject = "Task manager verification code";

  let result = await StudentsModel.find({ email: email }).count();
  if (result === 1) {
    // Verification Email
    await SendEmailUtility(email, EmailText, EmailSubject);
    await OTPModel.create({ email: email, otp: OTPCode });
    res.status(200).json({
      status: "success",
      data: "6 Digit Verification Code has been send",
    });
  } else {
    res.status(200).json({ status: "fail", data: "No User Found" });
  }
};

exports.RecoverVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;
  let statusUpdate = 1;

  let result = await OTPModel.find({
    email: email,
    otp: OTPCode,
    status: status,
  }).count();
  // Time Validation 2 min
  if (result === 1) {
    await OTPModel.updateOne(
      { email: email, otp: OTPCode, status: status },
      { status: statusUpdate }
    );
    res.status(200).json({ status: "success", data: "Verification Completed" });
  } else {
    res.status(200).json({ status: "fail", data: "Invalid Verification" });
  }
};

exports.RecoverResetPass = async (req, res) => {
  let email = req.body["email"];
  let OTPCode = req.body["OTP"];
  let NewPass = req.body["password"];
  let statusUpdate = 1;

  let result = await OTPModel.find({
    email: email,
    otp: OTPCode,
    status: statusUpdate,
  }).count();
  if (result === 1) {
    let result = await StudentsModel.updateOne(
      { email: email },
      { password: NewPass }
    );
    res.status(200).json({ status: "success", data: "Password Reset Success" });
  } else {
    res.status(200).json({ status: "fail", data: "Invalid Verification" });
  }
};
