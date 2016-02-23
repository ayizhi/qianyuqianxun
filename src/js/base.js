'use strict';
window.Z = window.Zepto;
window.bdAk = 'PfzY5Lpfk5kOTATWQDtG9oDX';
window.myVs = '0.0.2';//模板版本号
window.imgUrl = {
	noNetwork:'../img/common/noNetwork.png',
	greenFire:'../img/common/greenFire.png',
	tabCreate:'../img/common/create.png',
	tabMore:'../img/common/more.png',
	femaleHead:'../img/common/female.png',
	maleHead:'../img/common/male.png',
	cardCreator:'../img/card/creator.png',
	logo:'../img/common/logo.png',
	coverEg:'../img/common/fish.jpg',
	close:'../img/common/close.png',
	quote:'../img/guestInfo/quote.png',
	actMask:'../img/actList/maskBg.png',
	datingFlag:'../img/actDetail/dating.png',
	linkingFlag:'../img/actDetail/linking.png',
	registeringFlag:'../img/actDetail/registering.png',
	choosedFlag:'../img/selectGuest/yes.png',
	datingTitle:'../img/actDetail/datingTitle.png',
	resultTitle:'../img/actDetail/resultTitle.png',
	whiteFire:'../img/actDetail/whiteFire.png',
	more:'../img/dating/more.png',
	whiteDonate:'../img/dating/whiteDonate.png',
	redDonate:'../img/dating/redDonate.png',
	whiteLike:'../img/dating/whiteLike.png',
	whiteComment:'../img/dating/whiteComment.png',
	liked:'../img/dating/liked.png',
	taskFinished:'../img/dating/finished.png',
	taskEdit:'../img/dating/taskEdit.png'
}
window.actionUrl = {//请求的url路径
	getCaptcha:{//发送验证码
		url:'/wx/user/getcaptcha',
		type:'post'
	},
	verifyMobile:{//验证手机号
		url:'/wx/user/verifymobile',
		type:'post'
	},
	getUserInfo:{//获取用户信息
		url:'/wx/user/getInfo',
		type:'get'
	},
	editInfo:{
		url:'/wx/user/editInfo',
		type:'get'
	},
	addFriend:{//添加好友关系
		url:'/wx/user/addFriend',
		type:'post'
	},
	createAct:{//创建活动
		url:'/wx/act/create',
		type:'post'
	},
	getActList:{//获取活动列表
		url:'/wx/act/getList',
		type:'get'
	},
	getActListPic:{
		url:'/wx/act/getListPic',
		type:'get'
	},
	getActDetail:{//获取活动详情
		url:'/wx/act/getDetail',
		type:'get'
	},
	getActRegisterInfo:{//获取活动报名资料
		url:'/wx/act/getRegisterInfo',
		type:'get',
	},
	getActGuestInfo:{//获取活动嘉宾的资料
		url:'/wx/act/getGuestInfo',
		type:'get',
	},

	recommendGuest:{//点赞或推荐嘉宾
		url:'/wx/act/recommendGuest',
		type:'post',
	},
	registerAct:{//报名活动
		url:'/wx/act/register',
		type:'post'
	},
	getRegList:{//创建者查看报名列表
		url:'/wx/act/getRegList',
		type:'get'
	},
	chooseGuest:{//创建者选拨并公布嘉宾列表
		url:'/wx/act/chooseGuest',
		type:'post'
	},
	getBarrage:{//请求活动弹幕
		url:'/wx/act/getBarrage',
		type:'get'
	},
	sendBarrage:{//发送活动弹幕
		url:'/wx/act/sendBarrage',
		type:'post'
	},
	submitLink:{//提交连线方案
		url:'/wx/act/submitLink',
		type:'post'
	},
	getLinkData:{//查看连线数据
		url:'/wx/act/getLinkData',
		type:'get'
	},
	getDatingTasks:{//请求约会任务列表
		url:'/wx/act/getDatingTasks',
		type:'get'
	},
	getDatingTaskDetail:{//请求约会任务详情
		url:'/wx/act/getDatingTaskDetail',
		type:'get'
	},
	publishDatingRecord:{//提交约会任务
		url:'/wx/act/publishDatingRecord',
		type:'post'
	},
	getDairyTemp:{//请求日记模板
		url:'/wx/act/getDairyTemp',
		type:'get'
	},
	submitDairy:{//提交约会日记
		url:'/wx/act/submitDairy',
		type:'post'
	},
	getDairyList:{//获取约会日记列表
		url:'/wx/act/getDairyList',
		type:'get'
	},
	getDairyDetail:{//查看约会日记详情
		url:'/wx/act/getDairyDetail',
		type:'get'
	},
	getDonateRecord:{//获取嘉宾队的赞助记录
		url:'/wx/act/getDonateRecord',
		type:'get'
	},
	submitSuggestion:{
		url:'/wx/act/submitSuggestion',
		type:'post'
	},
	getJSParams:{//获取微信JSSDK配置参数
		url:'/wx/common/getJSParams',
		type:'get'
	},
	praise:{//点赞
		url:'/wx/common/praise',
		type:'post'
	},
	cancelPraise:{//取消点赞
		url:'/wx/common/cancelPraise',
		type:'post'
	},
	comment:{//评论
		url:'/wx/common/comment',
		type:'post'
	},
	deleteComment:{//删除评论
		url:'/wx/common/deleteComment',
		type:'post'
	},
	follow:{//关注
		url:'/wx/common/follow',
		type:'post'
	},
	cancelFollow:{//取消关注
		url:'/wx/common/cancelFollow',
		type:'post'
	},
	getUptoken:{//请求七牛上传uptoken
		url:'/wx/common/getUptoken',
		type:'get'
	}
}
window.actConfig = {
	registering:0,
	linking:1,
	dating:2,
	pairs:5
}
window.myWxConfig = {//微信JSSdk使用到的参数
	title:'约会挑战',
	desc:'80%的人都不知道的手机赚钱妙招',
	link:'http://tiyanshi.moxz.cn/',
	imgUrl:'http://sm.domobcdn.com/ugc/367693.jpg'
}
window.usedJsApi = ['onMenuShareTimeline', 'onMenuShareAppMessage','closeWindow','previewImage','getLocation'];
//window.openId = getValueFromSearch('openid');//微信的OpenId
window.uid = getValueFromSearch('uid');//用户id
window.sign = getValueFromSearch('sign');//用户id对应的签名，防止假冒
window.countId = 0;
function verifyMobile(backUrl){
	var params = getCommonParams();
	if(backUrl){
		params += '&back='+encodeURIComponent(backUrl);
	}
	window.location.href = 'mobileVerify.html'+params;
}
function getLocation(callbackName){
	//alert('here getLocation 00:'+callbackName);
	wxReady(function(){
		//alert('here getLocation 1');
		wx.ready(function(){
			//alert('here getLocation 2');
			wx.getLocation({
    			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    			success: function (res) {
    				alert('getLocation success');
    				alert('getLocation reply:'+JSON.stringify(res));
        			var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        			var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
       	 			var script = document.createElement('script');
   					script.type = 'text/javascript';
    				script.src = 'http://api.map.baidu.com/geocoder/v2/?ak='+window.bdAk+'&callback='+callbackName+'&location='+latitude+','+longitude+'&output=json';
    				document.body.appendChild(script);
    			},
    			fail:function(res){
    				if(!callbackName){return;}
    				if(callbackName in window){
    					window[callbackName](false);
    				}
    			}
			});
		});
	});
}
function praise(options){
	console.log('call praise',options);
	var opt = options||{};
	if(!opt.uniId){return;}
	Z.ajax({
		url:window.actionUrl.praise.url,
		type:window.actionUrl.praise.type,
		data:Z.extend({
			uniId:opt.uniId
		},getCommonReqData()),
		success:function(reply){
			console.log('praise reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			opt.callback&&opt.callback(reply);
		}
	});
}
function cancelPraise(options){
	console.log('call cancelPraise',options);
	var opt = options||{};
	if(!opt.uniId){return;}
	Z.ajax({
		url:window.actionUrl.cancelPraise.url,
		type:window.actionUrl.cancelPraise.type,
		data:Z.extend({
			uniId:opt.uniId
		},getCommonReqData()),
		success:function(reply){
			console.log('cancelPraise reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			opt.callback&&opt.callback(reply);
		}
	});
}
function comment(options){
	console.log('call comment',options);
	var opt = options||{};
	if(!opt.uniId||!opt.text){return;}
	var reqData = {
		uniId:opt.uniId,
		text:opt.text
	}
	if('targetName' in opt){
		if(!opt.targetId){return;}
		reqData.targetName = opt.targetName;
		reqData.targetId = opt.targetId;
	}
	Z.ajax({
		url:window.actionUrl.comment.url,
		type:window.actionUrl.comment.type,
		data:Z.extend(reqData,getCommonReqData()),
		success:function(reply){
			console.log('comment reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			opt.callback&&opt.callback(reply);
		},
		error:function(){
			//noNetwork();
		}
	});
}
function deleteComment(options){
	console.log('call deleteComment',options);
	var opt = options||{};
	if(!opt.uniId){return;}
	var reqData = {
		uniId:opt.uniId
	}
	Z.ajax({
		url:window.actionUrl.deleteComment.url,
		type:window.actionUrl.deleteComment.type,
		data:Z.extend(reqData,getCommonReqData()),
		success:function(reply){
			console.log('deleteComment reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			opt.callback&&opt.callback(reply);
		},
		error:function(){
			//noNetwork();
		}
	});
}
function follow(options){
	console.log('call follow',options);
	var opt = options||{};
	if(!opt.uniId){return;}
	Z.ajax({
		url:window.actionUrl.follow.url,
		type:window.actionUrl.follow.type,
		data:Z.extend({
			uniId:opt.uniId
		},getCommonReqData()),
		success:function(reply){
			console.log('follow reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			opt.callback&&opt.callback(reply);
		},
		error:function(){
			//noNetwork();
		}
	});
}
function cancelFollow(options){
	console.log('call cancelFollow',options);
	var opt = options||{};
	if(!opt.uniId){return;}
	Z.ajax({
		url:window.actionUrl.cancelFollow.url,
		type:window.actionUrl.cancelFollow.type,
		data:Z.extend({
			uniId:opt.uniId
		},getCommonReqData()),
		success:function(reply){
			console.log('cancelFollow reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			opt.callback&&opt.callback(reply);
		},
		error:function(){
			//noNetwork();
		}
	});
}
function donate(options){
	console.log('call donate',options);
	var opt = options||{};
	if(!opt.uniId||!opt.sum){return;}
	opt.callback&&opt.callback();
}
function changeMyWxConfig(nt,nd,nl,ni){
	if(nt&&nt.length>0){
		window.myWxConfig.title = nt;
	}
	if(nd&&nd.length>0){
		window.myWxConfig.desc = nd;
	}
	if(nl&&nl.length>0){
		window.myWxConfig.link = nl;
	}
	if(ni&&ni.length>0){
		window.myWxConfig.imgUrl = ni;
	}
}
function backToWx(){//第三方浏览器回到微信
	window.location.href = 'weixin://';
	//closeTab();
}
function closeWindow(){//微信关闭当前WebView
	wxReady(function(){
		wx.ready(function(){
			wx.closeWindow();
		});
	});
}
function wxPreviewImg(src,list){
	console.log('wxPreviewImg',src,list);
	wxReady(function(){
		wx.ready(function(){
			wx.previewImage({
    			current: src, // 当前显示图片的http链接
    			urls: list // 需要预览的图片http链接列表
			});
		});
	});
}
function getUniqueId(){//获取系统生成的唯一Id
	return ++window.countId;
}
function getCurTime(){//获取系统当前时间，单位秒
	return Math.floor((new Date()).valueOf()/1000);
}
function getAgeFromDate(date){
	date = date||'';
	var curYear = (new Date()).getFullYear();
	var year = parseInt(date.substring(0,4));
	var age = curYear-year;
	return age;
}
function getXingZuoFromDate(birthday){
	var birthdayArray,key;
	birthday = ''+birthday;
	if(birthday.indexOf('-')>=0){
		birthdayArray = birthday.split('-');
	}
	else{
		birthdayArray = [birthday.substring(0,4),birthday.substring(4,6),birthday.substring(6,8)]
	}
    for(key in birthdayArray){
      birthdayArray[key] = parseInt(birthdayArray[key]);
    }
    var timeLine=[1.01,1.21,2.19,3.21,4.21,5.21,6.22,7.23,8.23,9.23,10.23,11.22,12.22];
    var constellationArray=["魔羯座","水瓶座","双鱼座","白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","魔羯座"];
    var date = (birthdayArray[1]+birthdayArray[2]/100).toFixed(2);
    var constellationName = 'error';
    var i,j;
    for(i = 0; i < 13; i++){
      j = (i+1)%13;
      if(timeLine[j]>=date){
        constellationName = constellationArray[i];
        break;
      }
    }
    return constellationName;
}
function getDateFromTs(ts){//获取系统当前时间，单位秒
	if(ts<1444284263080){
		ts *= 1000;
	}
	var targetTime = new Date(ts);
	var year = targetTime.getFullYear();
	var month = targetTime.getMonth()+1;
	if(month<10){
		month = '0'+month;
	}
	var date = targetTime.getDate();
	if(date<10){
		date = '0'+date;
	}
	return ''+year+month+date;
}
function myUp(opt){//使用七牛的文件上传方案
	opt = opt||{};
	var mockToken = 'dexs';
	var data = Z.extend({},{
		runtimes:'html5,flash,html4',
        browse_button:opt.bb||'qnpick',
        container:opt.con||'qncon',
        max_file_size:'100mb',
        flash_swf_url:'../js/lib/Moxie.swf',
        chunk_size:'4mb',
        uptoken:mockToken,
        domain:'http://7xn981.com1.z0.glb.clouddn.com/',
        unique_names:true,
        multi_selection:opt.ms||false,
        get_new_uptoken:false,
        auto_start:true,
        init:{
        	FilesAdded:function(up,files){
        		//console.log('FilesAdded',arguments);
        	},
        	BeforeUpload:function(up,file){
        		//console.log('BeforeUpload',arguments);
        	},
        	UploadProgress:function(up,file){
        		//console.log('UploadProgress',arguments);
        	},
        	UploadComplete:function(){
        		//console.log('UploadComplete',arguments);
        	},
        	FileUploaded:function(up,file,info){
        		//console.log('FileUploaded',arguments);
        	},
        	Error:function(up,err,errTip){
        		alert('上传失败,请重试');
        		console.log('Error',arguments);
        	}
        }
	});
	var result = Qiniu.uploader(data);
	if(!Qiniu.token||Qiniu.token == mockToken){
		Z.ajax({
			url:'/qiNiuUpToken',
			type:'get',
			success:function(reply){
				//console.log('get qiNiuUpToken success',reply.uptoken);
				Qiniu.token = reply.uptoken;
			},
			error:function(){
				console.log('获取七牛uptoken失败');
			}
		});
	}
	return result;
}
function format(template,data){//使用data中的属性替换template中的关键字
	var reg;
	for(var key in data){
		if(data.hasOwnProperty(key)){
			if(typeof data[key] != 'object'){
				//template = template.replace('{'+key+'}', data[key]);
				reg = new RegExp('{'+key+'}','ig');
				template = template.replace(reg, data[key]);
			}
		}
	}
	return template;
}
function getValueFromSearch(key){//获取url中的参数
	//var str = window.location.hash;
	var str = window.location.search;
	if(str.length>1){
		str = str.substring(1);
		var array = str.split('&');
		var len = array.length;
		for(var i = 0; i < len; i++){
			var tmpArray = array[i].split('=');
			if(tmpArray&&tmpArray.length==2&&tmpArray[0]==key){
				return decodeURIComponent(tmpArray[1]);
			}
		}
	}
	return '';
}
function getCommonParams(){//拼接通用的url参数
	//var str = '#';
	var str = '?';
	str += 'uid='+encodeURIComponent(window.uid);
	str += '&sign='+encodeURIComponent(window.sign);
	//str += '&vs=' + window.myVs;
	//str += '&from='+encodeURIComponent(window.location.href);
	return str;
}
function getCommonReqData(){//获取通用请求参数
	return {
		uid:window.uid,
		ts:getCurTime(),
		sign:window.sign
	};
}
function replaceImgSrc(container){//替换某个dom节点下的img标签的preSrc属性为src属性
	var $t;
	if(typeof(container) == 'string'){
		$t = Z(container);
	}
	else{
		if(!container.css){
			$t = Z(container);
		}
		else{
			$t = container;
		}
	}
	if(!$t||$t.length<1){return;}
	var preSrc = $t.attr('preSrc');
	if(preSrc){
		$t.attr('src',preSrc);
	}
	$t.find('img').each(function(){
		if(Z(this).attr('src')){return;}
		preSrc = Z(this).attr('preSrc');
		if(!preSrc){return;}
		if(preSrc.indexOf('?')>=0){
			preSrc += '&vs='+ window.myVs;
		}
		else{
			preSrc += '?vs='+ window.myVs;
		}
		Z(this).attr('src',preSrc).removeAttr('preSrc');
	});
}
function lazyLoadImg(url,container){//加载图片成功后根据图片的比例设置css
	//console.log('lazyLoadImg',url,container);
	var img = document.createElement('img');
	var $t;
	if(typeof(container) == 'string'){
		$t = Z(container);
	}
	else{
		if(!container.css){
			$t = Z(container);
		}
		else{
			$t = container;
		}
	}
	$t.css('background-image','none').data('src',url);
	img.onload = function(){
		//console.log('imgOnload',$(this).data('psrc'),$t.data('src'));
		if($(this).data('psrc') != $t.data('src')){return;}
		$t.css('background-image','url('+this.src+')');
		var paWidth = $t.width()||parseInt($t.css('width'));
		var paHeight = $t.height()||parseInt($t.css('height'));
		$t.data('bgWidth',this.width).data('bgHeight',this.height);
		if(this.width*paHeight>this.height*paWidth){
			$t.css('background-size','auto 100%');
		}
		else{
			$t.css('background-size','100% auto');
		}
	}
	img.src = url;
	$(img).data('psrc',url);
}
function myAlert(title,content,callback){//自定义弹窗
	alert(content);
	if(typeof(callback)=='function'){
		callback();
	}
}
function showErrorText(error){//根据错误码显示报错信息
	var reply = '';
	var title = '哎呀，出错了';
	error = error || {code:'0'};
	error.code = ''+error.code;
	var callback;
	switch(error.code){
		case '100':
		reply = '服务器异常，错误码100，请稍后再试';
		break;
		default:
		reply = '未知错误码:'+error.code+'，请稍后再试';
		break;
	}
	myAlert(title,reply,callback);
}
function checkReply(reply){//检查返回参数的通用方法
	if(!reply){
		myAlert('哎呀，出错了','返回值为空，请稍后再试');
		return false;
	}
	if(typeof(reply)=='string'){
		try{
			reply = JSON.parse(reply);
		}
		catch(err){
			myAlert('哎呀，出错了','返回值为非法字符串，请稍后再试');
			return false;
		}
	}
	if('error' in reply){
		showErrorText(reply.error);
		return false;
	}
	return reply;
}
function wxInit(){//设置微信JSSdk
	wx.ready(function(re){
		wx.onMenuShareTimeline({
			title: window.myWxConfig.desc,
			link: window.myWxConfig.link,
			imgUrl: window.myWxConfig.imgUrl
		});
		wx.onMenuShareAppMessage({
			title: window.myWxConfig.title,
			desc: window.myWxConfig.desc,
			link: window.myWxConfig.link,
			imgUrl: window.myWxConfig.imgUrl
		});
		wx.checkJsApi({
			jsApiList: window.usedJsApi,
			success: function(res) {
				console.log('new checkJsApi reply:',res);
			}
		});
	});
	wx.error(function(res){
		console.log('wx config err:',res);
		//alert('wx config err:'+JSON.stringify(res));
	});
	var curUrl = window.location.href.split('#')[0];
	Z.ajax({
		url:window.actionUrl.getJSParams.url,
		type:window.actionUrl.getJSParams.type,
		data:Z.extend(getCommonReqData(),{url:curUrl}),
		success:function(reply){
			if(!reply||!reply.appid){return;}
			//console.log('init wxConfigData:'+JSON.stringify(reply));
			wx.config({
				debug: false, 
				appId: reply.appid, 
				timestamp: reply.ts, 
				nonceStr: reply.nonceStr,
				signature: reply.signature,
				jsApiList: window.usedJsApi
			});
		},
		error:function(err){
			console.log('get wx info error',err);
		}
	});
}
function removeExcept(arr){//清除除了arr之外的元素
	if(typeof(arr)!='object'||!arr.length||!arr.indexOf){return;}
	Z(document.body).children().each(function(){
		if(arr.indexOf(Z(this).attr('id'))<0){
			Z(this).remove();
		}
	});
}
function pageReload(){
	window.location.reload();
}
function noNetworkInit(){
	if(window.noNetworkInited){return;}
	window.noNetworkInited = true;
	Z(document.body).append([
		"<div id='noNetwork'>",
			"<img preSrc='"+window.imgUrl.noNetwork+"'>",
    		"<div class='text'>抱歉，您的网络似乎睡着了。</div>",
   			"<button class='pageReload'>重新加载</button>",
   		"</div>"].join(''));
}
function noNetwork(){
	if(!window.noNetworkInited){return;}
	removeExcept(['noNetwork']);
	Z(document.body).css('background','#f4f4f4');
	Z('#noNetwork').addClass('visible');
	replaceImgSrc('#noNetwork');
	Z('#noNetwork .pageReload').off('click').on('click',function(){
		pageReload();
	});
}
function loadJsArray(array,callback){//按序加载js数组
	var num = array.length;
	function load(index){
		var s,l;
		if(index>=num){
			callback&&callback();
			return;
		}
		if(array[index].key in window){
			load(index+1);
			return;
		}
		s = document.createElement('script');
		l = setInterval(function(){
			if(array[index].key in window){
				clearInterval(l);
				load(index+1);
			}
		},20);
		s.src = array[index].url;
		document.body.appendChild(s);
	}
	load(0);
}
function checkReady(key,callback){
	if(!callback){return;}
	function isReady(){
		return (key in window);
	}
	if(isReady()){
		callback&&callback();
		return;
	}
	var loopCheck = setInterval(function(){
		if(isReady()){
			clearInterval(loopCheck);
			callback&&callback();
		}
	},100);
}
var qnImg = {
	basic:'imageView2',
	senior:'imageMogr2',
	and:'|',
	base:function(){
		return this.senior+'/auto-orient';
	},
	minAndClip:function(width,height){
		return this.basic+'/1/w/'+width+'/h/'+height;
	},
	in:function(width,height){
		return this.basic+'/2/w/'+width+'/h/'+height;
	},
	min:function(width,height){
		return this.basic+'/3/w/'+width+'/h/'+height;
	},
	widthScale:function(width){
		return this.senior+'/thumbnail/'+width+'x';
	},
	heightScale:function(height){
		return this.senior+'/thumbnail/x'+height;
	},
	format:function(type){
		return this.senior+'/format/'+type;
	},
	blur:function(radius,sigma){
		return this.senior+'/blur/'+radius+'x'+sigma;
	},
	interlace:function(){
		return this.senior+'/interlace/1';
	},
	quality:function(num){
		return this.senior+'/quality/'+num;
	}
}
function qiNiuReady(callback){//赋予七牛js加载完之后的任务
	loadJsArray([{
		url:'../js/lib/plupload.full.min.js',
		key:'plupload'
	},{
		url:'../js/lib/qiniu.js',
		key:'Qiniu'
	}],callback);
}
function FastClickReady(callback){
	loadJsArray([{
		url:'../js/lib/FastClick.js',
		key:'FastClick'
	}],callback);
}
function linkMapReady(callback){
	loadJsArray([{
		url:'../js/LinkMap.horizontal.js?v='+window.myVs,
		key:'LinkMap'
	}],callback);
}
function qrcodeReady(callback){
	loadJsArray([{
		url:'../js/lib/qrcode.js',
		key:'QRCode'
	}],callback);
}
function makeqr(qrNode,qrAddress,logoUrl,logoSize){
	if(!qrNode||!qrAddress){return;}
	qrcodeReady(function(){
		var paWidth = Z(qrNode).hide().parent().width();
		var qrSize = window.dpi*paWidth;
		logoSize = logoSize||Math.floor(qrSize/4);
		var qrcode = new QRCode(qrNode,{
			width : qrSize,
			height : qrSize
		});
		console.log('makeCode',qrAddress);
		qrcode.makeCode(qrAddress);
		if(!logoUrl){
			Z(qrNode).show();
			return;
		}
		var qrCanvas = Z(qrNode).find('canvas')[0];
		var ctx = qrCanvas.getContext('2d');
		var logoImg = document.createElement('img');
		logoImg.onload = function(){
			ctx.drawImage(this,(qrSize-logoSize)/2,(qrSize-logoSize)/2,logoSize,logoSize);
			Z(qrNode).find('img').attr('src',qrCanvas.toDataURL('image/png'));
			Z(qrNode).show();
		}
		logoImg.src = logoUrl;
	});
}
function wxReady(callback){
	loadJsArray([{
		url:'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
		key:'wx'
	}],callback);
}
function highchartsReady(callback){
	loadJsArray([{
		url:'../js/lib/highcharts.js',
		key:'jQuery'
	}],callback);
}
function swiperReady(callback){
	loadJsArray([{
		url:'../js/lib/swiper.js',
		key:'Swiper'
	}],callback);
}
function locationReady(callback){
	loadJsArray([{
		url:'../js/lib/location.js',
		key:'myCity'
	}],callback);
}
function tabInit(){//页面间导航
	if(window.tabInited||Z(document.body).hasClass('noTab')){return;}
	window.tabInited = true;
	Z(document.body).append([
		'<div id="myTab">',
			'<div class="tab left nav" data-url="actList.html">',
				'<button class="act">',
					'<img src="'+window.imgUrl.greenFire+'?vs='+window.Version+'">',
					'<span>发现挑战</span>',
				'</button>',
			'</div>',
			'<div class="tab mid nav" data-url="createAct.html">',
				'<button class="act">',
					'<img src="'+window.imgUrl.tabCreate+'?vs='+window.Version+'">',
					'<span>创建挑战</span>',
				'</button>',
			'</div>',
			'<div class="tab right">',
				'<button class="act">',
					'<img src="'+window.imgUrl.tabMore+'?vs='+window.Version+'">',
					'<span>更多</span>',
				'</button>',
				'<div class="pop">',
					'<div class="nav first" data-url="settings.html">用户设置</div>',
					'<div class="nav" data-url="about.html">活动介绍</div>',
					'<div class="nav last" data-url="download.html">APP下载</div>',
					'<div class="arrow"></div>',
				'</div>',
			'</div>',
   		'</div>'].join(''));
	Z('#myTab').on('click','.nav',function(e){
		//console.log('tab nav onclick',this);
		var targetUrl = Z(this).attr('data-url');
		if(targetUrl){
			var arr = targetUrl.split('#');
			if(arr.length>1){
				window.location.href = arr[0]+getCommonParams()+'#'+arr[1];
			}
			else{
				window.location.href = arr[0]+getCommonParams();
			}
		}
		Z('#myTab .nav').removeClass('cur');
		Z(this).addClass('cur');
		Z('#myTab .pop').removeClass('visible');
	}).on('click','.act',function(e){
		//console.log('tab act onclick',this);
		var $p = Z(this).parent().find('.pop');
		if($p.hasClass('visible')){
			$p.removeClass('visible');
		}
		else{
			Z('#myTab').find('.pop').removeClass('visible');
			$p.addClass('visible');
		}
	}).on('click',function(e){
		e.stopPropagation();
	});
	Z('#myTab .nav').each(function(){
		var targetUrl = Z(this).attr('data-url');
		if(targetUrl){
			var arr = targetUrl.split('#');
			if(location.hash.length){
				if(arr.length>1){
					if(window.location.href.indexOf(arr[0])>=0&&window.location.hash.indexOf(arr[1])>=0){
						Z(this).addClass('cur');
					}
					else{
						Z(this).removeClass('cur');
					}
				}
				else{
					Z(this).removeClass('cur');
				}
			}
			else{
				if(arr.length>1){
					Z(this).removeClass('cur');
				}
				else{
					if(window.location.href.indexOf(targetUrl)>=0){
						Z(this).addClass('cur');
					}
					else{
						Z(this).removeClass('cur');
					}
				}
			}
		}
	});
	Z('#myTab .tab').each(function(){
		if(Z(this).hasClass('cur')){return;}
		var navs = Z(this).find('.nav');
		var len = navs.length;
		for(var i = 0; i < len; i++){
			if(Z(navs[i]).hasClass('cur')){
				Z(this).addClass('cur');
				return;
			}
		}
		Z(this).removeClass('cur');
	});
	Z(document.body).on('click',function(){
		Z('#myTab .pop').removeClass('visible');
	});
}
function userInit(data){
	if(!data){return;}
	window.userInfo = Z.extend({},data);
}
function userReady(callback){
	checkReady('userInfo',callback);
}
function shareGuideInit(){
	var shareId = 'shareGuide';
	if(Z('#'+shareId).length){return;}
	Z(document.body).append([
		"<div id='"+shareId+"'>",
			"<div class='text'></div>",
   		"</div>"].join(''));
	Z('#'+shareId).on('click',function(){
		Z(this).hide();
	});
}
function shareGuide(text){
	replaceImgSrc('shareGuide');
	Z('#shareGuide').show().find('.text').html(text||'约会挑战');
}
function judgeScroll(node){
	var loop;
	function judge(){
		//console.log('here node 2',node,node.scrollHeight,Z(node).height())
		if(node.scrollHeight>0){
			if(node.scrollHeight<Z(node).height()+2){
				Z(node).addClass('noScroll');
			}
			else{
				Z(node).removeClass('noScroll');
			}
			clearInterval(loop);
		}
	}
	loop = setInterval(judge,50);
	judge();
}
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}


// //基于requestAnimationFrame动画
// function animate(element, name, from, to, time) {
// 	time = time || 800; // 默认0.8秒
// 	var style = element.style;

// 	var latency = 13; // 时间间隔 每13ms一次变化
// 	var count = parseInt(time / latency); // 变化的次数
// 	var step = Math.round((to - from) / count); // 步长 每一步的变化量
// 	var now = from;

// 	function go() {
// 		count--;
// 		now = count ? now + step : to;
// 		style[name] = now + 'px';
// 		if (count) {
// 			setTimeout(go, latency);
// 		}
// 	}

// 	style[name] = from + 'px';
// 	setTimeout(go, latency);
// }

// var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
// 	function (callback) {
// 		setTimeout(callback, 1000 / 60);
// 	};

// function animate1(element, name, from, to, time) {
// 	time = time || 800; // 默认0.8秒
// 	var startTime = new Date;

// 	function go(timestamp) {
// 		console.log(timestamp)

// 		var progress = timestamp - startTime;
// 		if (progress >= time) {
// 			element.style[name] = to + 'px';
// 			return;
// 		}

// 		var now = (to - from) * (progress / time);
// 		element.style[name] = now.toFixed() + 'px';

// 		//console.log(now.toFixed())
// 		requestAnimationFrame(go);
// 	}

// 	element.style[name] = from + 'px';

// 	requestAnimationFrame(go);
// }

// //animate1(document.getElementById('holder'), 'marginLeft', 0, 180, 500)




Z(function(){

	window.dpi = window.devicePixelRatio||2;
	var ua = window.navigator.userAgent.toLowerCase();
	window.isWx = (ua.match(/MicroMessenger/i) == 'micromessenger');
	var isIphoneOs = (ua.match(/iphone os/i) == "iphone os");
	var isIpad = (ua.match(/ipad/i) == "ipad");
	var isIpod = (ua.match(/ipod/i) == "ipod");
	window.isIos = (isIphoneOs||isIpad||isIpod);
	var _isAndroid = (ua.indexOf('android')>-1);
	var _isLinux = (ua.indexOf('linux')>-1);
	window.isAndroid = (_isAndroid||_isLinux);
	window.isMobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)

	noNetworkInit();
	shareGuideInit();
	tabInit();

	// Z(document.body).on('touchmove','.noScroll',function(e){
	// 	e.preventDefault();
	// });

	Z(window).on('resize',function(){
		window.fontSize = parseInt(Z(document.body).css('font-size'))||16;
		Z('.bgCon').each(function(){
			var $t = Z(this);
			var bgWidth = $t.data('bgWidth');
			var bgHeight = $t.data('bgHeight');
			if(!bgWidth||!bgHeight){
				return;
			}
			var paWidth = $t.width()||parseInt($t.css('width'));
			var paHeight = $t.height()||parseInt($t.css('height'));
			if(bgWidth*paHeight>bgHeight*paWidth){
				$t.css('background-size','auto 100%');
			}
			else{
				$t.css('background-size','100% auto');
			}
		});
	}).trigger('resize');

	wxReady(function(){
		wxInit();
	});

	FastClickReady(function(){
		FastClick.attach(document.body);
	});

	Z.fn.mySelect = function(callback){
		return this.each(function(){
			Z(this).parent().addClass('mySelect').append('<button class="text"></button>');
			Z(this).off('change').on('change',function(){
				var $text = Z(this).parent().find('.text');
				if(typeof(callback)=='function'){
					$text.html(callback(this.value));
				}
				else{
					$text.html(this.value);
				}
			}).trigger('change');
		});
	}

	Z('select').on('touchstart',function(e){
		e.preventDefault();
	});

	Z.ajax({
		url:window.actionUrl.getUserInfo.url,
		type:window.actionUrl.getUserInfo.type,
		data:getCommonReqData(),
		success:function(reply){
			console.log('getUserInfo reply',reply);
			reply = checkReply(reply);
			if(!reply){return;}
			userInit(reply);
		},

		error:function(){
			noNetwork();
		}
	});

	Z.extend({
		formateString : function(str, data){
			//\w+,表示一个或多个\w,最少一个
			//\w 表示 字符 数字
			//函数表示 用json替换正则表达式找到的值
			return str.replace(/@\((\w+)\)/g, function(match, key){
				return typeof data[key] === "undefined" ? '' : data[key]});
		}
	})


	Z('#tabNav').on('click','.nav',function(){
		if(Z(this).hasClass('current')){return;}
		Z('#tabNav').find('.nav').removeClass('current');
		Z(this).addClass('current');
		var targetId = Z(this).attr('targetId');
		Z('.tabPage').hide();
		Z('#'+targetId).show();
	});

	// (function($) {
	// 	function times(string, number) {
	// 		for (var i = 0, r = ''; i < number; i ++) r += string;
	// 			return r;
	// 	}

	// 	$.fn.autogrow = function(options) {
	// 		this.filter('textarea').each(function() {
	// 			this.timeoutId = null;
	// 			var $this = $(this), minHeight = $this.height();
	// 			var shadow = $('<div></div>').css({
	// 				position:   'absolute',
	// 				wordWrap:   'break-word',
	// 				top:        0,
	// 				left:       -9999,
	// 				//display:    'none',
	// 				width:      $this.width(),
	// 				fontSize:   $this.css('font-size'),
	// 				fontFamily: $this.css('font-family'),
	// 				lineHeight: $this.css('line-height')
	// 			}).appendTo(document.body);

	// 			var update = function() {
	// 				var val = this.value.replace(/</g, '&lt;')
	// 				.replace(/>/g, '&gt;')
	// 				.replace(/&/g, '&amp;')
	// 				.replace(/\n$/, '<br/>&nbsp;')
	// 				.replace(/\n/g, '<br/>')
	// 				.replace(/ {2,}/g, function(space) { return times('&nbsp;', space.length -1) + ' ' });
	// 				shadow.html(val);
	// 				var newHeight = Math.max(shadow.height(), minHeight);
	// 				if(options.maxHeight){
	// 					newHeight = Math.min(options.maxHeight,newHeight);
	// 				}
	// 				$(this).css('height', newHeight);
	// 			}

	// 			var updateTimeout = function() {
	// 				clearTimeout(this.timeoutId);
	// 				var that = this;
	// 				this.timeoutId = setTimeout(function(){ update.apply(that); }, 100);
	// 			};

	// 			$(this).change(update).keyup(updateTimeout).keydown(updateTimeout);
	// 			update.apply(this);
	// 		});
	// 		return this;
	// 	}
	// })(Z);
	window.String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g,'');
	}
});