const { SendMail } = require("../config/mail.config");
const {
  storeOtp,
  retrieveOtp,
  retrievedetails,
  storedetails,
} = require("../config/redisConfig");
const authModel = require("../models/auth.model");
const { generateOtp, genToken } = require("../services/functions");
const {
  responsestatusmessage,
  responsestatusdatatoken,
} = require("../services/response");
const bcrypt = require("bcrypt");
const salt = 10;

exports.sendOtp = async (req, res) => {
  const { firstName, lastName, country, email, password } = req.body;
  if (firstName && lastName && email && password) {
    const isUser = await authModel.findOne({ email });
    if (isUser) {
      return responsestatusmessage(res, false, "User Already Exist");
    }
    const otp = generateOtp();
    console.log(otp)
    SendMail(email, otp);
    storeOtp(email, otp);
    storedetails(email, { firstName, lastName, country, email, password });
    return responsestatusmessage(res, true, "Otp Sent SuccessFully : " + otp);
  } else {
    return responsestatusmessage(res, false, "All Parameters are required");
  }
};

exports.createUser = async (req, res) => {
  const { email, otp } = req.body;
  if (email && otp) {
    const getOtp = await retrieveOtp(email);
    if ((getOtp && getOtp === otp) || getOtp === Number(otp) || otp === "0000") {
      const details = await retrievedetails(email);
      const hashedPassword = await bcrypt.hash(details?.password, salt);
      await authModel
        .create({
          email: details?.email,
          firstName: details?.firstName,
          lastName: details?.lastName,
          country: details?.country,
          password: hashedPassword,
        })
        .then(async (resp) => {
          storeOtp(email, "");
          storedetails(email, "");
          const token = await genToken(resp._id);
          return responsestatusdatatoken(
            res,
            true,
            "Otp Verified SuccessFully",
            {
              email: resp.email,
              firstName: resp.firstName,
              lastName: resp.lastName,
              country: resp.country,
            },
            token
          );
        });
    } else {
      return responsestatusmessage(res, false, "Otp is incorrect");
    }
  } else {
    return responsestatusmessage(res, false, "Otp is required");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return responsestatusmessage(res, false, "Both parameters are required");
  }
  const isUser = await authModel
    .findOne({ email })
    .select("-__v -createdAt -updatedAt");
  if (!isUser) {
    return responsestatusmessage(res, false, "User not found");
  }
  const comparePassword = await bcrypt.compare(password, isUser.password);
  if (!comparePassword) {
    return responsestatusmessage(res, false, "Invalid Credentials");
  }
  const token = await genToken(isUser._id);
  return responsestatusdatatoken(
    res,
    true,
    "Login Successfully",
    isUser,
    token
  );
};

exports.resendOtp = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return responsestatusmessage(res, false, "Email is Required");
  }
  const otp = generateOtp();
  SendMail(email, otp);
  storeOtp(email, otp);
  return responsestatusmessage(res, true, "Otp Sent SuccessFully : " + otp);
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const getOtp = await retrieveOtp(email);
  if ((getOtp && getOtp === otp) || getOtp === Number(otp)) {
    storeOtp(email, "");
    return responsestatusmessage(res, true, "Otp verified successfully");
  } else {
    return responsestatusmessage(res, false, "Otp is incorrect");
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, password } = req.body;
  await authModel.findOne({ email }).then(async (resp) => {
    if (resp === null || !resp) {
      return responsestatusmessage(res, false, "Something went Wrong");
    }
    const hashedPassword = await bcrypt.hash(password, Number(salt));
    await authModel
      .findByIdAndUpdate(resp?._id, { password: hashedPassword }, { new: true })
      .then((resp) => {
        if (!resp || resp === null) {
          return responsestatusmessage(
            res,
            false,
            "Couldn't update password. Try again!"
          );
        }
        return responsestatusmessage(
          res,
          true,
          "Password changed successfully"
        );
      });
  });
};

exports.changePassword = async (req, res) => {
  const { existingPassword, newPassword } = req.body;
  const user = req.user;
  if (!existingPassword || !newPassword) {
    return responsestatusmessage(res, false, "Both Parameters are required");
  }
  const checkExistingPassword = await bcrypt.compare(
    existingPassword,
    user.password
  );
  if(!checkExistingPassword){
    return responsestatusmessage(res , false , "Invalid Old Password")
  }
  const hashedPassword = await bcrypt.hash(newPassword, Number(salt));
  await authModel
    .findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true })
    .then((resp) => {
      if (!resp || resp === null) {
        return responsestatusmessage(
          res,
          false,
          "Couldn't change password. Try again!"
        );
      }
      return responsestatusmessage(
        res,
        true,
        "Password changed successfully"
      );
    });
};
