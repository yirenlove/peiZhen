const { log } = require("debug/src/node");
const mongoose = require("mongoose");
log
async function main() {
  mongoose.connection.once("open", () => {
    log("数据库连接成功");
  });
  mongoose.connection.once("close", () => {
    log("数据库关闭");
  });
  // 等待连接mongoDB
  await mongoose.connect("mongodb://127.0.0.1:27017/ddpg");
}
module.exports = main;
