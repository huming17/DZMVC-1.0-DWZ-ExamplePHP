// JavaScript Document
/*
* @author Huming Xu
* @Email info@512cs.com
* 
*/
var server_url = server_url_1 = "http://www.512cs.com/";//远程服务器通信地址
var server_version = "0.0.0";//远程服务器 软件版本 需要和本地一直才可以运行
var server_remote_config = 1;//1 检查远程版本; 2 本地离线运行
$(document).ready(function() {
	check_internet(server_url_1);

});

/*
* jq loading 显示函数
* @pram theme 加载器主题样式a-e  
* @pram msgText 加载器中显示的文字
* @pram textVisible 是否只显示文字
* @pram textonly 是否只显示文字
* @pram html 要显示的html内容，如图片等
*
*/
function loading_on(theme,msgText,textVisible,textonly,html,hide_delay_msec){
	var $this = $( this );
	if(!msgText){
		msgText = '加载中...';
	}
	//theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme;
	//msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text;
	//textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible;
	//textonly = !!$this.jqmData( "textonly" );
	html = $this.jqmData( "html" ) || "";
	$.mobile.loading( "show", {
			text: msgText,
			textVisible: textVisible,
			theme: theme,
			textonly: textonly,
			html: html
	});	
	if(hide_delay_msec){
		loading_off(hide_delay_msec);
	}
}

/*
* jq loading 隐藏loading函数
*
*/
function loading_off(delay_msec){
	if(delay_msec){
		setTimeout('loading_off()', delay_msec);
	}else{
		$.mobile.loading( "hide" );
	}
}

/*
* 检测因特网是否联通,服务器是否正常工作函数
*
*/
function check_internet(server_url){
	loading_on('a','',true,false,'');
	$.ajax({
	  async:false,
	  url: server_url+"source/system_version.php?ajax_version=2",
	  cache: false,
	  dataType: "JSON",
	  timeout: 5000,
	  error: function(XMLHttpRequest, textStatus, errorThrown){ //TODO: 处理status， http status code，超时 408
		// 注意：如果发生了错误，错误信息（第二个参数）除了得到null之外，还可能
		//是"timeout", "error", "notmodified" 和 "parsererror"。
		//未接入互联网则默认进入离线运行
		loading_on('a','您未接入互联网,进入离线模式,部分功能将受限制',true,false,'',3000);
	  }
	})
	.done(function( data ) {
		if(server_version==data.version){
			loading_off();
		}else{
			loading_on('b','客户端版本与服务端不匹配',true,false,'');	
		}
	});
}

/*
* 检测因特网是否联通,服务器是否正常工作函数
*
*/
function get_cate(cate_id){
	loading_on('a','',true,false,'');
	$.ajax({
	  async:true,
	  url: server_url+"index.php?mod=ajax&action=cate&do=scroll_page",
	  cache: false,
	  dataType: "JSON",
	  timeout: 5000,//单位毫秒
	  error: function(XMLHttpRequest, textStatus, errorThrown){ //TODO: 处理status， http status code，超时 408
		// 注意：如果发生了错误，错误信息（第二个参数）除了得到null之外，还可能
		//是"timeout", "error", "notmodified" 和 "parsererror"。
		loading_on('a','您未接入互联网,进入离线模式,部分功能将受限制',true,false,'',3000);
	  }
	})
	.done(function( data ) {
		if(data){
			//console.log(data);
			var items = [];
			$.each( data, function( key, val ) {
				items.push('<li class="ui-li-has-thumb" id="'+ key +'"><a href="#" class="cars ui-btn ui-btn-icon-right ui-icon-carat-r" id="a_'+ key +'"><img src="'+ val.title_img +'" alt="'+ val.title +'"><h2>"'+ val.title +'"</h2><p>'+ val.content_desc +'</p></a></li>' );
			});
			var cate_list_lis = items.join('');
			$(cate_list_lis).appendTo( "#cate_list" );
			//var cate_list_lis = '<ul data-role="listview" id="cate_list" class="ui-listview">'+items.join('')+'</ul>';
			//$("#page-content").html( cate_list_lis );
			loading_off();
		}
	});
}

/*
* 本地存储用户信息说明
* localStorage提供了几个方法:
* 1.存储：localStorage.setItem(key,value)
* 如果key存在时，更新value
* 
* 2.获取：localStorage.getItem(key)
* 如果key不存在返回null
* 
* 3.删除：localStorage.removeItem(key)
* 一旦删除，key对应的数据将会全部删除
* 
* 4.全部清除：localStorage.clear()
* 某些时候使用removeItem逐个删除太麻烦，可以使用clear,执行的后果是会清除所有localStorage对象保存的数据
* 
* 5.遍历localStorage存储的key
* .length 数据总量，例：localStorage.length
* .key(index) 获取key，例：var key=localStorage.key(index);
* 
* 6.存储JSON格式数据
* JSON.stringify(data)  将一个对象转换成JSON格式的数据串,返回转换后的串
* JSON.parse(data) 将数据解析成对象，返回解析后的对象
* 
* 类似存储还有 sessionStorage：
* 将数据保存在session对象中，所谓session是指用户在浏览某个网站时，从进入网站到浏览器关闭所经过的这段时间，也就是用户浏览这个网站所花费的时间。session对象可以用来保存在这段时间内所要求保存的任何数据。

* localStorage：
* 将数据保存在客户端本地的硬件设备（通常指硬盘，当然可以是其他的硬件设备）中，即是浏览器被关闭了，该数据仍然存在，下次打开浏览器访问网站时，仍然可以继续使用。

* sessionStorage与localStorage区别：
* 这两者的区别在于sessionStorage为临时保存，而localStorage为永久保存。
*
*/

