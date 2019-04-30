const app = getApp()
const server = require('../../utils/server')

// 页面最少要求显示条数
const MIN_COUNT = 10

Page({

	/**
     * 用户点击右上角分享
     */
	onShareAppMessage: function () {
		return {
			title: '漫步配色广场，和颜色来一场偶遇！',
			path: 'pages/square/index'
		}
	},

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        infos: []
    },

	// 获取容器高度，使页面滚动到容器底部
	pageScrollToBottom: function () {
		wx.createSelectorQuery().select('#view_area').boundingClientRect(function (rect) {
			console.log('view_area: ', rect)
			// 使页面滚动到底部
			wx.pageScrollTo({
				scrollTop: rect.height,
				// duration: 100
			})
			
		}).exec()
	},

	require(touch_bottom = false) {
		let that = this
		let sum = app.globalData.sum_palettes
		let count = app.globalData.palettes.length
		console.log('count: ', count, 'sum: ', sum)

		let flag = false
		let param = {
			start: 0,
			len: 20
		}

		// 有一个是0 或者 count小于sum
		if ( !count || !sum ) {
			flag = true
			param.start = 0
		} else if ( count < sum ) {
			if (touch_bottom || count < MIN_COUNT) {
				flag = true
				param.start = count
			}
		}

		if (flag) {
			// 请求第一屏时显示Loading
			if (param.start == 0) {
				wx.showLoading({
					title: '',
				})
			} else if (touch_bottom) {
				this.setData({
					loading: true
				}, () => {
					that.pageScrollToBottom()

					// 在当前同步流程结束后，下一个时间片执行
					wx.nextTick(() => {
						that.sendRequire(param)
					})
				})

				return flag
			}

			this.sendRequire(param)
		}

		return flag
	}, 

	sendRequire(param) {
		server.getPalettes(param).then(res => {
			// console.log('get getPalettes ok, res', res)
			wx.hideLoading()

			// 放在setPalettes中设置loading
			// this.setData({
			// 	loading: false
			// })

			const { start, total, data } = res
			app.globalData.sum_palettes = total

			if (start == 0) {
				app.globalData.palettes = data
			} else {
				app.globalData.palettes = app.globalData.palettes.concat(data)
			}

			this.setPalettes(app.globalData.palettes)
		}).catch(err => {
			console.log('get getPalettes failed')
			wx.hideLoading()
			this.setData({
				loading: false
			})

			let str = '没有获取到更多配色方案'
			if (param.start == 0) {
				str = `啊噢，${str}，服务器可能进水了`
			}
			wx.showToast({
				icon: 'none',
				title: str
			})
		})
	},

	onScrollToBottom: function(event) {
		console.log('onScrollToBottom, event: ', event)
	},

	/**
     * 生命周期函数--页面上拉触底事件的处理函数
     */
	onReachBottom() {
		// Do something when page reach bottom.
		console.log('onReachBottom, loading: ', this.data.loading)

		// 防止多次滑动触发，正在Loading时触发无效
		if (!this.data.loading) {
			this.require(true)
		}
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		console.log('square onLoad, options:', options)
        // wx.getUserInfo({
        //     success: ret => {
        //         this.setData({
        //             nickName: ret.userInfo.nickName
        //         });
        //     }
        // });

		this.setPalettes(app.globalData.palettes)

		this.require()
		// console.log('square onLoad, length: ', infos.length, 'sum: ', app.globalData.sum_palettes)

		// if (infos.length > 0) return

		// wx.showLoading({
		// 	title: '',
		// })

		// let param = {
		// 	start: 0,
		// 	len: 4
		// }
		// server.getPalettes(param).then(res => {
		// 	console.log('get getPalettes ok, res', res)
		// 	wx.hideLoading()
			
		// 	const {start, total, data} = res
		// 	if (start == 0) {
		// 		app.globalData.palettes = data
		// 	} else {
		// 		app.globalData.palettes = app.globalData.palettes.concat(data)
		// 	}
			
		// 	this.setPalettes(app.globalData.palettes)
		// }).catch(err => {
		// 	console.log('get getPalettes failed')
		// 	wx.hideLoading()
		// 	wx.showToast({
		// 		icon: 'none',
		// 		title: '啊噢，没有获取到更多配色方案，服务器可能进水了'
		// 	})
		// })

    },

	setPalettes(infos) {
		console.log('setPalettes, length:', infos.length)
		this.setData({
			infos,
			loading: false
		})
	},
    

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },
})