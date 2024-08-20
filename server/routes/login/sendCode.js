const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "3166925965@qq.com",
    pass: "ibhrrrclnpqcdcfa",
  },
});
// create code 
function verifyCode(len) {
  let code = "";
  for (let i = 0; i < len; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}
// async..await is not allowed in global scope, must use a wrapper
async function main(mail) {
    const code = verifyCode(6);
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"<3166925965@qq.com>', // sender address
    to: `${mail}`, // list of receivers
    subject: "注册验证码", // Subject line
    text: `您的验证码是${code},仅5分钟内有效`, // plain text body
    html: `<b>您的验证码是${code},仅5分钟内有效</b>`, // html body
  });
}

module.exports = main