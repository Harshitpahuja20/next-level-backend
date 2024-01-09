const mongoose = require("mongoose");
const url = process.env.DB_URL;

async function connectToDb() {
  await mongoose
    .connect(url)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log(err.message));
}

module.exports = connectToDb;
