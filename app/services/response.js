// status and message only
const responsestatusmessage = (res, status, message) => {
  return res.status(200).send({ status: status, message: message });
};

// status , message and data only
const responsestatusdata = (res, status, message, data) => {
  return res.status(200).send({ status: status, message: message, data: data });
};

// status , message , data and token
const responsestatusdatatoken = (res, status, message, data , token) => {
  return res.status(200).send({ status: status, message: message, data: data , api_token : token });
};

module.exports = {responsestatusdata, responsestatusdatatoken, responsestatusmessage};
