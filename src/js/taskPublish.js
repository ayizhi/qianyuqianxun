'use strict';
Z(function(){
	var actId = getValueFromSearch('actId');
	var actToken = getValueFromSearch('actToken');
	var fNum = getValueFromSearch('fNum');
	var taskId = getValueFromSearch('taskId');
	var $ = Z;
	var error = false;
	var baseImgParams = '?'+qnImg.base();
	var qnUploader = [];
	var imgTemplate = [
		'<div class="imgBlock bgCon ing" fid="{fid}" osrc="{osrc}">',
			'<img class="delete" src="'+window.imgUrl.close+'">',
			'<div class="text">{text}</div>',
			'<div class="progress"></div>',
		'</div>'
	].join('');

	function uploaderRefresh(){
		var picker,i,len = qnUploader.length;
		for(i = 0; i < len; i++){
			qnUploader[i].refresh();
			picker = qnUploader[i].getOption('browse_button')[0];
			if(Z(picker).width()<1){
				//console.log('destroy',picker);
				qnUploader[i].destroy();
				qnUploader.splice(i,1);
				len--;
				i--;
			}
		}
	}
	$(window).on('resize',uploaderRefresh);

	qiNiuReady(function(){
		var uploader = myUp({
			bb:'qnPicker',
			con:'qnCon'
		});
		qnUploader.push(uploader);
		uploader.bind('FileUploaded',function(up,file,info){
			console.log('FileUploaded',file.id,arguments);
			var domain = up.getOption('domain');
			info = JSON.parse(info.response);
			var smallSize = Math.ceil(4.5*window.fontSize);
			var smallImgParams = baseImgParams+qnImg.and+qnImg.min(smallSize*window.dpi,smallSize*window.dpi);
			var osrc = domain+info.key;
			var src = osrc+smallImgParams;
			console.log('domain',domain,'info',info,'key',info.key,'osrc',osrc);
			$('.imgBlock').each(function(){
				var $t = $(this);
				if($t.attr('fid')!=file.id){
					return;
				}
				$t.removeClass('ing').find('.progress').css('top',(100-file.percent)+'%');
				lazyLoadImg(src,$t.attr('osrc',osrc));
			});
		});
		uploader.bind('BeforeUpload',function(up, file){
			console.log('BeforeUpload',file.id);
			var fileData = {
				fid:file.id,
				text:'上传中',
				osrc:''
			}
			var imgHtml = format(imgTemplate,fileData);
			Z(imgHtml).insertBefore(Z('#qnPicker'));
		});
		uploader.bind('UploadProgress',function(up,file){
			console.log('UploadProgress',file.id,file.percent);
			$('.imgBlock').each(function(){
				if($(this).attr('fid')==file.id){
					Z(this).find('.progress').css('top',(100-file.percent)+'%');
				}
			});
		});
	});
	$('#qnCon').on('click','.delete',function(){
		if(confirm('确认要删除这张头像吗')){
			var $p = Z(this).parent();
			$p.addClass('empty').remove();
			uploaderRefresh();
		}
	}).on('click','.imgBlock',function(e){
		if($(this).hasClass('empty')){return;}
		var t = e.target;
		while(!$(t).hasClass('imgBlock')){
			if($(t).hasClass('delete')){
				return;
			}
			t = t.parentNode;
		}
		var osrc = $(this).attr('osrc')+baseImgParams;
		if(!osrc){return;}
		var list = [];
		$('#qnCon .imgBlock').each(function(){
			if($(this).hasClass('empty')){return;}
			var _osrc = $(this).attr('osrc');
			if(!_osrc){return;}
			list.push(_osrc+baseImgParams);
		});
		wxPreviewImg(osrc,list);
	});

	function checkInput(id){
		var value = Z('#'+id).val();
		if(!value||!value.length){
			Z('#'+id).addClass('warning').focus();
			return false;
		}
		return value;
	}

	var submitIng = false;
	Z('#submit').on('click',function(){
		if(submitIng){return;}
		var textInput = checkInput('input');
		if(!textInput){
			return;
		}

		var $imgBlocks = Z('#qnCon').find('.imgBlock');
		var photos = [];
		var len = $imgBlocks.length;
		var i;
		var $tmpBlock;
		for(i = 0; i < len; i++){
			$tmpBlock = $($imgBlocks[i]);
			if(!$tmpBlock.hasClass('empty')){
				photos.push($tmpBlock.attr('osrc'));
			}
		}
		if(photos.length<2){
			alert('请上传至少两张照片');
			return;
		}

		submitIng = true;
		$('#submit').html('发布中...');

		var reqData = {
			actId:actId,
			actToken:actToken,
			reply:textInput,
			taskId:taskId,
			photos:photos
		}
		console.log('reqData',reqData);
		// submitIng = false;
		// Z('#submit').html('发布');
		// return;
		Z.ajax({
			url:window.actionUrl.registerAct.url,
			type:window.actionUrl.registerAct.type,
			data:Z.extend(getCommonReqData(),reqData),
			success:function(reply){
				console.log('submit reply',reply);
				reply = checkReply(reply);
				if(!reply){return;}
				if(reply.status == 0){
					alert('发布成功');
					if(window.history.length){
						window.history.go(-1);
					}
					else{
						window.location.href = 'dating.html'+getCommonParams()
						+'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
						+'&fNum='+encodeURIComponent(fNum);
					}
				}
				else{
					alert('噫，发布失败了，请重试一下吧');
					//pageReload();
				}
			},
			error:function(err){
				alert('噫，发布失败了，请重试一下吧');
			},
			complete:function(){
				//console.log('submit complete');
				submitIng = false;
				Z('#submit').html('发布');
			}
		});
	});

	getLocation('renderOption');

	var getTaskDetailIng = false;
	function getTaskDetail(){
		if(getTaskDetailIng){return}
		getTaskDetailIng = true;
		$.ajax({
			url:window.actionUrl.getDatingTaskDetail.url,
			type:window.actionUrl.getDatingTaskDetail.type,
			data:$.extend({
				actId:actId,
				actToken:actToken,
				fNum:fNum,
				taskId:taskId
			},getCommonReqData()),
			success:function(reply){
				console.log('getTaskDetail reply',reply);
				reply = checkReply(reply);
				if(!reply){return;}
				
				var taskTitle = '';
				if(reply.flag == 0){
					taskTitle = '已完成任务: '+reply.title;
					//$('#submit').html('修改');
					$('#input').html(reply.reply||'');
					var photoArray = reply.photos||[];
					var len = photoArray.length;
					var i;
					var photoHtml = '';
					var fileData = {};
					for(i = 0; i < len; i++){
						fileData.fid = '';
						fileData.text = '';
						fileData.osrc = photoArray[i];
						photoHtml += format(imgTemplate,fileData);
					}
					$(photoHtml).insertBefore($('#qnPicker'));
					var smallSize = Math.ceil(4.5*window.fontSize);
					var smallImgParams = baseImgParams+qnImg.and+qnImg.min(smallSize*window.dpi,smallSize*window.dpi);
					$('#qnCon').find('.imgBlock').each(function(){
						var $t = $(this).removeClass('ing');
						if($t.hasClass('empty')){return;}
						var src = $t.attr('osrc')+smallImgParams;
						lazyLoadImg(src,$t);
					});
					uploaderRefresh();
				}
				else{
					taskTitle = '新任务: '+reply.title;
					//$('#submit').html('发布');
				}
				$('#title').html(taskTitle);
			},
			error:function(err){
				noNetwork();
			},
			complete:function(){
				getTaskDetailIng = false;
			}
		});
	}

	$.ajax({
		url:window.actionUrl.getActDetail.url,
		type:window.actionUrl.getActDetail.type,
		data:$.extend({
			actId:actId,
			actToken:actToken
		},getCommonReqData()),
		success:function(reply){
			reply = checkReply(reply);
			if(!reply){return;}
			var females = reply.females;
			var males = reply.males;
			var len = females.length;
			var i;
			var curFemale,curMale;
			for(i = 0; i < len; i++){
				if(females[i].guestNumber == fNum){
					curFemale = females[i];
					break;
				}
			}
			for(i = 0; i < len; i++){
				if(males[i].guestNumber == curFemale.linkedNumber){
					curMale = males[i];
					break;
				}
			}
			if(window.uid != curFemale.guestId&&window.uid != curMale.guestId){
				error = true;
				alert('噫，出错了，这好像不是你的约会任务哎');
				window.history.go(-1);
			}
			else{
				getTaskDetail();
			}
		},
		error:function(err){
			noNetwork();
		}
	});
});
function renderOption(response){
	//console.log('renderOption',response);
	var $s = $('#location span');
	if(!response||response.status!=0||!response.result){
		$s.html('定位失败');
	}
	else{
		$s.html(response.result.formatted_address);
	}
}