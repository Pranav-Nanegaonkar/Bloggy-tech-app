const bcrypt = require("bcryptjs");
let hashedPwd;
async function genHashPwd(pwd) {
  const salt = await bcrypt.genSalt(10); //ie 2^10 = 1024F
  console.log("Salt: ", salt);
  hashedPwd = await bcrypt.hash(pwd, salt);
  console.log("password : ", pwd);
  console.log("Hassed: ", hashedPwd);
}
async function comparePwd(pwd) {
  const result = await bcrypt.compare(pwd, hashedPwd);
  console.log(result);
}
async function run() {
  const pwd = "pranav";
  await genHashPwd(pwd);
  await comparePwd(pwd);
}

run();
