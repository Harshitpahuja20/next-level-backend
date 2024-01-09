const authController = require("../controllers/auth.controller");
const { fetchuser } = require("../middlewares/fetchUser");
const errCatch = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = (app) => {
  app.post("/sendOtp", errCatch(authController.sendOtp));
  app.post("/createUser", errCatch(authController.createUser));
  app.post("/login", errCatch(authController.login));
  app.post("/resendOtp", errCatch(authController.resendOtp));
  app.post("/verifyOtp", errCatch(authController.verifyOtp));
  app.post("/forgotPassword", errCatch(authController.forgotPassword));
  app.post("/changePassword", fetchuser ,errCatch(authController.changePassword));
};
