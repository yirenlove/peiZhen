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
  username: { type: String, required: true,unique:true},
  password: { type: String, required: true },
  role:{type:String,default:'user'},
  createAt: { type: Date, default: Date.now},
  active:{type:Boolean,default:true},
  nickName:{type:String,default:'用户昵称'}
});
const user = mongoose.model("user", userSchema);


async function storeCode(email, code) {
  if (mongoose.connection.readyState !== 1) return;
  await emailVerifyCodeModel.create({ email, code });
}

async function getCode(email) {
  if (mongoose.connection.readyState !== 1) return;
  return await emailVerifyCodeModel.findOne({ email }).exec()
}

async function createUser(username, password ) {
  if (mongoose.connection.readyState !== 1) return;
  await user.create({ username, password });
  emailVerifyCodeModel.deleteOne({email:username})
}

async function verifyUser(username,password) {
  if (mongoose.connection.readyState !== 1) return;
  return await user.findOne({ username,password }).then(res=>{
    if(!!!res) return { code: -1, msg: "用户名或密码错误" };
      const email = res.username
      const role = res.role
      const active = res.active
      const sign = jwt.sign({ email,role,active }, "ssAndxieSecret", {
        algorithm: "HS512",
        expiresIn: "1h",
      });
      return {code:1000,msg:'登录成功',data:{
        token:sign
      }}
  })
}

module.exports = { storeCode, getCode, createUser, verifyUser };
