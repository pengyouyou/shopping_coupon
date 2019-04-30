const app = getApp()
const config = require('../../config')
const server = require('../../utils/server')


Page({

	/**
     * 用户点击右上角分享
     */
	onShareAppMessage: function () {
		return {
			title: '配色表，专注颜色搭配，每日精选7套热门配色方案！',
			path: 'pages/home/index'
		}
	},

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        infos: [],
		// bg_img: 'http://image.wufazhuce.com/FoOjDu9idRN61wTw1vdPGEn3sRVl',
        SHOW_MENU: false,
        nickName: null,
    },

    getUserInfo: function(e) {
        let {
            userInfo
        } = e.detail;
        this.setData({
            nickName: userInfo.nickName
        });
    },


    openMenu: function() {
        this.setData({
            SHOW_MENU: true
        })
    },
    closeMenu: function() {
        this.setData({
            SHOW_MENU: false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
		console.log('home onLoad, options:', options, 'hot_palettes:', app.globalData.hot_palettes.length, 'palettes:', app.globalData.palettes.length)
        // wx.getUserInfo({
        //     success: ret => {
        //         this.setData({
        //             nickName: ret.userInfo.nickName
        //         });
        //     }
        // });

		if (app.globalData.hot_palettes.length) {
			this.setPalettes(app.globalData.hot_palettes)
			return
		}
		
		app.globalData.hot_palettes = config.default_palettes
		this.setPalettes(app.globalData.hot_palettes)

		// 获取后台的数据
		wx.showLoading({
			title: '',
		})

		let param = {
			start: 0,
			len: 7
		}
		server.getHots(param).then(res => {
			console.log('get getHots ok, res', res)
			wx.hideLoading()
			
			app.globalData.hot_palettes = res.data

			this.setPalettes(app.globalData.hot_palettes)
		}).catch(err => {
			console.log('get getHots failed')
			wx.hideLoading()
			wx.showToast({
				icon: 'none',
				title: '啊噢，没有获取到最新配色方案，服务器可能进水了'
			})
		})

    },

	setPalettes(infos) {
		console.log('setPalettes, length:', infos.length)
		this.setData({
			infos
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

	onMatchHue: function() {
		wx.navigateTo({
			url: '/pages/hue/index?category=1',
		})
	},

	onMatchImpression: function () {
		wx.navigateTo({
			url: '/pages/hue/index?category=2',
		})
	},

	onTapMini: function (event) {
		console.log('onTapMini', JSON.stringify(event))
		let dataset = event.currentTarget.dataset
		wx.navigateTo({
			// url: '/pages/hue/index?category=2',
			url: `/pages/matching/index?category=${dataset.category}&idx=${dataset.idx}`,
		})
	},

	onFavorite: function () {

	}, 

	onSquare: function () {
		wx.navigateTo({
			url: `/pages/square/index`,
		})
	}
})