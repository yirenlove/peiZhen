const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { log } = require("debug/src/node");
const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: { type: String, required: true },
  permissionsName: String,
  permissionsId: String,
});

const permission = mongoose.model("permission", permissionSchema);

function addPermission(name, permissions) {
  permission.findOne({ name }).then((res) => {
    const routerList = [];
    const permissionsName = [];
    if (permissions.includes("1")) {
      routerList.push({
        path: "dashboard",
        meta: { name: "控制台", path: "/dashboard", id: 1 },
      });
      permissionsName.push("控制台");
    }
    if (permissions.includes("2")) {
      routerList.push({
        path: "auth",
        meta: { name: "权限管理", path: "/auth", id: 2 },
      });
      permissionsName.push("权限管理");
      if (permissions.includes("3")) {
        routerList.at(-1).children = [
          {
            path: "admin",
            meta: { name: "账号管理", path: "/auth/admin", id: 1 },
          },
        ];
        permissionsName.push("账号管理");
      }
      if (permissions.includes("4")) {
        if (routerList.at(-1).children === undefined)
          routerList.at(-1).children = [];
        routerList.at(-1).children.push({
          path: "role",
          meta: { name: "角色管理", path: "/auth/role", id: 2 },
        });
        permissionsName.push("角色管理");
      }
    }
    if (permissions.includes("5")) {
      routerList.push({
        path: "vppz",
        meta: { name: "陪诊人员", path: "/vppz", id: 3 },
      });
      permissionsName.push("陪诊人员");
      if (permissions.includes("6")) {
        routerList.at(-1).children = [
          {
            path: "order",
            meta: { name: "订单管理", path: "/vppz/order", id: 1 },
          },
        ];
        permissionsName.push("订单管理");
      }
      if (permissions.includes("7")) {
        if (routerList.at(-1).children === undefined)
          routerList.at(-1).children = [];
        routerList.at(-1).children.push({
          path: "staff",
          meta: { name: "陪护管理", path: "/vppz/staff", id: 2 },
        });
        permissionsName.push("陪护管理");
      }
    }
    if (res === null) {
      permission.create({
        name,
        permissions: JSON.stringify(routerList),
        permissionsId: JSON.stringify(permissions),
        permissionsName:JSON.stringify(permissionsName),
      });
    } else {
      permission
        .updateOne(
          { name },
          {
            name,
            permissions: JSON.stringify(routerList),
            permissionsId: JSON.stringify(permissions),
            permissionsName: JSON.stringify(permissionsName),
          }
        )
        .exec();
    }
  });
}

function getPermissionList(pageNumber, pageSize) {
  return permission
    .aggregate()
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize)
    .project("-__v -permissions")
    .then((res) => {
      return res;
    });
}
function getPermissionListTotal () {
  return permission.aggregate().count('cnt').then(res=>{
    return res
  })

}
async function getPermissions(token) {
  const res = { code: 1000, msg: "成功", data: {} };
  try {
    const josnRes = jwt.verify(token, "ssAndxieSecret");
    const queryRes = await permission.findOne({name:josnRes.role}).exec()
    res.data.permissions = queryRes.permissions
    return res
  } catch (e) {
    if (e == jwt.TokenExpiredError) {
      res.code = -2;
      res.msg = "token过期，重新登陆";
      return res;
    }
    res.code = -1
    res.msg = '出错了'
    return res
  }
}

module.exports = { addPermission, getPermissionList, getPermissions,getPermissionListTotal };
