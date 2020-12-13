let jwt = require('jsonwebtoken');


module.exports = {
    // 生成签名
    sigin: ({ username, _id }) => {
        if (!username || !_id) return;
        console.log('令牌时间');
        return jwt.sign({ username, _id }, '2011', { expiresIn: 60 * 60 * 24 })

    },



    // 校验签名
    verify: token => new Promise((resolve, reject) => {
        // 业务  》 结果 》 调用返回   //2011是个变量
        jwt.verify(token, '2011', (err, decode) => !err ? resolve(decode) : reject(err.message))

        //     jwt.verify(token,'2011' ,(err,decode)=> {
        //         if(!err){
        //             resolve(decode)
        //         }else{
        //             reject(err.message); //校验失败返回的而信息
        //         }
        //     })


    })
}