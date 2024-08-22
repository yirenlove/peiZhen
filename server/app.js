const express = require("express");
const login = require("./routes/login");
const { log } = require("debug/src/node");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
    allowedHeaders: "authorization",
    maxAge: 600,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(login);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
