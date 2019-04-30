//app.js
const config = require('config')

App({

    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch: function() {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
				env: config.envId,
                traceUser: true,
            })
        }

        this.globalData = {
			hot_palettes: [],
			palettes: [],
			sum_palettes: 0,

			tmplist: [],
			tmpitems: [],
			count: 0
		}

    },

    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function(options) {
		console.log('app onShow, options:', options)
    },

    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function() {
		console.log('app onHide')
    },

    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function(msg) {

    }
})