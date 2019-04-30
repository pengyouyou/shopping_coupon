// 云函数模板
// 部署：在 cloud-functions/getPalettes 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const dbdata = require(`dbdata`)

// 初始化 cloud
cloud.init({
	env: 'release-7i3hm'
})

const db = cloud.database()
const MAX_LIMIT = 20

addOne = (item) => {
	// 新增一条记录
	return new Promise((resolve, reject) => {
		db.collection('palettes').add({
			// 注意：data 字段表示需新增的 JSON 数据
			data: item
		}).then(res => {
			// {_id: "988c1b1b5cc1176d063d10d464612e8d", errMsg: "collection.add:ok"}
			console.log(`palettes [新增记录] success, title: ${item.title}, _id: ${res._id}`)
			resolve(res)
		}).catch(err => {
			console.error(`palettes [新增记录] failed, title: ${item.title}`, err)
			reject(err)
		})
	})
}

exports.main = async(event, context) => {
    console.log(event, context)

	
	const tasks = []
	let data = dbdata
	let total = data.length
	let results = { data: [], errMsg: [] }

	console.log('total:', total)

	// 计算需分几次取
	const batchTimes = Math.ceil(total / MAX_LIMIT)

	for (let k = 0; k < batchTimes; k++) {
		// 承载所有读操作的 promise 的数组
		let tasks = []
		for (let i = 0; i < MAX_LIMIT; i++) {
			let idx = k * MAX_LIMIT + i
			if (idx >= total) break

			let item = data[idx]
			item["uptime"] = db.serverDate()

			// 新增一条记录
			const promise = addOne(item)
			tasks.push(promise)
		}

		// 等待所有
		results = (await Promise.all(tasks)).reduce((acc, cur, idx) => {
			// console.log(acc, cur, idx)
			return {
				data: acc.data.concat(cur._id),
				errMsg: acc.errMsg.concat(cur.errMsg)
			}
		}, results)
		console.log('cur round: ', tasks.length, 'cur total: ', results.data.length)

		// results.data = results.data.concat(res.data)
		// results.errMsg = results.data.concat(res.errMsg)
	}

    return {
        event,

        total,
		ids_length: results.data.length,
		ids: results.data
    }
}