const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { log } = require("debug/src/node");
// 创建 schema
const emaiVerifyCodeSchema = new mongoose.Schema({
  email: { type: String, required: true,unique:true,index:true },
  code: { type: String, required: true },
  createAt: { type: Date, default: Date.now, expires: 300 },
});
// 通过schema 创建 model
const emailVerifyCodeModel = mongoose.model(
  "emailVerifyCode",
  emaiVerifyCodeSchema
);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true,unique:true,index:true },
  password: { type: String, required: true },
});
const user = mongoose.model("user", userSchema);

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
main();
async function storeCode(email, code) {
  if (mongoose.connection.readyState !== 1) return;
  await emailVerifyCodeModel.create({ email, code });
}

async function getCode(email) {
  log('enter getcode')
  if (mongoose.connection.readyState !== 1) return;
  return await emailVerifyCodeModel.findOne({ email }).exec()
  
}

async function createUser(username, password ) {
  if (mongoose.connection.readyState !== 1) return;
  await user.create({ username, password });
}

async function verifyUser(username,password) {
  if (mongoose.connection.readyState !== 1) return;
  return await user.findOne({ username }).then(res=>{
    const { username: email, password: passw } = res;
    if(email==username&&passw==password) {
      const sign = jwt.sign({ mail: email}, "ssAndxieSecret", {
        algorithm: "HS512",
        expiresIn: "5min",
      });
      return {code:1000,msg:'登录成功',data:sign}
    }
    else {
      return {code:-1,msg:'用户名或密码错误'}
    }
  })
}

module.exports = { storeCode, getCode, createUser, verifyUser };
