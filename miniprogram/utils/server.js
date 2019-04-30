

function getPalettes(param) {
	return new Promise((resolve, reject) => {
		wx.cloud.callFunction({
			name: 'getPalettes',
			data: param
		}).then(res => {
			console.log('[云函数] [getPalettes] res: ', res)
			// this.globalData.openid = res.result.openid
			resolve(res.result)
		}).catch(err => {
			console.error('[云函数] [getPalettes] 调用失败', err)
			reject(err)
		})
	})
}

function getHots(param) {
	return new Promise((resolve, reject) => {
		wx.cloud.callFunction({
			name: 'getHots',
			data: param
		}).then(res => {
			console.log('[云函数] [getHots] res: ', res)
			// this.globalData.openid = res.result.openid
			resolve(res.result)
		}).catch(err => {
			console.error('[云函数] [getHots] 调用失败', err)
			reject(err)
		})
	})
}

module.exports = {
	getPalettes,
	getHots
}
