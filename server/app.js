const express = require("express");
const connect = require("./utils/db");
const login = require("./routes/login");
const permissions = require("./routes/permission");
const cors = require("cors");
const app = express();
connect()
app.use(
  cors({
    origin: "*",
    allowedHeaders: "authorization,content-type",
    maxAge: 600,
  })
);


app.use(express.json());
app.use(login);
app.use(permissions)
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
