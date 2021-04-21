const fs = require('fs')
const path = require('path')
const lineReader = require('line-reader')

const readFile = function(p) {
    // join拼接各path
    // resolve相当于cd操作
    let targetPath = path.join(__dirname, p)
    let data = []
    return new Promise((resolve, reject) => {
        /* fs.readFile(targetPath, (err, data) => {
            if (err) throw err
            resolve(data.toString())
        }) */
        // 使用lineReader逐行读取文件 @param{last: Boolean}
        lineReader.eachLine(targetPath, (line, last) => {
            data.push(line)
            if (last) {
                resolve(data)
            }
        })
    })
}

const writeFile = function(p, c) {
    let targetPath = path.join(__dirname, p)
    return new Promise(async (resolve, reject) => {
        let pre =await new Promise((res, rej)=>{
            fs.readFile(targetPath, (err, data)=>{
                if (err) console.log(err);
                res(data.toString())
            })
        })
        let content = pre + '\n' + c
        fs.writeFile(targetPath, content, {
            encoding: 'utf8'
        }, err => {
            if(err) console.log(err);
            console.log('写入成功');
        })
    })
}

const getAllMeterInfo = async function(ctx) {
    console.log('call the function: getAllMeterInfo');
    rawData = await readFile('../database/allMeterInfo.txt')
    let data = rawData.reduce((prev, curr) => {
        let dataItemList = curr.split(' ')
        prev.push({
            filename: dataItemList[1],
            date: dataItemList[2],
            status: dataItemList[3],
            result: dataItemList[4]
        })
        return prev
    }, [])
    data.shift()
    console.log(rawData);
    ctx.body = {
        status: '200',
        data: data
    }
}

const getMeterDetails = async function(ctx) {
    console.log('call the function: getMeterDetails')
    // console.log(ctx.query); ctx.request.query
    targetId = parseInt(ctx.query.id)
    let rawAbstractData = await readFile('../database/allMeterInfo.txt')
    let rawDetailData = await readFile('../database/meterDetails.txt')
    absData = rawAbstractData[targetId].split(' ')
    detData = rawDetailData[targetId].split(' ')
    detData.shift()
    let detDataObj = {}
    detData.forEach((item, index) => {
        detDataObj[`pre${index+1}`] = item
    })
    ctx.body = {
        status: 200,
        data: {
            absData: {
                filename: absData[1],
                date: absData[2],
                status: absData[3],
                result: absData[4]
            },
            detData: {
                ...detDataObj
            }
        }
    }
}

const uploadImage = async function(ctx) {
    console.log('call the function uploadImage');
    // 文件的上传不能像普通参数一样ctx.request.body获取，需要使用koa-body
    const file = ctx.request.files.file
    /*  另一种方法
        创建可读流 
        const reader = fs.createReadStream(file.path);
        const writer = fs.createWriterStream('upload/img.png')
        reader.pipe(writer) //可读流通过管道写入可写流
    */
    console.log(file.path)
    let preData = await readFile('../database/allMeterInfo.txt')
    let id = preData.length,
        name = file.name,
        d = new Date(),
        date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        status = 'pending',
        result = 'NaN';
    console.log(`${id} ${name} ${date} ${status} ${result}`);
    writeFile('../database/allMeterInfo.txt', `${id} ${name} ${date} ${status} ${result}`)
    ctx.body = {
        status: 200
    }
}

module.exports = {
    getAllMeterInfo,
    getMeterDetails,
    uploadImage
}