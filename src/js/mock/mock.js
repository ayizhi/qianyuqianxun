'use strict';
window.Z = window.Zepto;
function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function base64encode(str) {
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		out += base64EncodeChars.charAt(c3 & 0x3F);
	}
	return out;
}
var safe64 = function(base64) {
	base64 = base64.replace(/\+/g, "-");
	base64 = base64.replace(/\//g, "_");
	return base64;
};
function genToken(accessKey, secretKey, putPolicy) {
	var put_policy = JSON.stringify(putPolicy);
	var encoded = base64encode(utf16to8(put_policy));
	var hash = CryptoJS.HmacSHA1(encoded, secretKey);
	var encoded_signed = hash.toString(CryptoJS.enc.Base64);
	var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;
	return upload_token;
};
var myQiNiu = {
	domain:'http://7xn981.com1.z0.glb.clouddn.com',
	Bucket: "test",
    AK: "fPE6HIGbPDSRjPi1HQge9gWI9QKgl-z8-WUoNG5Z",
    SK: "iuVCHbBF-isVwIl5s9Wz9sSc6pmnPNmsrqvX0Oeg",
    putPolicy:{
    	scope:'test',
    	deadline:getCurTime()+24*3600
    }
}
function mockQiNiuReady(callback){
	loadJsArray([{
		url:'../js/lib/plupload.full.min.js',
		key:'plupload'
	},{
		url:'../js/lib/crypto.min.js',
		key:'CryptoJS'
	},{
		url:'../js/lib/qiniu.js',
		key:'Qiniu'
	}],callback);
}
var linkMaleData = [
	[10,9,8,7,6],
	[9,8,7,6,10],
	[8,7,6,10,9],
	[7,6,10,9,8],
	[6,10,9,8,7]
]
var linkFemaleData = [];
(function(){
	var len = linkMaleData.length;
	for(var i = 0; i < len; i++){
		linkFemaleData.push([]);
		for(var j = 0; j < len; j++){
			linkFemaleData[i].push(linkMaleData[j][i]);
		}
	}
})();
var linkMaleMap = {
	1:{
		num:2
	},
	2:{
		num:4
	},
	3:{
		num:5
	},
	4:{
		num:3
	},
	5:{
		num:1
	}
}
var linkFemaleMap = {};
(function(){
	for(var key in linkMaleMap){
		linkFemaleMap[linkMaleMap[key].num] = {
			num:key
		};
	}
})();
function mockAjax(options){
	console.log('mockAjax',options);
	if(!options.success&&!options.error){return;}
	var actIdArray = [0,1,2,3,4];
	var isCreatorArray = [1,0,0,0,0];
	var registeredArray = [1,0,1,1,1];
	var statusArray = [0,0,1,2,0];
	var coverArray = [
		'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png',
		'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%205.png',
		'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%204.png',
		'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%203.png',
		'http://7xn981.com2.z0.glb.qiniucdn.com/002564a5ddfa10a562f64c.jpg'
	]
	var titleArray = [
		'未名湖畔 相遇鹊桥',
		'水木清华 爱在水木',
		'你们约会我买单',
		'你们约会我买单',
		'你们约会我买单'
	]
	var creatorNameArray = [
		'北大未名BBS',
		'五道口技工学院',
		'杜聪',
		'蒋超',
		'乔主席'
	]
	var creatorHeadArray = [
		'http://7xn981.com2.z0.glb.qiniucdn.com/002564a5ddfa10a562f64c.jpg',
		'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg',
		'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
		'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
		'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg'
	]
	var createTimeArray = [
		1444284263,
		1444284263,
		1444284263,
		1444284263,
		1444284263
	]
	setTimeout(function(){
		switch(options.url){
			case '/wx/user/getcaptcha'://获取手机验证码
				options.complete && options.complete();
				if(options.type == "post"){
					options.success && options.success({
						status:0
					})
				}else{
					options.error && options.error();
				}
				break;
			case '/wx/user/verifymobile'://获取手机验证码
				options.complete && options.complete();
				if(options.type == "post"){
					options.success && options.success({
						status:0
					})
				}else{
					options.error && options.error();
				}
				break;
			case '/qiNiuUpToken'://获取七牛上传凭证
			options.complete&&options.complete();
			if(options.type == 'get'){
				myQiNiu.uptoken = genToken(myQiNiu.AK,myQiNiu.SK,myQiNiu.putPolicy);
				options.success&&options.success({
					uptoken:myQiNiu.uptoken
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/create'://创建活动
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0,
					actId:1,
					actToken:'dc'
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/getList'://获取活动列表
			options.complete&&options.complete();
			if(options.type == 'get'){
				options.success&&options.success({
					list:[
					{
						uniId:'1221ex',
						actId:actIdArray[0],
						actToken:'xxxx',
						title:titleArray[0],
						creatorName:creatorNameArray[0],
						creatorHead:creatorHeadArray[0],
						createTime:createTimeArray[0],
						status:statusArray[0],
						cover:coverArray[0],
						followed:0,
						tag:'热门'
					},
					{
						uniId:'1221ex',
						actId:actIdArray[1],
						actToken:'xxxx',
						title:titleArray[1],
						creatorName:creatorNameArray[1],
						creatorHead:creatorHeadArray[1],
						createTime:createTimeArray[1],
						status:statusArray[1],
						cover:coverArray[1],
						followed:1,
						tag:'好友'
					},
					{
						uniId:'1221ex',
						actId:actIdArray[2],
						actToken:'xxxx',
						title:titleArray[2],
						creatorName:creatorNameArray[2],
						creatorHead:creatorHeadArray[2],
						createTime:createTimeArray[2],
						status:statusArray[2],
						cover:coverArray[2],
						followed:1,
						tag:'附近'
					},
					{
						uniId:'1221ex',
						actId:actIdArray[3],
						actToken:'xxxx',
						title:titleArray[3],
						creatorName:creatorNameArray[3],
						creatorHead:creatorHeadArray[3],
						createTime:createTimeArray[3],
						status:statusArray[3],
						cover:coverArray[3],
						followed:1,
						tag:'附近'
					},
					{
						uniId:'1221ex',
						actId:actIdArray[4],
						actToken:'xxxx',
						title:titleArray[4],
						creatorName:creatorNameArray[4],
						creatorHead:creatorHeadArray[4],
						createTime:createTimeArray[4],
						cover:coverArray[4],
						status:statusArray[4],
						followed:1,
						tag:'附近'
					}
					]
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/sendBarrage':
				options.complete && options.complete();
				if(options.type == 'post'){
					options.success && options.success({
						status:0
					})
				}else{
					options.error && options.error();
				}
				break;
			case '/wx/act/getBarrage':
				options.complete && options.complete();
				if(options.type == 'get'){
					options.success && options.success({
						list:[
							{
								uniId:12341,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png',
								praised:12,
								text:"真棒，这个app太有意啊的说法是打工啊大哥啊受到了客萨嘎的时间申达股份撒旦就哈圣诞节哈圣诞节哈是假的啊几乎覆盖按时间和发动机好噶的",
								ts:921048321905

							}
							,
							{
								uniId:12342,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
								praised:23,
								text:"真棒，这个思了",
								ts:921048321905

							}
							,
							{
								uniId:12343,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/002564a5ddfa10a562f64c.jpg',
								praised:49,
								text:"真棒，这个app太有意思了啊速度发多少个点",
								ts:921048321905

							},
							{
								uniId:12344,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
								praised:120,
								text:"真棒，这个有意思了",
								ts:921048321905

							}
							,
							{
								uniId:12345,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
								praised:623,
								text:"真棒，这个app太有意思了啊是的撒发",
								ts:921048321905

							},
							{
								uniId:12346,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg',
								praised:623,
								text:"真棒，这个app太有意思了啊是的撒发",
								ts:921048321905

							},
							{
								uniId:12347,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
								praised:623,
								text:"真棒，这个app太有意思了啊是的撒发",
								ts:921048321905
							},
							{
								uniId:12348,
								headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg',
								praised:623,
								text:"真棒，这个app太有意思了啊是的撒发",
								ts:921048321905

							}
							//,
							//{
							//	uniId:12349,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
							//},
							//{
							//	uniId:12350,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
                            //
							//},
							//{
							//	uniId:12351,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
							//},
							//{
							//	uniId:12352,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
                            //
							//},
							//{
							//	uniId:12353,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
							//},
							//{
							//	uniId:123454,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
                            //
							//},
							//{
							//	uniId:12355,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
							//},
							//{
							//	uniId:12356,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
                            //
							//},
							//{
							//	uniId:12357,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
							//},
							//{
							//	uniId:12358,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
                            //
							//},
							//{
							//	uniId:12359,
							//	headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
							//	praised:623,
							//	text:"真棒，这个app太有意思了啊是的撒发",
							//	ts:921048321905
							//}


						]
					})

				}else{
					options.error&&options.error();
				}
				break;

			case '/wx/act/getListPic':
				options.complete&&options.complete();
				if(options.type == 'get'){
					options.success&&options.success({
						list:[
							{
								uniId:'1221ex',
								actId:1,
								actToken:'xxxx',

								title:'未名湖畔 相聚鹊桥',
								creatorName:'杜聪',
								creatorHead:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
								creatorBackground:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3kkiml671pks1lip1tgs1qbd9.jpg',
								createLocation:"北京大学",
								createTime:1444284263,

								status:0,
								followed:1,
								tag:'附近'
							},
							{
								uniId:'1221ex',
								actId:2,
								actToken:'xxxx',

								title:'水木清华 爱在北大',
								creatorName:'杜聪',
								creatorHead:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg',
								creatorBackground:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg',
								createLocation:"五道口技工学院",
								createTime:1444284263,

								status:1,
								followed:1,
								tag:'附近'
							},
							{
								uniId:'1221ex',
								actId:3,
								actToken:'xxxx',

								title:'人大有海 爱在清华',
								creatorName:'杜聪',
								creatorHead:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
								creatorBackground:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
								createLocation:"人民大学",
								createTime:1444284263,

								status:3,
								followed:1,
								tag:'附近'
							},
							{
								uniId:'1221ex',
								actId:4,
								actToken:'xxxx',

								title:'未名湖畔 相聚鹊桥',
								creatorName:'杜聪',
								creatorHead:'http://7xn981.com2.z0.glb.qiniucdn.com/002564a5ddfa10a562f64c.jpg',
								creatorBackground:'http://7xn981.com2.z0.glb.qiniucdn.com/002564a5ddfa10a562f64c.jpg',
								createLocation:"北京大学",
								createTime:1444284263,

								status:2,
								followed:1,
								tag:'附近'
							},
							{
								uniId:'1221ex',
								actId:5,
								actToken:'xxxx',

								title:'未名湖畔 相聚鹊桥',
								creatorName:'杜聪',
								creatorHead:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg',
								creatorBackground:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg',
								createLocation:"北京大学",
								createTime:1444284263,

								status:0,
								followed:1,
								tag:'附近'
							}
						]

					})
				}
				else{
					options.error&&options.error();
				}
				break;

			case '/wx/act/getDetail'://获取活动详情
			options.complete&&options.complete();
			var actId = options.data.actId;
			var isCreator = isCreatorArray[actId];
			var status = statusArray[actId];
			var registered = registeredArray[actId];
			if(options.type == 'get'){
				options.success&&options.success({
					uniId:'1221ex',
					title:titleArray[actId],
					cover:coverArray[actId],
					creatorId:'dc',
					creatorName:creatorNameArray[actId],
					creatorHead:creatorHeadArray[actId],
					createTime:createTimeArray[actId],
					status:status,//0报名中，1连线中，2约会中
					pairs:5,
					linkData:linkFemaleData,
					followed:true,
					tag:'热门',
					desc:'光棍节让我们相互取暖',
					regDeadline:'2015-11-11',
					linkingDeadline:3600,
					registered:registered,//是否已经报名

					danmuNum:1234,//弹幕数
					qianXianNum:4356,//牵线数
					visitorNum:656,//围观数

					males:[
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/m1.png',
						nickname:'男2号',
						linkedNumber:linkMaleMap[2].num,
						taskNum:1,
						guestNumber:2,
						guestId:'dc'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/m2.png',
						nickname:'男5号',
						linkedNumber:linkMaleMap[5].num,
						taskNum:2,
						guestNumber:5,
						guestId:'jc'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/m3.png',
						nickname:'男1号',
						linkedNumber:linkMaleMap[1].num,
						taskNum:3,
						guestNumber:1,
						guestId:'wc'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/m4.png',
						nickname:'男3号',
						linkedNumber:linkMaleMap[3].num,
						taskNum:4,
						guestNumber:3,
						guestId:'uc'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/m5.png',
						nickname:'男4号',
						linkedNumber:linkMaleMap[4].num,
						taskNum:5,
						guestNumber:4,
						guestId:'kc'
					}],
					females:[
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f0.png',
						nickname:'女3号',
						linkedNumber:linkFemaleMap[3].num,
						taskNum:1,
						guestNumber:3,
						guestId:'dc'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f1.png',
						nickname:'女4号',
						linkedNumber:linkFemaleMap[4].num,
						taskNum:2,
						guestNumber:4,
						guestId:'ac'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f2.png',
						nickname:'女1号',
						linkedNumber:linkFemaleMap[1].num,
						taskNum:4,
						guestNumber:1,
						guestId:'bc'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f3.png',
						nickname:'女5号',
						linkedNumber:linkFemaleMap[5].num,
						taskNum:3,
						guestNumber:5,
						guestId:'cc'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f4.png',
						nickname:'女2号',
						linkedNumber:linkFemaleMap[2].num,
						taskNum:5,
						guestNumber:2,
						guestId:'fc'
					}]
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/register'://报名活动
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/getRegList'://创建者查看报名列表
			options.complete&&options.complete();
			var femaleArray = [];
			var femaleNum = 10+Math.floor(Math.random()*30);
			var maleArray = [];
			var maleNum = 10+Math.floor(Math.random()*30);
			var i;
			for(i = 0; i < femaleNum; i++){
				femaleArray.push({
					uid:'ff'+i,
					nickname:'报名女'+i,
       				mobile:'15201317810',
       				wx:'dc',
        			birthday:'199'+Math.floor(Math.random()*10)+'-03-13',
        			sex:0,
        			headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f'+Math.floor(5*Math.random())+'.png',
        			photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
        			selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
        			expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',
					province:'湖北',
					city:'武汉'
				});
			}
			for(i = 0; i < maleNum; i++){
				maleArray.push({
					uid:'mm'+i,
					nickname:'报名男'+i,
       				mobile:'15201317810',
       				wx:'dc',
        			birthday:'199'+Math.floor(Math.random()*10)+'-03-13',
        			sex:1,
        			headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/m'+Math.floor(5*Math.random())+'.png',
        			photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
        			selfIntro:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',
        			expectation:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
					province:'湖北',
					city:'咸宁'
				});
			}
			var totalArray = femaleArray.concat(maleArray);
			if(options.type == 'get'){
				options.success&&options.success({
					list:totalArray
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/chooseGuest'://创建者选拨并公布嘉宾列表
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/getRegisterInfo'://获取活动报名已填写的资料
			options.complete&&options.complete();
			if(options.type == 'get'){
				options.success&&options.success({
					nickname:'已经报名的杜聪',
        			birthday:'1992-03-13',
        			sex:1,
        			wx:'suoXingSuiXin',
        			province:'湖北',
        			city:'咸宁',
        			headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
        			photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
        			selfIntro:'Hello World',
        			expectation:'Hello dc'
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/getGuestInfo'://获取活动嘉宾的资料
			options.complete&&options.complete();
			if(options.type == 'get'){
				var isFemale = (options.data.sex == 0)
				var sexFlag = (isFemale)?'女':'男';
				var femaleHead = 'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3jt1l1he01nmdhna1u251pcl9.jpg';
				var maleHead = 'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg';
				var headImg = (isFemale)?femaleHead:maleHead;
				options.success&&options.success({
					nickname:sexFlag+'1号',
        			birthday:'1992-03-13',
        			province: "广东", 
        			city: "广州",
        			headImg:headImg,
        			photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
        			selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
        			expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',
					recommended:0,
					recommends:[
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g91ug018q4iatg1vqgs1u1s1b.jpeg',
						nickname:'杜聪',
						text:'她在与人相处的过程中非常的真诚！'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1ap81uu1hmh1sfr166o38oj5e7.jpeg',
						nickname:'王娜',
						text:'全身充溢着少女的纯情和青春的风采。留给我印象最深的是你那双湖水般清澈的眸子，以及长长的、一闪一闪的睫毛。像是探询，像是关切，像是问候。'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/002564a5ddfa10a562f64c.jpg',
						nickname:'蒋超',
						text:'美少女一枚'
					},
					{
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
						nickname:'杜聪'
					},
					{
						nickname:'杜聪',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f1.png'
					},
					{
						nickname:'杜聪',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f2.png'
					},
					{
						nickname:'杜聪',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/f4.png'
					}
					]
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/recommendGuest'://为好友写推荐语
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/submitLink'://提交连线方案
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/getDatingTasks'://请求约会任务列表
			options.complete&&options.complete();
			if(options.type == 'get'){
				options.success&&options.success({
					tasks:[
					{
						uniId:'task1',
						title:'一块儿吃个晚饭',
						taskId:4,
						praiseNum:123,
						praised:0,
						flag:1,
						date:'2015-10-01',
						reply:'今天一块儿吃了巫山烤全鱼，开心~~',
						photos:['http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%203.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%204.png'],
						commentList:[
						{
							uniId:'qqq',
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							text:'晚餐很浪漫喔~',
							ts:20123123
						},
						{
							uniId:'www',
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							text:'你也可以去参加一个啊',
							targetName:'杜聪',
							targetId:'dc',
							ts:20123123
						}
						],
						praiseList:[
						{
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						}
						]
					},
					{
						uniId:'task2',
						title:'一块儿吃个晚饭',
						taskId:3,
						praiseNum:123,
						praised:1,
						flag:0,
						date:'2015-09-30',
						reply:'今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~今天一块儿吃了巫山烤全鱼，开心~~',
						photos:['http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%203.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%204.png'],
						commentList:[
						{
							uniId:'qqq',
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							text:'晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~晚餐很浪漫喔~',
							ts:20123123
						},
						{
							uniId:'www',
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							text:'你也可以去参加一个啊',
							targetName:'杜聪',
							targetId:'dc',
							ts:20123123
						}
						],
						donateList:[
						{
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							sum:100,
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							sum:50,
							ts:20123123
						}
						]
					},
					{
						uniId:'task3',
						title:'一块儿吃个晚饭',
						taskId:2,
						praiseNum:123,
						praised:0,
						flag:0,
						date:'2015-09-29',
						reply:'今天一块儿吃了巫山烤全鱼，开心~~',
						photos:['http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%203.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%204.png'],
						praiseList:[
						{
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						}
						],
						donateList:[
						{
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							sum:100,
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							sum:50,
							ts:20123123
						}
						]
					},
					{
						uniId:'task4',
						title:'一块儿吃个晚饭',
						taskId:1,
						praiseNum:123,
						praised:1,
						flag:0,
						date:'2015-09-28',
						reply:'今天一块儿吃了巫山烤全鱼，开心~~',
						photos:['http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%203.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%204.png'],
						commentList:[
						{
							uniId:'qqq',
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							text:'晚餐很浪漫喔~',
							ts:20123123
						},
						{
							uniId:'www',
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							text:'你也可以去参加一个啊',
							targetName:'杜聪',
							targetId:'dc',
							ts:20123123
						}
						],
						praiseList:[
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							ts:20123123
						}
						],
						donateList:[
						{
							nickname:'杜聪',
							ownerId:'dc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
							sum:100,
							ts:20123123
						},
						{
							nickname:'蒋超',
							ownerId:'jc',
							headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
							sum:50,
							ts:20123123
						}
						]
					}
					]
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/act/getDatingTaskDetail'://请求约会任务详情
			options.complete&&options.complete();
			var finished = 1;
			if(options.data.taskId != 4){
				finished = 0;
			}
			if(options.type == 'get'){
				options.success&&options.success({
					uniId:'task1',
					title:'一块儿吃个晚饭',
					taskId:4,
					praiseNum:123,
					praised:0,
					flag:finished,
					date:'2015-10-01',
					reply:'今天一块儿吃了巫山烤全鱼，开心~~',
					photos:['http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%203.png','http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%204.png'],
					commentList:[
					{
						uniId:'qqq',
						nickname:'杜聪',
						ownerId:'dc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
						text:'晚餐很浪漫喔~',
						ts:20123123
					},
					{
						uniId:'www',
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						text:'你也可以去参加一个啊',
						targetName:'杜聪',
						targetId:'dc',
						ts:20123123
					}
					],
					praiseList:[
					{
						nickname:'杜聪',
						ownerId:'dc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					},
					{
						nickname:'蒋超',
						ownerId:'jc',
						headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a0r3g3h71hcg1a6f17tp1b2s1af69.jpg',
						ts:20123123
					}
					]
				});
			}
			else{
				options.error && options.error();
			}
			break;
			case '/wx/act/submitSuggestion':
				options.complete && options.complete();
				if(options.type == 'post'){
					options.success && options.success({
						status:0
					})
				}else{
					options.error && options.error();
				}
				break;
			case '/wx/user/editInfo':
				options.complete && options.complete();
				if(options.type == 'get'){
					options.success && options.success({
						status:0
					})
				}else{
					options.error && options.error();
				}
				break;
			case '/wx/user/getInfo':
			options.complete && options.complete();
			if(options.type == 'get'){
				options.success&&options.success({
					uid:'dc',
    				nickname:'杜聪',
    				sex:1,
    				headImg:'http://7xn981.com2.z0.glb.qiniucdn.com/image.jpg',
    				city: "广州", 
    				province: "广东", 
    				country: "中国",
					birthday:"1992-04-15",
					photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg',
						'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg',
						'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg',
						'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%2010.png',
						'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%203.png',
						'http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g6dcfg11e72bgfokl852dup.jpg',
						'http://7xn981.com2.z0.glb.qiniucdn.com/Rectangle%2055%20Copy%204.png'
					],
					mobile:15201317810,
					wx:'suoXingSuiXin',
					verified:0,
					selfIntro:'本人性格内外结合,适应能力强，为人诚实，有良好的人际交往能力，',
					expectation:'本人性格内外结合,适应能力强，为人诚实，'
				});
			}

			else{
				options.error&&options.error();
			}
			break;
			case '/wx/common/praise':
				options.complete && options.complete();
				if(options.type == "post"){
					options.success && options.success({
						status:0
					})
				}else{
					options.error && options.error();
				}
				break;
			case '/wx/common/getJSParams':
			options.complete&&options.complete();
			if(options.type == 'get'){
				options.success&&options.success({
					appid:'ddd',
					ts:213123,
					nonceStr:'dwqwdqwd',
					signature:'wqdqwd'
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/common/praise'://点赞
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/common/cancelPraise'://取消点赞
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/common/comment'://评论
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/common/deleteComment'://删除评论
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/common/follow'://关注
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			case '/wx/common/cancelFollow'://取消关注
			options.complete&&options.complete();
			if(options.type == 'post'){
				options.success&&options.success({
					status:0
				});
			}
			else{
				options.error&&options.error();
			}
			break;
			default:
			alert('mockAjax error');
			break;
		}
	},200);
}
Z(function(){
	if('mockAjax' in window){
		Z.ajax = mockAjax;
	}
	else{
		console = {
			log:function(){}
		};
	}
	if('mockQiNiuReady' in window){
		qiNiuReady = mockQiNiuReady;
	}
	return;
	var debugJsNode = document.createElement('script');
	document.body.appendChild(debugJsNode);
	debugJsNode.src = "http://192.168.1.10:8080/target/target-script-min.js#anonymous";
});