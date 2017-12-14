/**
 * @file 全局变量和函数
 *		 
 *	文件名			:top.js	
 *	编程者			:Awen
 *	日期			:2017.11.15	
 *	项目名			:车联网超级终端 Platform技术预研	
 *	操作系统		:Cross
 *
 *	编号----日期--------注释-------------------------------
 *	00		17.11.15	初期作成
 */


(function() {
	var root = typeof self == 'object' && self.self === self && self ||
			typeof global == 'object' && global.global === global && global ||
			this ||
			{};

	// Save the previous value of the `_ET_GLOBAL` variable.
	var previousUnderscore = root._ET_GLOBAL;

	// Create a safe reference to the Underscore object for use below.
	var _ET_GLOBAL = function(obj) {
	if (obj instanceof _ET_GLOBAL) return obj;
	if (!(this instanceof _ET_GLOBAL)) return new _ET_GLOBAL(obj);
	this._wrapped = obj;
	};

	// Export the Underscore object for **Node.js**, with
	// backwards-compatibility for their old module API. If we're in
	// the browser, add `_ET_GLOBAL` as a global object.
	// (`nodeType` is checked to ensure that `module`
	// and `exports` are not HTML elements.)
	if (typeof exports != 'undefined' && !exports.nodeType) {
	if (typeof module != 'undefined' && !module.nodeType && module.exports) {
	  exports = module.exports = _ET_GLOBAL;
	}
	exports._ET_GLOBAL = _ET_GLOBAL;
	} else {
	root._ET_GLOBAL = _ET_GLOBAL;
	}

	_ET_GLOBAL.CTL_CHANNEL_IN = 'ctl_in';
	_ET_GLOBAL.CTL_CHANNEL_OUT = 'ctl_out';
	_ET_GLOBAL.PROXY_LEFT_IN = 'pro_left_in';
	_ET_GLOBAL.PROXY_LEFT_OUT = 'pro_left_out';
	_ET_GLOBAL.PROXY_HOST = '';
	_ET_GLOBAL.PROXY_PORT = '';
	_ET_GLOBAL.PROTO = '';

	// Current version.
	_ET_GLOBAL.VERSION = '0.0.1';
  
	// A (possibly faster) way to get the current timestamp as an integer.
	_ET_GLOBAL.now = Date.now || function() {
		return new Date().getTime();
	  };
	//十六进制字符串转字节数组
	_ET_GLOBAL.HexStr2Bytes = function HexStr2Bytes(str) {
		var hexBytes = new Array();
		var hexA = str.split(" ");
		for(var i=0; i<hexA.length; i++) {
			var v = parseInt(hexA[i],16);
			hexBytes.push(v);
		}
		return hexBytes;
	}
	_ET_GLOBAL.Bytes2HexStr = function Bytes2HexStr(arr) {
		var result = "";
		for (i in arr) {
			var str = arr[i].toString(16);
			str = str.length == 0 ? "00" :
			  str.length == 1 ? "0" + str : 
			  str.length == 2 ? str :
			  str.substring(str.length-2, str.length);
			 str = str + " ";
			result += str;
		}
		return result;
	}
}());