const express = require("express");
const manegePer = require("./permissionManage");
const { log } = require("debug/src/node");
const router = express.Router();

router.post("/addPermission", (req, resp, next) => {
  const { name, permissions } = req.body;
  log(name, permissions, req.body);
  manegePer.addPermission(name, permissions);
  resp.send({
    code: 1000,
    msg: "添加或者修改成功",
  });
});

module.exports = router;
