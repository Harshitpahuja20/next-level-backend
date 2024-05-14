require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const connectToDb = require("./app/config/db");
const globalerrorcatcher = require("./app/middlewares/globalErrorCatch");
const authRoutes = require("./app/routes/auth.routes");
const PORT = process.env.PORT;
connectToDb();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(globalerrorcatcher);
app.use(cors());
require("./app/routes/auth.routes")(app)

app.get("/", (req, res) => {
  res.send("Swagat hain");
});

server.listen(PORT, () => {
  console.log("Server is listening on : http://localhost:" + PORT);
});