/*
* 检测服务器用户认证并返回用户信息进行本地存储函数
* @pram string username 用户名
* @pram string password 密码
*/
function get_userinfo(username,password){
	loading_on('a','',true,false,'');
	$.ajax({
	  async:false,
	  url: server_url+"index.php?mod=ajax&action=member&do=ajax_login&api_client=1&username="+username+"&password="+password,
	  cache: false,
	  dataType: "JSON",
	  timeout: 5000,//单位毫秒
	  error: function(XMLHttpRequest, textStatus, errorThrown){ //TODO: 处理status， http status code，超时 408
		// 注意：如果发生了错误，错误信息（第二个参数）除了得到null之外，还可能
		//是"timeout", "error", "notmodified" 和 "parsererror"。
		loading_on('a','您未接入互联网,进入离线模式,部分功能将受限制',true,false,'',3000);
	  }
	})
	.done(function( data ) {
		if(data && data.userinfo.user_id){
			localStorage.setItem("userinfo", JSON.stringify(data));//目前javascript使用非常多的json格式,如果希望存储在本地可以直接调用JSON.stringify()将其转为字符串
			//var data2=JSON.parse(localStorage.getItem("userinfo"));//读取出来后调用JSON.parse()将字符串转为json格式
			//console.log(data2);
		}else{
			localStorage.setItem("userinfo", '');
		}
		loading_off();
	});
}

/*
* 更新用户信息进行本地存储函数
* @pram string username 用户名
*/
function update_local_userinfo(user_id){
	loading_on('a','',true,false,'');
	$.ajax({
	  async:false,
	  url: server_url+"index.php?mod=ajax&action=member&do=ajax_userinfo&api_client=1&user_id="+user_id,
	  cache: false,
	  dataType: "JSON",
	  timeout: 5000,//单位毫秒
	  error: function(XMLHttpRequest, textStatus, errorThrown){ //TODO: 处理status， http status code，超时 408
		// 注意：如果发生了错误，错误信息（第二个参数）除了得到null之外，还可能
		//是"timeout", "error", "notmodified" 和 "parsererror"。
		loading_on('a','您未接入互联网,进入离线模式,部分功能将受限制',true,false,'',3000);
	  }
	})
	.done(function( data ) {
		if(data && data.userinfo.user_id){
			localStorage.setItem("userinfo", JSON.stringify(data));//目前javascript使用非常多的json格式,如果希望存储在本地可以直接调用JSON.stringify()将其转为字符串
			//var data2=JSON.parse(localStorage.getItem("userinfo"));//读取出来后调用JSON.parse()将字符串转为json格式
			//console.log(data2);
		}else{
			localStorage.setItem("userinfo", '');
			loading('用户名或密码无效',500);
		}
		loading_off();
	});
}

/*
* 用户登录函数
* @pram string username 用户名
* @pram string password 密码
*/

function check_login(){
	if(localStorage.getItem("userinfo")){
		var userinfo=JSON.parse(localStorage.getItem("userinfo"));
	}
	if(userinfo && userinfo.userinfo.user_id){
		return 1;
	}else{
		if(!username){
			var username = $('#un').val();
		}
		if(!password){
			var password = $('#pw').val();
		}
		if(username && password){
			get_userinfo(username,password);
			if(localStorage.getItem("userinfo")){
				var data=JSON.parse(localStorage.getItem("userinfo"));
				return 1;
			}else{
				loading('用户名或密码无效',500);
				//$("#popupLogin").popup("open");
				return 2;
			}
		}else{
			loading('请填写用户名密码',500);
			//$("#popupLogin").popup("open");
			return 2;
		}
	}
}

/*
* loading 窗体函数
* @pram string msgText 用户名
* @pram int timeout 消失时间 毫秒
*/

function loading(msgText,timeout){
	loading_on('a',msgText,true,false,'');
	setTimeout("loading_off()",timeout);
}

