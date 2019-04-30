/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

const host = '14592619.qcloud.la'

const config = {

    // 下面的地址配合云端 Server 工作
    host,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/login`,

    // 发送模板消息接口
    templateMessageUrl: `https://${host}/templateMessage`,

    // 云开发环境 ID
	envId: 'test-v7pzs',
    // envId: 'release-7i3hm',
}

module.exports = config