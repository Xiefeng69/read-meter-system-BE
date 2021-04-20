// 路由中间件: koa-router
// 路由工作原理：注册路由->匹配路由->执行匹配对应的函数
const router = require('koa-router')()
router.prefix('/public') //设定该路由的路由前缀

const { getAllMeterInfo, getMeterDetails } = require("../controller/public.js")

router.get('/', getAllMeterInfo)
router.get('/meter-details', getMeterDetails)

module.exports = router