/*
* 简易万能字段更新函数
* @pram operate 数据库操作类型有 update,insert,delete 
* @pram data_json //目前单条更新,
* @todo 多条更新
* {
*     "tablename": "users", //tablename string 表名称
*     "tabledata": {
*         "1": {
*             "data": {//data string 更新字段名及值  采用JSON格式存储{"score":6}
*                 "user_score": "2"
*             },
*             "condition": {//condition WHERE条件字段名 采用JSON格式存储{"user_id":1}
*                 "user_id": "1",
*                 "isdelete": "0"
*             }
*         },
*         "2": {
*             "data": {
*                 "user_score": "2"
*             },
*             "condition": {
*                 "user_id": "1",
*                 "isdelete": "0"
*             }
*         }
*     }
* }
*/
function operate_db(operate,data_json){
	loading_on('a','',true,false,'');
	$.ajax({
	  async:false,
	  url: server_url+"index.php?mod=ajax&action=db&do="+operate,
	  data: JSON.parse(data_json),
	  cache: false,
	  dataType: "JSON",
	  timeout: 5000,//单位毫秒
	  error: function(XMLHttpRequest, textStatus, errorThrown){ //TODO: 处理status， http status code，超时 408
		// 注意：如果发生了错误，错误信息（第二个参数）除了得到null之外，还可能
		//是"timeout", "error", "notmodified" 和 "parsererror"
		loading_on('a','您未接入互联网,进入离线模式,部分功能将受限制',true,false,'',3000);
	  }
	})
	.done(function( data ) {
		if(data.status=='A001'){
			loading_on('a','操作成功',true,false,'',1000);
		}else{
			loading_on('a','失败成功',true,false,'',1000);
		}
	});
}

function logout(){
	//setcookie();
	localStorage.setItem("userinfo", '');
	location.reload();
}
/*
 * cookie 处理函数 开始
 * */
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	var expires = new Date();
	if(cookieValue == '' || seconds < 0) {
		cookieValue = '';
		seconds = -2592000;
	}
	expires.setTime(expires.getTime() + seconds * 1000);
	domain = !domain ? cookiedomain : domain;
	path = !path ? cookiepath : path;
	document.cookie = escape(cookiepre + cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

function getcookie(name, nounescape) {
	name = cookiepre + name;
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	if(cookie_start == -1) {
		return '';
	} else {
		var v = document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length));
		return !nounescape ? unescape(v) : v;
	}
}
/*
 * cookie 处理函数 结束
 * */

/*
 * 字符串处理函数 开始
 * */
//计算字符串长度
String.prototype.strLen = function() {
	var len = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2; else len ++;
	}
	return len;
}

//将字符串拆成字符，并存到数组中
String.prototype.strToChars = function(){
	var chars = new Array();
	for (var i = 0; i < this.length; i++){
		chars[i] = [this.substr(i, 1), this.isCHS(i)];
	}
	String.prototype.charsArray = chars;
	return chars;
}
 
//判断某个字符是否是汉字
String.prototype.isCHS = function(i){
	if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) 
		return true;
	else
		return false;
}

//截取字符串（从start字节到end字节）
String.prototype.subCHString = function(start, end){
	var len = 0;
	var str = "";
	this.strToChars();
	for (var i = 0; i < this.length; i++) {
		if(this.charsArray[i][1])
			len += 2;
		else
    		len++;
		if (end < len)
     		return str;
		else if (start < len)
			str += this.charsArray[i][0];
	}
	return str;
}

//截取字符串（从start字节截取length个字节）
String.prototype.subCHStr = function(start, length){
	return this.subCHString(start, start + length);
}
//使用示例
//var str = "欢迎abc访问简明现代魔法";
//var str1 = str.subCHStr(0, 9); 
//var str2 = str.subCHStr(2, 4); 
//alert(str1 + " == " + str2);
//document.write( str1 );
//var str3 = str.strToChars();
//console.log(str3);
/*
 * 字符串处理函数 结束
 * */

/**
 * JS判断一个值是否存在数组中 开始
 */
// 定义一个判断函数
var in_array = function(arr){
	// 判断参数是不是数组
	//var isArr = arr && console.log(
	//	typeof arr==='object' ? arr.constructor===Array ? arr.length ? arr.length===1 ? arr[0]:arr.join(','):'an empty array': arr.constructor: typeof arr 
	//);
	// 不是数组则抛出异常
	//if(!isArr && 1==2){
	//	throw "arguments is not Array"; 
	//}
	// 遍历是否在数组中
	for(var i=0,k=arr.length;i<k;i++){
		if(this==arr[i]){
			return true;  
		}
	}
	// 如果不在数组中就会返回false
	return false;
}

//给字符串添加原型
String.prototype.in_array = in_array;
//给数字类型添加原型
Number.prototype.in_array = in_array;
//使用示例
//声明一个数组
//var arr = Array('blue','red','110','120');
//var str = 'red2';
//var isInArray = str.in_array(arr);
//alert(isInArray); // true
//数字测试
//var num = 119;
//var isInArray = num.in_array(arr);
//alert(isInArray); // false
/**
 * JS判断一个值是否存在数组中 开始
 */

function rand(n){
	return Math.floor(Math.random()*(n));
}
