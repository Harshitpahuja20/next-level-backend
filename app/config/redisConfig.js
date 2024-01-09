const { createClient } = require("redis");
const { exec } = require("child_process");

function executeRedis(){
    exec("redis-server", (error, stdout, stderr) => {
        if (error) {
          console.error(error.message);
          return;
        }
        if (stderr) {
          console.error(stderr);
          return;
        }
        console.log(stdout);
      });
}

const client = createClient();
client.on("error", (err) => {executeRedis , console.log("Redis Client Error", err)});
client.connect().then(()=>{
  console.log("redis Conneted Successfully")
});

const storeOtp = async (email, otp) => {
  try {
    const key = `otp:${email}`;
    await client.set(key, otp);
    const expirationTimeInSeconds = 300; // 3 minutes
    await client.expire(key, expirationTimeInSeconds);
  } catch (error) {
    console.log("Fail to store otp:" + error);
  }
};

const retrieveOtp = async (email) => {
  try {
    const key = `otp:${email}`;
    const value = await client.get(key);
    return value;
  } catch (error) {
    console.log("Fail to retrieve otp:" + error);
  }
};

const storedetails = async (email, details) => {
    try {
      const key = `details:${email}`;
      await client.set(key, JSON.stringify(details));
      const expirationTimeInSeconds = 300; // 3 minutes
      await client.expire(key, expirationTimeInSeconds);
    } catch (error) {
      console.log("Fail to store details:" + error);
    }
  };
  
const retrievedetails = async (email) => {
    try {
      const key = `details:${email}`;
      const value = await client.get(key);
      return JSON.parse(value);
    } catch (error) {
      console.log("Fail to retrieve details:" + error);
    }
  };

module.exports = {client , storeOtp , retrieveOtp , storedetails , retrievedetails}