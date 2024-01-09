const responsestatusmessage = require("../services/response");

function globalerrorcatcher(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err.statusCode, err.status , err.message);
  responsestatusmessage(res, false, err.message);
}

module.exports = globalerrorcatcher;
