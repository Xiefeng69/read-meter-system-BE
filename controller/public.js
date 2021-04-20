const fs = require('fs')
const path = require('path')
const lineReader = require('line-reader')

const readFile = function(p) {
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
    const file = ctx.request.files.file
    console.log(file.path)
    // // 创建可读流 const reader = fs.createReadStream(file.path);
    ctx.body = {
        status: 200
    }
}

module.exports = {
    getAllMeterInfo,
    getMeterDetails,
    uploadImage
}