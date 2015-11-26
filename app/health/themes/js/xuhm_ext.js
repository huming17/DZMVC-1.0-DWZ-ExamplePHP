// JavaScript Document

/*
* @扩展方法逻辑JS
* @author Huming Xu
* @Email info@512cs.com
*/

/*
* @赚金币
* @author Huming Xu
* @Email info@512cs.com
* @pram int score 金币数
*/
function earn_score(score){
	var userinfo=JSON.parse(localStorage.getItem("userinfo"));
	var new_user_score = parseInt(userinfo.userinfo.user_score) + 1;
	operate_db('update','{"tablename":"users","tabledata":{"1":{"data":{"user_score":"'+new_user_score+'"},"condition":{"user_id":"'+userinfo.userinfo.user_id+'","isdelete":"0"}}}}');
	update_local_userinfo(userinfo.userinfo.user_id);
	var userinfo=JSON.parse(localStorage.getItem("userinfo"));
	loading('操作成功,拥有积分:'+userinfo.userinfo.user_score,1000);
}

/*
* @获取用户设置的背书内容
* @author Huming Xu
* @Email info@512cs.com
* @pram null
*/
function user_beishu_get(){
	var user_beishu=JSON.parse(localStorage.getItem("user_beishu"));
	return user_beishu;
}

/*
* @设置用户背书
* @author Huming Xu
* @Email info@512cs.com
* @pram null
*/
function user_beishu_set(){
	var user_beishu_content_src = user_beishu_content = jQuery('#user_beishu_content').val();
	var user_beishu_num = jQuery('#user_beishu_num').val();
	//user_beishu_content=user_beishu_content.replace(/\n/g,"###");//换行符以###存储 未启用
	//console.log(user_beishu_content); 
	/*
	* 这个库用来扩展 jQuery ，对于 JSON 的使用，扩展了两个方法
	* toJSON 方法用来将一个普通的 JavaScript 对象序列化为 JSON 串
	* evalJSON 方法将一个 JSON 串解析为一个普通的 JavaScript 对象
	*/
	var user_beishu_json = {"content": user_beishu_content, "num": user_beishu_num};
	var user_beishu_string = jQuery.toJSON( user_beishu_json );//对象转字符
	//var user_beishu_json = jQuery.evalJSON( user_beishu_string );//字符转对象
	localStorage.setItem("user_beishu", user_beishu_string);
	jQuery('#user_beishu_content').val(user_beishu_content_src);
	loading_on('a','设置成功',true,false,'',1000);
	//console.log(user_beishu_json);
	//console.log(user_beishu_string);
}

/*
* @用户的背书
* @author Huming Xu
* @Email info@512cs.com
* @pram null
*/
function user_beishu_do(){
	jQuery("#div_user_beishu_form").html('');
	var user_beishu=JSON.parse(localStorage.getItem("user_beishu"));
	var user_beishu_array = new Array();
	var user_beishu_array = user_beishu.content.strToChars();
	var user_beishu_num_set_pos_array = user_beishu_num_set_pos();
	var user_beishu_exception_char_array = user_beishu_exception_char();
	user_beishu_array_set = new Array();
	count_num_set = 0;
	for(var i=0,a;a=user_beishu_array[i++];){
	    //判断换行符号 拼装背诵表单
	    //默认空格input
	    var form_input = '<input size="2" style="background:transparent;BORDER-BOTTOM: 0pt solid; BORDER-LEFT: 0pt solid; BORDER-RIGHT: 0pt solid; BORDER-TOP: 0pt solid;" type="text" readonly="readonly" id="char_'+i+'" value=" ">';
	    is_exception_char = a[0].in_array(user_beishu_exception_char_array);
	    if(!is_exception_char){
    		//根据设置的背诵难度不显示input value
    		var is_set_position = i.in_array(user_beishu_num_set_pos_array);
    		if(is_set_position){
    			var form_input = '<input size="2" maxlength="1" style="background:transparent;BORDER-BOTTOM: 1pt solid; BORDER-LEFT: 0pt solid; BORDER-RIGHT: 0pt solid; BORDER-TOP: 0pt solid;" type="text" id="char_'+i+'" value="">';
    			//存储设置的背诵词语位置与正确答案
    			user_beishu_array_set[i]=a[0];
    			count_num_set = count_num_set + 1;
    		}else{
    			var form_input = '<input size="2" maxlength="1" style="background:transparent;BORDER-BOTTOM: 0pt solid; BORDER-LEFT: 0pt solid; BORDER-RIGHT: 0pt solid; BORDER-TOP: 0pt solid;" type="text" readonly="readonly" id="char_'+i+'" value="'+a[0]+'">';
    		}
	    }else{
	    	if('\n'==a[0]){
	    		var form_input = '<input size="2" maxlength="1" type="hidden" id="char_'+i+'" value="\n"><br/>';
	    	}else if(' '==a[0]){
	    		var form_input = '<input size="2" maxlength="1" style="background:transparent;BORDER-BOTTOM: 0pt solid; BORDER-LEFT: 0pt solid; BORDER-RIGHT: 0pt solid; BORDER-TOP: 0pt solid;" type="text" readonly="readonly" id="char_'+i+'" value="'+a[0]+'">';
	    	}else{
	    		var form_input = '<input size="2" maxlength="1" style="background:transparent;BORDER-BOTTOM: 0pt solid; BORDER-LEFT: 0pt solid; BORDER-RIGHT: 0pt solid; BORDER-TOP: 0pt solid;" type="text" readonly="readonly" id="char_'+i+'" value="'+a[0]+'">';
	    	}
	    }
	    jQuery(form_input).appendTo("#div_user_beishu_form");
	}
	//隐藏背诵设置表单
	jQuery('#div_user_beishu_set').hide();
	jQuery('#div_user_beishu_do').show();
}

