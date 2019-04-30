const app = getApp()
const config = require('../../config')

const HELPER_KEY = 'HELPER_20190429';

Page({

	/**
     * 用户点击右上角分享
     */
	onShareAppMessage: function () {
		let query = this.data.query
		return {
			title: `${this.data.title}，我们专注颜色搭配！`,
			path: `pages/matching/index?idx=${query.idx}&category=${query.category}`
		}
	},

    /**
     * 页面的初始数据
     */
    data: {
		query: {},
		info: [],
		title: "配色组合",
		tips: "",
		SHOW_HELPER: false
    },

    closeHelper: function() {
        this.setData({
            SHOW_HELPER: false
        });

		wx.setStorageSync(HELPER_KEY, 'yes');
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

		console.log('matching onLoad, options:', options)

		const { idx, category } = options

		this.data.query = options

		let info = []
		let title = ""
		if (category == 1) {
			info = config.list_hue[idx]
			title = info.title + "配色组合"
		} else if (category == 2) {
			info = config.list_impression[idx]
			title = info.title + "配色组合"
		}
		
		console.log(idx, info)
		this.setData({
			info,
			title,
			tips: info.tip || ""
		})

        
    },
    

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
		let that = this
		setTimeout(() => {
			// 检查是否已经展示引导
			let IS_SHOW_HELPER = wx.getStorageSync(HELPER_KEY);
			if (!IS_SHOW_HELPER) {
				that.setData({
					SHOW_HELPER: true
				});
				// wx.setStorageSync(HELPER_KEY, 'yes');
			}
		}, 1000);
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

	onLongTap: function (event) {
		console.log('onLongTap', JSON.stringify(event))
		
		let idx = event.currentTarget.dataset.idx
		let colors = this.data.info.color[idx]
		let str = colors.join(", ")
		str = str.toLowerCase()
		console.log(str)
		wx.setClipboardData({
			data: str,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: '复制成功'
						})
					}
				})
			}
		})
	},
})