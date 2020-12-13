// 替所有api
const decode = require('jsonwebtoken/decode');
let global = require('../../config/global')
let jwt = require('../../utils/jwt')
module.exports = (req, res, next) => {

    // 处理公共参数  address / !address /header

    req.query._page = req.query._page ? req.query._page - 1 : global._page - 0;
    req.query._limit = req.query._limit ? req.query._limit - 1 : global._limit - 0;
    req.query.q = req.query.q ? req.query.q : global.q;
    req.query._sort = req.query._sort ? req.query._sort: global._sort;
  
    req.body._page = req.body._page ? req.body._page - 1 : global._page - 0;
    req.body._limit = req.body._limit ? req.body._limit - 1 : global._limit - 0;
    req.body.q = req.body.q ? req.body.q : global.q;
    req.body._sort = req.body._sort ? req.body._sort: global._sort;
    
    req.headers._page = req.headers._page ? req.headers._page - 1 : global._page - 0;
    req.headers._limit = req.headers._limit ? req.headers._limit - 1 : global._limit - 0;
    req.headers.q = req.headers.q ? req.headers.q : global.q;
    req.headers._sort = req.headers._sort ? req.headers._sort: global._sort;
  


    if (/login|reg|logout/.test(req.url)) {
        next()
    } else {
        // 获取token      //客户端接口请求的每一个接口，都需要校验
        let token = req.headers.token || req.query.token || req.body.token;

        // 校验  解密
        jwt.verify(token).then(
            decode => {
                req.token=decode
                next()
            }
        ).catch(
            message => res.send({ err:2, meg: 'token过期或有误' + message })
        )
    }
};