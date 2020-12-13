let bcrypt = require('bcrypt')
//  bcrypt.hashSync(明文密码，加密层级)
// bcrypt/compareSync(客户端传过来的明文密码，加密过的密码)
module.exports={
    // hash:password=>bcrypt.hashSync(password,加密层级)
    hash:password=>bcrypt.hashSync(password,10), // 加密
    compare:(password,hash)=>bcrypt.compareSync(password,hash)
}
