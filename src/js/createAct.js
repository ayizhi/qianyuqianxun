'use strict';
Z(function(){
	qiNiuReady(function(){
		var uploader = myUp({
			bb:'qnPicker',
			con:'qnCon'
		});
		uploader.bind('FileUploaded',function(up,file,info){
			console.log('FileUploaded',arguments);
			var domain = up.getOption('domain');
			info = JSON.parse(info.response);
			var src = domain+info.key;
			lazyLoadImg(src,Z('#qnPicker'));
			Z('#qnPicker').data('src',src);
		});
	});
	
	// (function(){
	// 	var curTime = new Date();
	// 	var year = curTime.getFullYear();
	// 	var month = curTime.getMonth()+1;
	// 	if(month<10){
	// 		month = '0'+month;
	// 	}
	// 	var date = curTime.getDate();
	// 	if(date<10){
	// 		date = '0'+date;
	// 	}
	// 	var dateStr = ''+year+'-'+month+'-'+date;

	// 	Z('#deadlineInput').val(dateStr).attr('min',dateStr);
	// })();
	

	Z('#linkDurationInput').mySelect(function(val){
		return val+'天';
	});
	Z('#permissionInput').mySelect(function(val){
		switch(parseInt(val)){
			case 0:
			return '好友可见';
			break;
			case 1:
			return '所有人可见';
			break;
			default:
			alert('挑战权限选择异常'+val);
		}
	});


	var egCover = window.imgUrl.coverEg;
	lazyLoadImg(egCover,Z('#qnPicker'));
	Z('#qnPicker').data('src',egCover);

	var submitIng = false;
	Z('#submit').on('click',function(){
		if(submitIng){return;}
		var title = Z('#titleInput').val();
		if(!title||!title.length){
			//alert('请输入挑战主题aaa');
			Z('#titleInput').addClass('warning').focus();
			return;
		}
		var introInput = Z('#introInput').val();
		if(!introInput||!introInput.length){
			Z('#introInput').addClass('warning').focus();
			return;
		}
		var deadlineInput = Z('#deadlineInput').val();
		var linkDurationInput = Z('#linkDurationInput').val();
		var coverInput = Z('#qnPicker').data('src');
		var permissionInput = Z('#permissionInput').val();

		submitIng = true;
		Z('#submit').html('创建中...');

		var reqData = {
			title:titleInput,
			deadline:deadlineInput,
			linkDuration:linkDurationInput,
			cover:coverInput,
			permission:permissionInput
		}
		Z.ajax({
			url:window.actionUrl.createAct.url,
			type:window.actionUrl.createAct.type,
			data:Z.extend(getCommonReqData(),reqData),
			success:function(reply){
				console.log('submit reply',reply);
				reply = checkReply(reply);
				if(!reply){return;}
				if(reply.status == 0){
					alert('恭喜创建约会挑战成功');
					window.location.href = 'creatorCard.html'+getCommonParams()
					+'&actId='+encodeURIComponent(reply.actId)
					+'&actToken='+encodeURIComponent(reply.actToken);
				}
				else{
					alert('创建失败，请重试');
					pageReload();
				}
			},
			error:function(err){
				console.log('submit error',err);
				noNetwork();
			},
			complete:function(){
				console.log('submit complete');
				submitIng = false;
				Z('#submit').html('创建');
			}
		});
	});
});