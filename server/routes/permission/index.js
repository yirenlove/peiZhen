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

router.get("/getPermissionList", (req, resp, next) => {
  const { pageNumber, pageSize } = req.body;
  manegePer.getPermissionList(pageNumber, pageSize).then((res) => {
    manegePer.getPermissionListTotal().then((conseq) => {
      resp.send({
        code: 1000,
        msg: "获取成功",
        data: {
          list: res,
          total: conseq[0].cnt,
        },
      });
    });
  });
});

router.get("/getPermissions", (req, resp, next) => {
  const token = req.headers.authorization;
  const res = manegePer.getPermissions(token);
  res.then((res) => {
    resp.send(res);
  });
});

module.exports = router;
