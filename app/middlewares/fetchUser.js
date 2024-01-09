const authModel = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const { responsestatusmessage } = require("../services/response");
const jwt_secret = process.env.JWT_SECRET;

const fetchuser = async (req, res, next) => {
  try {
    const token = req.header("bearer-token");
    if (!token) return responsestatusmessage(res, "fail", "Token not found");
    const decoded = await jwt.verify(token, "SUPER_SECRET");
    const { id } = decoded;
    if (!id) {
      return responsestatusmessage(res, "fail", "Invalid token");
    }
    const user = await authModel.findById(id).select("-__v -createdAt -updatedAt");
    if (!user) {
      return responsestatusmessage(res, "fail", "unAuthorized User");
    }
    req.user = user;
    next();
  } catch (error) {
    return responsestatusmessage(res, "fail", "Invalid token");
  }
};

module.exports = {fetchuser}