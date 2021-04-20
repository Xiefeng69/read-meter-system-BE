const Koa = require('koa')
const path = require('path')

const app = new Koa()
const koabody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')  // koa-cors用于解决CORS问题的中间件

const publicRouter = require('./routes/public')
const privateRouter = require('./routes/private')
const corsHandler = require('./middleware/cors')


// middlewares: 使用app.use(middleware)注册并添加中间件
// 解析请求body

app.use(bodyParser())
app.use(koabody({
    multipart: true, // 支持文件格式
    formidable: {
        // 上传目录
        uploadDir: path.join(__dirname, './static'),
        // 保留文件扩展名
        keepExtensions: true,
    }
}));


// 解决cors
app.use(cors(corsHandler));

// 配置routes
app.use(publicRouter.routes(), publicRouter.allowedMethods())
app.use(privateRouter.routes(), privateRouter.allowedMethods())

module.exports = app
