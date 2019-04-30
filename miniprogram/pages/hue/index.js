
const config = require('../../config')

Page({

	/**
     * 用户点击右上角分享
     */
	onShareAppMessage: function () {
		return {
			title: `${this.data.title}，配色表，专注颜色搭配！`,
			path: `pages/home/index?${this.data.category}`
		}
	},

    /**
     * 页面的初始数据
     */
    data: {
		category: 1,
		info: config.list_hue,
		title: "",
		bgcolor: "white"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		console.log('hue onLoad, options:', options)

		const {category} = options
		let title = ""
		let info = []
		if (category == 1) {
			title = "按色相搭配"
			info = config.list_hue
		} else if (category == 2) {
			title = "按印象搭配"
			info = config.list_impression
		}

		this.setData({
			title,
			info,
			category
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

	onTap: function (event) {
		console.log('onTap', JSON.stringify(event))
		wx.navigateTo({
			url: `/pages/matching/index?category=${this.data.category}&idx=${event.currentTarget.dataset.idx}`,
		})
	},
})