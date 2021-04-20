const Koa = require('koa')

const app = new Koa()
const bodyparser = require('koa-bodyparser')()
const cors = require('koa-cors')  // koa-cors用于解决CORS问题的中间件

const publicRouter = require('./routes/public')
const privateRouter = require('./routes/private')
const corsHandler = require('./middleware/cors')


// middlewares: 使用app.use(middleware)注册并添加中间件
// 解析请求body
app.use(bodyparser);

// 解决cors
app.use(cors(corsHandler));

// 配置routes
app.use(publicRouter.routes(), publicRouter.allowedMethods())
app.use(privateRouter.routes(), privateRouter.allowedMethods())

module.exports = app