/*
 * 提交背诵内容
 * */
function user_beishu_do_submit(){
	var user_beishu_score = 0;
	//console.log(user_beishu_array_set);
	//console.log(count_num_set);
	var count_num_correct = 0;
	for(var key in user_beishu_array_set){
		//获取用户填的值
		var char_val = jQuery('#char_'+key).val();
		if(user_beishu_array_set[key] == char_val){
			count_num_correct = count_num_correct + 1;
			//DEBUG 正确增加绿色下划线
			jQuery('#char_'+key).css({"border-bottom":"1pt solid green","color":"green"});
		}else{
			//DEBUG 错误增加红色下划线
			jQuery('#char_'+key).css({"border-bottom":"1pt solid red","color":"red"});
		}
    } 
    //console.log(count_num_correct);
    user_beishu_score = Math.ceil((count_num_correct/count_num_set)*100)
	jQuery("#span_user_beishu_score_val").html(user_beishu_score);
	jQuery('#div_user_beishu_do_submit').hide();
	jQuery('#div_user_beishu_score').show();
	jQuery('#div_user_beishu_return').show();
}

/*
 * 提交背诵内容
 * */
function user_beishu_return(){
	jQuery('#div_user_beishu_set').show();
	jQuery('#div_user_beishu_do').hide();
	jQuery('#div_user_beishu_do_submit').show();
	jQuery('#div_user_beishu_score').hide();
	jQuery('#div_user_beishu_return').hide();
}

/*
 * 定义特殊符号背书不计入背诵内容
 * */
function user_beishu_exception_char(){
	var exception_char_array = new Array('\n', ' ');
	return exception_char_array;
}

/*
 * 背书内容长度与最大长度
 * */
function user_beishu_num_set(){
	var user_beishu_content_src = user_beishu_content = jQuery('#user_beishu_content').val();
	var user_beishu_array = user_beishu_content_src.strToChars();
	var user_beishu_total_num = 0;
	var user_beishu_exception_char_array = user_beishu_exception_char();
	for(var i=0,a;a=user_beishu_array[i++];){
	    //判断换行符号 拼装背诵表单
	    //默认空格input
	    is_exception_char = a[0].in_array(user_beishu_exception_char_array);
	    if(!is_exception_char){
    		user_beishu_total_num = user_beishu_total_num + 1;
	    }
	}
	//DEBUG 设置难度设置
	var user_beishu_default_num = Math.ceil((user_beishu_total_num/2));
	jQuery('#user_beishu_num').val(user_beishu_default_num);
	jQuery('#user_beishu_num').attr("max",user_beishu_total_num);
}

/*
 * 定义背诵位置点数组
 * */
function user_beishu_num_set_pos(){
	var user_beishu=JSON.parse(localStorage.getItem("user_beishu"));
	var user_beishu_array = user_beishu.content.strToChars();
	var user_beishu_num = user_beishu.num;
	var user_beishu_exception_char_array = user_beishu_exception_char();
	user_beishu_array_all = new Array();
	user_beishu_array_set = new Array();
	var j = 0;
	for(var i=0,a;a=user_beishu_array[i++];){
	    is_exception_char = a[0].in_array(user_beishu_exception_char_array);
	    if(!is_exception_char){
    		user_beishu_array_all[j] = i;
    		j = j+1;
	    }
	}
	var user_beishu_total_set_num = user_beishu_array_all.length;
	for (var i=0;i<user_beishu_num;i++)
	{
		for(var k=0;k<1000;k++){
			var pos = rand(user_beishu_total_set_num);
			user_beishu_total_set_pos = user_beishu_array_all[pos];
			is_already_set = user_beishu_total_set_pos.in_array(user_beishu_array_set);
			if(!is_already_set){
				break;
			}
		}
		console.log(k);
		user_beishu_array_set[i]=user_beishu_total_set_pos;
	}
	return user_beishu_array_set;
}