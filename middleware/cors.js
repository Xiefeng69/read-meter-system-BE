// let exports = module.exports;
// 不能直接将exports指向一个值，这样会切断exports和module.exports的联系
exports.corsHandler = {
    origin: function() {
        return '*';  //默认为*
    },
    allowMethods: ['GET', 'POST', 'OPTION'],
    allowHeaders: ['Content-type']
}