var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var multer = require('multer')
var cookieSession = require('cookie-session')
var logger = require('morgan');
let cors = require('cors');

var app = express();

// 设置ejs模板引擎目录
app.set('views', path.join(__dirname, 'views')); // 到views目录下找ejs模板
app.set('view engine', 'ejs'); // 设定后端渲染引擎是ejs


app.use(logger('dev'));// 安装命令行日志
//body-Parser被继承到express内部，配置body-Parser  中间件配置区域
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser());

// multer 的配置
// 上传使用
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url.includes('user')) {
      cb(null, path.join(__dirname, 'public', 'upload', 'user'))
    } else if (req.url.includes('banner')) {
      cb(null, path.join(__dirname, 'public', 'upload', 'banner'))
    } else {
      cb(null, path.join(__dirname, 'public', 'upload', 'product'))
    }

  },
})
let upload = multer({ storage })
app.use(upload.any());  //允许任何文件的上传

app.use(cookieSession({
  name: '2011',
  keys: ["aa", 'bb'],
  maxAge: 1000 * 60 * 60 * 24
}))
// 静态资源托管
app.use(express.static(path.join(__dirname, 'public', "template")));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.use(express.static(path.join(__dirname, 'public')));
// 响应

// 客户端

// let bcrypt = require('./utils/bcrypt');
// // let jwt = require('./utils/jwt');
// app.get('/api/test',(req,res,next)=>{
//   console.log(123);
// // let findList = require('./utils/mongodb').findList;
// let open = require('./utils/mongodb').open
// 测试用
//   // 错误提示：查询不到数据
// findList().then(res=>console.log('1',res)).catch(err=>console.log('2',err))  
// open({collectionName:'list'}).then(res=>console.log(res))
// let token = jwt.sigin({username:'bbbb',_id:"5fd2053a71a792aeaf63c46f"})
// console.log('返回的token',token);
// jwt.verify(token).then(res=>console.log(2,res)).catch(err=>console.log('3',err))
// let hash = bcrypt.hash('alex123')
// console.log(1,hash);
// let result = bcrypt.compare('alex123','$2b$10$x8NWEImEx/VXFDtgcWnL4utXpvRDT4QfTv2PxW0S6oH5Xk86uoj5y');
// console.log(2,result); //返回true则通过

// // console.log(req.query._page,req.body._limit, req.headers._sort, req.query.q);

// // console.log(req.token);
// })

// 客户端
// 登录
app.use('/api/login', require('./routes/api/login'));
app.use('/api/reg', require('./routes/api/reg'));

app.all('/api/*', require('./routes/api/params'));
app.use('/api/user', require('./routes/api/user'));

// app.use('/api/home', require('./routes/api/home'));

app.use('/api/list',require('./routes/api/list'))

app.use('/api/follow', require('./routes/api/follow'));
app.use('/api/column', require('./routes/api/column'));

app.use('/api/lunbo', require('./routes/api/lunbo'));
// 注册

//短信验证接口
// app.use('/message/send-code',require('./routes/message/send-code'))


app.use(cors({
  //允许所有前端域名
  "origin": ["http://127.0.0.1:8054"],  
  "credentials":true,//允许携带凭证
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
  "allowedHeaders":['Content-Type','Authorization']//被允许的post方式的请求头
}));



// 管理端                      路由
app.use('/admin/', require('./routes/admin/index'));
app.use('/admin/users', require('./routes/admin/users'));
app.use('/admin/banner', require('./routes/admin/banner'));


// 代理端
// app.use('/proxy/home', require('./routes/proxy/home'));
// 推送端



// 处理错误
app.use(function (req, res, next) {
  next(createError(404));
});

// 处理错误信息，在响应体上的参数
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);

  if (req.url.includes('/api')) {
    res.send({
      err: 1, msg: '不存在的接口'  // 前端渲染页面
    })
  } else if (req.url.includes('/admin')) {
    res.render('error') // 后端渲染错误页面
  } else {
    res.sendFile(path.join(__dirname, 'public', 'template', '404.html'))
  }
  res.render('error');  //render 是后端渲染错误页面方法
});



module.exports = app;
