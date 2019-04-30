// 云函数模板
// 部署：在 cloud-functions/getPalettes 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
	env: 'release-7i3hm'
})

const db = cloud.database()
const MAX_HOTS_COUNT = 7

getRandomList = (total) => {
	let posArray = []

	if (total >= MAX_HOTS_COUNT) {
		do {
			var n = Math.floor(Math.random() * total);//n为随机出现的0-11之内的数值
			for (var i = 0; i < posArray.length; i++) {
				if (n == posArray[i]) {
					/*若n和数组里面的数值有重复，立即跳出函数*/
					break;
				}
			}
			　　　　　　　　/*若n和数组里的数组无重复，那么i和数组的长度是相同的，这样可以避免出现重复的数字*/
			if (i == posArray.length) {
				posArray.push(n);
			}
		} while (posArray.length < MAX_HOTS_COUNT);
	}

	return posArray
}

exports.main = async(event, context) => {
    console.log(event, context)

	const countResult = await db.collection('palettes').count()
	const total = countResult.total

	let indexs = getRandomList(total)

	console.log('total:', total, 'indexs: ', indexs)

	const tasks = []
	if (indexs) {
		for (let i = 0; i < indexs.length; i++) {
			const promise = db.collection('palettes').skip(indexs[i]).limit(1).field({
				_id: true,
				title: true
			}).get()
			tasks.push(promise)
		}
	}

	// 等待所有
	let res = (await Promise.all(tasks)).reduce((acc, cur) => ({
		data: acc.data.concat(cur.data),
		errMsg: acc.errMsg,
	}))
	console.log('res: ', res)

	let pids = []
	let titles = []
	let data = res.data
	for (let i = 0; i < data.length; i++) {
		pids.push(data[i]._id)
		titles.push(data[i].title)
	}
	console.log('pids: ', pids)

	let result = await db.collection('hots').where({
		cate: "hot_day"
	}).update({
		data: {
			pids: pids,
			titles: titles,
			uptime: db.serverDate()
		},
	})

    return {
        event,

        total,
		result,
		pids,
		titles
    }
}