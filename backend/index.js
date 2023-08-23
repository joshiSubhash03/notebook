const express = require("express");
const env = require("dotenv").config();
const port = process.env.PORT;
const router = require("./routers/userRouter");
const app = express();
const connectDB = require("./config/db");

connectDB();

app.use(express.json());

app.use("/", router);
app.listen(port, () => {
  console.log(`server connted on port ${port}`);
});
