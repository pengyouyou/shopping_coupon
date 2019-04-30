// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
function formatDate(date, fmt) {
	var o = {
		"M+": date.getMonth() + 1,                 //月份   
		"d+": date.getDate(),                    //日   
		"h+": date.getHours(),                   //小时   
		"m+": date.getMinutes(),                 //分   
		"s+": date.getSeconds(),                 //秒   
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
		"S": date.getMilliseconds()             //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	const hour = parseInt(time / 3600, 10)
	time %= 3600
	const minute = parseInt(time / 60, 10)
	time = parseInt(time % 60, 10)
	const second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

function fib(n) {
	if (n < 1) return 0
	if (n <= 2) return 1
	return fib(n - 1) + fib(n - 2)
}

function formatLeadingZeroNumber(n, digitNum = 2) {
	n = n.toString()
	const needNum = Math.max(digitNum - n.length, 0)
	return new Array(needNum).fill(0).join('') + n
}

function formatDateTime(date, withMs = false) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	const ms = date.getMilliseconds()

	let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
		' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
	if (withMs) {
		ret += '.' + formatLeadingZeroNumber(ms, 3)
	}
	return ret
}

// 参数hex = #FFFFFF
function hex2Rgb(hex) {
	hex = hex.replace('#', '0x')
	return [hex >> 16, hex >> 8 & 0xff, hex & 0xff]
}

// 参数arr的值分别为[r,g,b]
function rgb2Hex(arr) {
	var r = arr[0], g = arr[1], b = arr[2];
	// 255,255,255
	return (r << 16 | g << 8 | b).toString(16)
}

// rgb = 'rgb(255,255,255)'
// function rgbStr2Hex(rgb) {
// 	//用不是数字的字符分割原字符串
// 	rbg = rgb.split(/[^\d]+/g)
// 	return (rgbArr[1] << 16 | rgbArr[2] << 8 | rgbArr[3]).toString(16)
// }

// rgbToHsv([3, 3, 3]); // 输出：[0,0,1]
//参数arr的值分别为[r,g,b]
function rgb2Hsb(arr) {
	var h = 0, s = 0, v = 0;
	var r = arr[0], g = arr[1], b = arr[2];
	arr.sort(function (a, b) {
		return a - b;
	})
	var max = arr[2]
	var min = arr[0];
	v = max / 255;
	if (max === 0) {
		s = 0;
	} else {
		s = 1 - (min / max);
	}
	if (max === min) {
		h = 0;//事实上，max===min的时候，h无论为多少都无所谓
	} else if (max === r && g >= b) {
		h = 60 * ((g - b) / (max - min)) + 0;
	} else if (max === r && g < b) {
		h = 60 * ((g - b) / (max - min)) + 360
	} else if (max === g) {
		h = 60 * ((b - r) / (max - min)) + 120
	} else if (max === b) {
		h = 60 * ((r - g) / (max - min)) + 240
	}
	h = parseInt(h);
	s = parseInt(s * 100);
	v = parseInt(v * 100);
	return [h, s, v]
}

// hsvToRgb([120, 50, 100]); //输出：[127, 255, 127]
//参数arr的3个值分别对应[h, s, v]
function hsb2Rgb(arr) {
	var h = arr[0], s = arr[1], v = arr[2];
	s = s / 100;
	v = v / 100;
	var r = 0, g = 0, b = 0;
	var i = parseInt((h / 60) % 6);
	var f = h / 60 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
	switch (i) {
		case 0:
			r = v; g = t; b = p;
			break;
		case 1:
			r = q; g = v; b = p;
			break;
		case 2:
			r = p; g = v; b = t;
			break;
		case 3:
			r = p; g = q; b = v;
			break;
		case 4:
			r = t; g = p; b = v;
			break;
		case 5:
			r = v; g = p; b = q;
			break;
		default:
			break;
	}
	r = parseInt(r * 255.0)
	g = parseInt(g * 255.0)
	b = parseInt(b * 255.0)
	return [r, g, b];
}

module.exports = {
	formatDate,
	formatTime,
	formatLocation,
	fib,
	formatDateTime,

	hex2Rgb,
	rgb2Hex,
	rgb2Hsb,
	hsb2Rgb
}
