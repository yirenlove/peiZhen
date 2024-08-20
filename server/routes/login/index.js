const express = require("express");
const send = require("./sendCode");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.end("hi");
});

router.post("/getCode", (req, res, next) => {
  const email = req.body.email;
  try {
    send(email);
  } catch (e) {
    res.send({ code: -1, msg: "服务器出错" });
  }
});

router.post("/signUp", (req, res, next) => {});
module.exports = router;
