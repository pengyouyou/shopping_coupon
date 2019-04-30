// 云函数模板
// 部署：在 cloud-functions/getPalettes 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
	env: 'release-7i3hm'
})

const db = cloud.database()
const MAX_LIMIT = 100
const _ = db.command

exports.main = async(event, context) => {
    console.log(event, context)

	let cate = event.cate || "hot_day"

    // await collect()
    const countResult = await db.collection('hots').where({
		cate: cate
	}).count()

    // 可执行其他自定义逻辑
    // console.log 的内容可以在云开发云函数调用日志查看
	const total = countResult.total
	

	// 计算需分几次取
	const batchTimes = Math.ceil(total / MAX_LIMIT)
	// 承载所有读操作的 promise 的数组
	const tasks = []
	for (let i = 0; i < batchTimes; i++) {
		const promise = db.collection('hots').where({
			cate: cate
		}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
		tasks.push(promise)
	}

	console.log('total:', total)

	// 等待所有
	let res = (await Promise.all(tasks)).reduce((acc, cur) => ({
		data: acc.data.concat(cur.data),
		errMsg: acc.errMsg,
	}))
	console.log('res.data:', res.data)

	let data = [];
	if (res.data && res.data.length > 0) {
		let pids = res.data[0].pids
		console.log('pids:', pids)

		let idxAt = (tid) => {
			for (let k = 0; k < pids.length; k++) {
				if (pids[k] == tid) {
					return k
				}
			}
			return 0
		}

		if (pids && pids.length > 0) {
			const tpromise = db.collection('palettes').where({
				_id: _.in(pids)
			}).limit(MAX_LIMIT).get()

			let tres = await tpromise
			console.log('tres:', tres)

			data = tres.data

			// command.in方法查询出来的结果顺序是乱的，将data结果按照pids里的_id顺序排序
			data.sort( (a, b) => {
				return idxAt(a._id) - idxAt(b._id)
			})
		}
	}

    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
    const wxContext = cloud.getWXContext()
    console.log('wxContext:', wxContext)

    return {
        event: {
			cate: event.cate
		},
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID,

        total,
		data
    }
}