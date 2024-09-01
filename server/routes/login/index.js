const express = require("express");
const send = require("./sendCode");
const store = require("./store");
const { log } = require("debug/src/node");
const router = express.Router();

router.post("/getCode", (req, res, next) => {
  const email = req.body.email;
  try {
    send(email).then((code) => {
      store.storeCode(email, code);
      res.status(200).send({
        code: 1000,
        msg: "发送成功",
      });
    });
  } catch (e) {
    res.send({ code: -1, msg: "服务器出错" });
  }
});

router.post("/signUp", (req, response, next) => {
  const { email, passw, code } = req.body;
  log(email, passw, code);
  store.getCode(email).then((res) => {
    if (res) {
      if (res.email === email && res.code === code) {
        store.createUser(email, passw).then((result) => {
          response.send({
            code: 1000,
            msg: "注册成功",
          });
        });
      }
    } else {
      response.send({
        code: -1,
        msg: "验证码超时",
      });
    }
  });
});

router.post("/login", (req, resp, next) => {
  const { email, passw } = req.body;
  log(email, passw);
  store.verifyUser(email, passw).then((res) => {
    resp.send(res);
  });
});
module.exports = router;
