// components/one/page.js

var TOUCH_START = 0;
var TOUCH_END = 0;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: null,
	swidth: Number,
	title_style: null,
	colors_style: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    // SHOW_DATA: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

	//   lifetimes: {
	// 	  attached() {
	// 		  // 在组件实例进入页面节点树时执行
	// 		  var query = wx.createSelectorQuery();
	// 		  //选择id
	// 		  var that = this;
	// 		  query.select('.container-raw').boundingClientRect(function (rect) {
	// 			  console.log(rect.width)
	// 		  }).exec();
	// 	  },
	// 	  detached() {
	// 		  // 在组件实例被从页面节点树移除时执行
	// 	  },
	//   },

		


    onTap: function () {
		console.log(this.properties.swidth, this.properties.info)
		let info = this.properties.info
		// let param = {
		// 	id: info.id,
		// 	title: info.title,
		// 	colors: info.colors
		// }
		let param_str = JSON.stringify(info)
		wx.navigateTo({
			url: `/pages/detail/index?json=${param_str}`,
		})
    },

    // touchStart: function (e) {
    //   TOUCH_START = e.changedTouches[0].clientY;
    // },
    // touchEnd: function (e) {
    // },
    // touchMove: function (e) {
    //   // 如果是两个手指
    //   if (e.changedTouches.length > 1) return this.twoTouchMove(e);
    //   TOUCH_END = e.changedTouches[0].clientY;
    //   // 判断数值
    //   let IS_TOP = (TOUCH_START - TOUCH_END) > 0;
    //   let MOVE_NUM = Math.abs(TOUCH_START - TOUCH_END);
    //   if (MOVE_NUM < 100) return;
    //   // 如果向上，并且没有显示
    //   let SHOW_DATA = !!this.data.SHOW_DATA;
    //   if (IS_TOP && !SHOW_DATA) {
    //     // this.setData({
    //     //   SHOW_DATA: true
    //     // })
    //   }
    //   if (!IS_TOP && SHOW_DATA) {
    //     // this.setData({
    //     //   SHOW_DATA: false
    //     // })
    //   }
    // },

    // twoTouchMove: function (e) {
    //   TOUCH_END = e.changedTouches[0].clientY;
    //   // 判断数值
    //   let IS_TOP = (TOUCH_START - TOUCH_END) > 0;
    //   let MOVE_NUM = Math.abs(TOUCH_START - TOUCH_END);
    //   if (MOVE_NUM < 100) return;

    //   this.triggerEvent(IS_TOP ? 'twoTop' : 'twoBottom', {}, {});
    // }
  }
})
