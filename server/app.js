const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const express = require("express");
const login = require('./routes/login')
const { log } = require("debug/src/browser");
const stroeMap = new Map()
const app = express();
app.use(login)
app.use(express.urlencoded({ extended: true }));
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "3166925965@qq.com",
    pass: "ibhrrrclnpqcdcfa",
  },
});
function verifyCode(len) {
  let code = ''
  for (let i = 0; i < len; i++) {
    code+=Math.floor(Math.random() * 10).toString()
  }
  return code
}
app.post("/register", (req, res) => {
    const mail = req.body.mail
    const code = verifyCode(6)
    stroeMap.set(mail,code)   
    main(mail,code)
    res.end('发送成功') 
});
app.post('/submit',(req,res,next)=>{
   const {code,mail} = req.body
   req.mail = mail
   req.code = code
   next()
},verify)
app.post('/verify',(req,res)=>{
  try {
    jwt.verify(req.body.token, "ssAndXieSecret");
    res.end('验证成功')
  } catch (e) {
    if(e instanceof jwt.TokenExpiredError){
      res.end("token过期");
    }
    else res.end('token无效')
  } 
  
})
// async..await is not allowed in global scope, must use a wrapper
async function main(mail,code) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"<3166925965@qq.com>', // sender address
    to: `${mail}`, // list of receivers
    subject: "注册验证码", // Subject line
    text: `您的验证码是${code},仅5分钟内有效`, // plain text body
    html: `<b>您的验证码是${code},仅5分钟内有效</b>`, // html body
  });
  setTimeout(() => {
    stroeMap.delete(mail)
  },1000*60*5);
}

function verify(req,res){
  const correctCode = stroeMap.get(req.mail)
  if(correctCode){
    if (correctCode === req.code){
      res.send(jwt.sign({id:'1',mail:req.mail},'ssAndXieSecret',{algorithm:'HS512',expiresIn:'5min'}))
    } else {
      res.end("验证码错误");
    }
  } else {
    res.end('验证码已过期')
  }
}

app.listen(3000, () => {
  console.log("server is running on port 3000");
});