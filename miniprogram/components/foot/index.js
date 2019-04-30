// components/one/page.js


Component({
    /**
     * 组件的属性列表
     */
    properties: {

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

        lifetimes: {
            attached() {
                // 在组件实例进入页面节点树时执行
                // var query = wx.createSelectorQuery();
                // //选择id
                // var that = this;
                // query.select('.container-raw').boundingClientRect(function(rect) {
                //     console.log(rect.width)
                // }).exec();
            },
            detached() {
                // 在组件实例被从页面节点树移除时执行
            },
        },


        toggleData: function() {
            this.setData({
                // SHOW_DATA: !this.data.SHOW_DATA
            });
        }
    }
})