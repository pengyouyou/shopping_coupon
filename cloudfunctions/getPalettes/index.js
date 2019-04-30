// 云函数模板
// 部署：在 cloud-functions/getPalettes 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
	env: 'release-7i3hm'
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
// exports.main = (event, context) => {
//   console.log(event)
//   console.log(context)

//   // 可执行其他自定义逻辑
//   // console.log 的内容可以在云开发云函数调用日志查看

//   // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }

const db = cloud.database()
const MAX_LIMIT = 100
const MAX_SEND = 20

// let plist = []
// let tophrase = 0

// collect = async() => {
//     // let nowtime = new Date().getTime()

//     // console.log('tophrase:', tophrase)
//     // console.log('nowtime:', nowtime)
//     // // 每6小时更新一次
//     // let diff = 6 * 3600000
//     // if (Math.floor(nowtime / diff) == Math.floor(tophrase / diff)) return false

//     // // 更新当前阶段
//     // tophrase = nowtime

//     // 先取出集合记录总数
//     const countResult = await db.collection('palettes').count()
//     const total = countResult.total
//     // 计算需分几次取
// 	const batchTimes = Math.ceil(total / MAX_LIMIT)
//     // 承载所有读操作的 promise 的数组
//     const tasks = []
//     for (let i = 0; i < batchTimes; i++) {
//         const promise = db.collection('palettes').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
//         tasks.push(promise)
//     }

//     console.log('total:', total)

//     // 等待所有
//     let res = (await Promise.all(tasks)).reduce((acc, cur) => ({
//         data: acc.data.concat(cur.data),
//         errMsg: acc.errMsg,
//     }))
//     // console.log('res:', res)
//     plist = res.data

//     return true
// }

exports.main = async(event, context) => {
    console.log(event, context)

    // await collect()
    const countResult = await db.collection('palettes').count()

    // 可执行其他自定义逻辑
    // console.log 的内容可以在云开发云函数调用日志查看
	const total = countResult.total
    let start = event.start || 0
    if (start >= total) start = total - 1
	if (start < 0) start = 0

	let len = event.len || MAX_SEND
	if (len < 0 || len > MAX_SEND) {
		len = MAX_SEND
	}

    if (start + len > total) len = total - start


	// 计算需分几次取
	const batchTimes = Math.ceil(len / MAX_LIMIT)
	// 承载所有读操作的 promise 的数组
	const tasks = []
	for (let i = 0; i < batchTimes; i++) {
		let limit = Math.min(len - i * MAX_LIMIT, MAX_LIMIT)
		const promise = db.collection('palettes').skip(start + i * MAX_LIMIT).limit(limit).get()
		tasks.push(promise)
	}

	console.log('total:', total, 'len:', len)

	// 等待所有
	let res = (await Promise.all(tasks)).reduce((acc, cur) => ({
		data: acc.data.concat(cur.data),
		errMsg: acc.errMsg,
	}))

	let data = res.data
	if (data.length > len) {
		data = data.slice(0, len)
	}

    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
    const wxContext = cloud.getWXContext()
    console.log('wxContext:', wxContext)

    return {
        event: {
			start: event.start,
			len: event.len
		},
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID,

        start,
        len,
        total,
		data,
    }
}