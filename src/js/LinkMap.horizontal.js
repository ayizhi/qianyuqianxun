'use strict';
function LinkMap(canvas,opt){
	if(!canvas){
		throw 'no canvas';
		return false;
	}
	opt = opt||{};
	this.pairs = opt.pairs||5;
	if(!opt.females||!opt.females.length||opt.females.length!=this.pairs){
		throw 'females invalid';
		return false;
	}
	if(!opt.males||!opt.males.length||opt.males.length!=this.pairs){
		throw 'males invalid';
		return false;
	}
	this.scale = window.devicePixelRatio||2;//解决retina屏幕上不清晰的问题
	var i,tmp,r;
	if(opt.disorder){
		for(i = 0; i < this.pairs; i++){
			r = Math.floor(this.pairs*Math.random());
			tmp = opt.females[i];
			opt.females[i] = opt.females[r];
			opt.females[r] = tmp;

			r = Math.floor(this.pairs*Math.random());
			tmp = opt.males[i];
			opt.males[i] = opt.males[r];
			opt.males[r] = tmp;
		}
	}
	this.topIs = opt.topIs||'f';
	var femaleIsTop = (this.topIs=='f');
	var maleIsTop = !femaleIsTop;
	this.females = [];
	this.males = [];
	for(i = 0; i < this.pairs; i++){
		this.females.push(new LinkPerson(opt.females[i],0,this,femaleIsTop));
		this.males.push(new LinkPerson(opt.males[i],1,this,maleIsTop));
	}
	this.femaleTextColor = opt.femaleTextColor||'#fff';
	this.femaleTextBg = opt.femaleTextBg||'#F641BF';
	this.maleTextColor = opt.maleTextColor||'#fff';
	this.maleTextBg = opt.maleTextBg||'#0092F4';
	this.textSize = this.scale*(opt.textSize||10);

	//this.bgColor = opt.bgColor;
	this.defaultFemaleHead = opt.defaultFemaleHead||'';
	this.defaultMaleHead = opt.defaultMaleHead||'';
	this.defaultMaleImg = document.createElement('img');
	this.defaultFemaleImg = document.createElement('img');

	this.deskHeight = this.scale*(opt.deskHeight||140);
	this.deskMarginTop = this.scale*(opt.deskMarginTop||9);
	this.deskColor = opt.deskColor||'#F0EFF5';
	this.deskRadius = this.scale*(opt.deskRadius||5);
	this.topPadding = this.scale*(opt.topPadding||18);
	this.headSize = this.scale*(opt.headSize||35);
	this.thickness = this.scale*(opt.thickness||1);
	this.dotSize = this.scale*(opt.dotSize||5);
	this.dotGapDesk = this.scale*(opt.dotGapDesk||18);
	this.lineWidth = this.scale*(opt.lineWidth||1);
	this.neckDefaultColor = opt.neckDefaultColor||'#999F9D';
	this.dotDefaultColor = opt.dotDefaultColor||'#fff';
	this.linkColor = opt.linkColor||'#EA4C89';
	this.linking = false;
	this.deltaY = this.scale*(opt.deltaY||-30);
	this.isMobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
	if(!this.isMobile){
		this.deltaY = 0;
	}
	//this.deltaY = 0;
	var cw = opt.width||canvas.parentNode.offsetWidth;
	var ch = 2*this.topPadding+2*this.headSize+2*this.deskMarginTop+this.deskHeight;
	canvas.style.width = cw+'px';
	canvas.style.height = ch/this.scale+'px';
	canvas.width = cw*this.scale;
	canvas.height = ch;
	this.deskMarginLeft = canvas.width/30;
	this.deskWidth = canvas.width-2*this.deskMarginLeft;
	this.headSideGap = this.deskWidth/30;
	this.headBetweenGap = (this.deskWidth-2*this.headSideGap-this.pairs*this.headSize)/(this.pairs-1);
	this.canvas = canvas;
	this.onClick = opt.onClick;
	this.onLink = opt.onLink;
	this.onBreak = opt.onBreak;
	this.onChoose = opt.onChoose;
	this.onCancel = opt.onCancel;
	this.canLink = opt.canLink;
	this.allIsWell = false;
	this.readyNum = 0;
	this.showGuest = opt.showGuest||0;
	this.init();
	return this;
}
LinkMap.prototype.init = function(){
	var lastTouch,t = this;
	t.defaultFemaleImg.onload = function(){
		t.defaultFemaleReady = true;
		t.defaultFemaleCanvas = t.males[0].drawCanvas(this);
		t.loadDefault();
	}
	t.defaultMaleImg.onload = function(){
		t.defaultMaleReady = true;
		t.defaultMaleCanvas = t.males[0].drawCanvas(this);
		t.loadDefault();
	}
	t.defaultFemaleImg.src = t.defaultFemaleHead;
	t.defaultMaleImg.src = t.defaultMaleHead;
	t.touchstart = false;
	t.mousemoved = false;
	t.mousedown = false;
	var startPos;
	t.canvas.addEventListener('touchstart',function(e){
		if(e.changedTouches.length>1||t.touchstart||!t.canLink()||!t.isReady()){return;}
		t.touchstart = true;
		lastTouch = e.changedTouches[0].identifier;
		startPos = t.getTouchEventPos(e);
		t.eventPublish('touchstart',startPos);
	},false);
	t.canvas.addEventListener('touchmove',function(e){
		
		// if(t.isLinking()){
		// 	e.preventDefault();
		// }
		if(t.canLink()){
			e.preventDefault();
		}
		if(lastTouch!=e.changedTouches[0].identifier||!t.canLink()||!t.isReady()){return;}
		var curPos = t.getTouchEventPos(e);
		t.eventPublish('touchmove',curPos);
		// t.eventPublish('cut',{
		// 	st:startPos,
		// 	et:curPos
		// });
	},false);
	t.canvas.addEventListener('touchend',function(e){
		if(lastTouch!=e.changedTouches[0].identifier||!t.canLink()||!t.isReady()){return;}
		t.touchstart = false;
		t.eventPublish('touchend',t.getTouchEventPos(e));
	},false);
	t.canvas.addEventListener('click',function(e){
		//console.log('onclick',e);
		//if(!t.isReady()){return;}
		if(!t.mousemoved){
			t.eventPublish('click',t.getMouseEventPos(e));
		}
		t.mousedown = false;
		t.mousemoved = false;
	},false);
	var mStartPos;
	if(!t.isMobile){
		t.canvas.addEventListener('mousedown',function(e){
			//console.log('mousedown',e);
			if(e.which!=1||!t.canLink()||!t.isReady()){return;}
			t.mousedown = true;
			mStartPos = t.getMouseEventPos(e);
			t.eventPublish('touchstart',mStartPos);
		},false);
		document.body.addEventListener('mousemove',function(e){
			e.preventDefault();
			if(e.which!=1||!t.mousedown||!t.canLink()||!t.isReady()){return;}
			//console.log('mousemove',e);
			t.mousemoved = true;
			var mCurPos = t.getMouseEventPos(e);
			t.eventPublish('touchmove',mCurPos);
			// t.eventPublish('cut',{
			// 	st:mStartPos,
			// 	et:mCurPos
			// });
		},false);
		document.body.addEventListener('mouseup',function(e){
			//console.log('mouseup',e);
			if(e.which!=1||!t.canLink()||!t.isReady()){return;}
			t.eventPublish('touchend',t.getMouseEventPos(e));
		},false);
	}
	window.addEventListener('resize',function(){
		t.onresize();
	},false);
	t.onresize();
	// if(typeof(plus)=='undefined'){return;}
	// var shakeMedia = null;
	// plus.accelerometer.watchAcceleration(function(a){
	// 	if(!shakeMedia&&(Math.abs(a.xAxis)+Math.abs(a.yAxis)+Math.abs(a.zAxis)>50)&&t.canLink()){
	// 		//alert('shake here');
	// 		shakeMedia = plus.audio.createPlayer("_www/audio/shake.wav");
	// 		shakeMedia.play();
	// 		setTimeout(function(){
	// 			t.reset();
	// 			shakeMedia.stop();
	// 			//delete shakeMedia;
	// 			shakeMedia = null;
	// 		},2000);
	// 	}
	// },function (e){},{frequency:100});
}
LinkMap.prototype.loadDefault = function(){
	var t = this;
	var i;
	if(!t.defaultFemaleReady||!t.defaultMaleReady){
		return;
	}
	t.defaultReady = true;
	t.draw();
	//console.log('showGuest',t.showGuest);
	if(!t.showGuest){return;}
	for(i = 0; i < t.pairs; i++){
		t.males[i].loadHead();
		t.females[i].loadHead();
	}
}
LinkMap.prototype.onReady = function(lp){
	var t = this;
	t.readyNum++;

	if(t.readyNum<t.pairs*2){
		return;
	}
	var q = [];
	var i;
	t.draw();
	for(i = 0; i < t.pairs; i++){
		q.push(t.females[i]);
		q.push(t.males[i]);
	}
	var rNum;
	var tmp;
	for(i = 0; i < 2*t.pairs; i++){//打乱顺序
		rNum = Math.floor(Math.random()*2*t.pairs);
		tmp = q[i];
		q[i] = q[rNum];
		q[rNum] = tmp;
	}
	
	var raf = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function (callback){window.setTimeout(callback, 17);};
	
	function zoomIn(curIndex){
		if(curIndex>=2*t.pairs){
			t.allIsWell = true;
			t.draw();
			return;
		}
		var curPerson = q[curIndex];
		function ani(){
			curPerson.scale = Math.min(100,curPerson.scale+10);
			t.draw();
			if(curPerson.scale>=100){
				setTimeout(function(){
					zoomIn(curIndex+1);
				},50);
				return;
			}
			raf(ani);
		}
		ani();
	}
	zoomIn(0);
}
LinkMap.prototype.onresize = function(){
	//console.log('onresize');
	var i,t = this;
	var cw = t.canvas.parentNode.offsetWidth;
	t.canvas.style.width = cw+'px';
	t.canvas.width = cw*t.scale;
	t.deskMarginLeft = t.canvas.width/30;
	t.deskWidth = t.canvas.width-2*t.deskMarginLeft;
	t.headSideGap = t.deskWidth/30;
	t.headBetweenGap = (t.deskWidth-2*t.headSideGap-t.pairs*t.headSize)/(t.pairs-1);
	var tmpFemale;
	for(i = 0; i < t.pairs; i++){
		t.males[i].setIndex(i);
		t.females[i].setIndex(i);
	}
	for(i = 0; i < t.pairs; i++){
		tmpFemale = t.females[i];
		if(tmpFemale.isLinked()){
			tmpFemale.linkedWith(tmpFemale.getPartner());
		}
	}
	if(!t.defaultReady){return;}
	t.draw();
}
LinkMap.prototype.isReady = function(){
	return this.allIsWell;
}
LinkMap.prototype.draw = function(){
	var t = this,i;
	var ctx = t.canvas.getContext('2d');
	var cw = t.canvas.width;
	var ch = t.canvas.height;
	ctx.clearRect(0,0,cw,ch);
	var deskLeft = t.deskMarginLeft;
	var deskTop = t.topPadding+t.headSize+t.deskMarginTop;
	var deskWidth = t.deskWidth;
	var deskHeight = t.deskHeight;
	var radius = t.deskRadius;
	ctx.fillStyle = t.deskColor;
	ctx.beginPath();
	ctx.moveTo(deskLeft+radius,deskTop);

	ctx.lineTo(cw-deskLeft-radius,deskTop);
	ctx.arc(cw-deskLeft-radius,deskTop+radius,radius,1.5*Math.PI,2*Math.PI);

	ctx.lineTo(cw-deskLeft,ch-deskTop-radius);
	ctx.arc(cw-deskLeft-radius,ch-deskTop-radius,radius,0*Math.PI,0.5*Math.PI);

	ctx.lineTo(deskLeft+radius,ch-deskTop);
	ctx.arc(deskLeft+radius,ch-deskTop-radius,radius,0.5*Math.PI,1*Math.PI);

	ctx.lineTo(deskLeft,deskTop+radius);
	ctx.arc(deskLeft+radius,deskTop+radius,radius,1*Math.PI,1.5*Math.PI);
	ctx.closePath();
	ctx.fill();
	for(i = 0; i < this.pairs; i++){
		t.females[i].drawImg();
		t.males[i].drawImg();
	}
	for(i = 0; i < this.pairs; i++){
		t.females[i].drawLine();
		t.males[i].drawLine();
	}
}
LinkMap.prototype.reset = function(){
	var t = this;
	var i,tmp,r;
	for(i = 0; i < this.pairs; i++){
		r = Math.floor(this.pairs*Math.random());
		tmp = t.females[i];
		t.females[i] = t.females[r];
		t.females[r] = tmp;

		r = Math.floor(this.pairs*Math.random());
		tmp = t.males[i];
		t.males[i] = t.males[r];
		t.males[r] = tmp;
	}
	for(i = 0; i < this.pairs; i++){
		t.females[i].loseLink();
		t.males[i].loseLink();
		t.females[i].setIndex(i);
		t.males[i].setIndex(i);
	}
	t.draw();
}
LinkMap.prototype.trigger = function(eventName){
	//console.log('trigger here',eventName,arguments)
	if(typeof(this[eventName])=='function'){
		this[eventName](Array.prototype.splice.call(arguments,1));
		//this[eventName](arguments);
	}
}
LinkMap.prototype.getMouseEventPos = function(event){
	var t = this;
	//console.log('getMouseEventPos',event);
	if(event){
		return {
			x:t.scale*(event.pageX-t.canvas.offsetLeft),
			y:t.scale*(event.pageY-t.canvas.offsetTop)
		}
	}
	else{
		return {
			x:0,
			y:0
		}
	}
}
LinkMap.prototype.getTouchEventPos = function(event){
	var t = this;
	//console.log('getTouchEventPos',event);
	if(event&&event.changedTouches&&event.changedTouches.length){
		// return {
		// 	x:t.scale*(event.changedTouches[0].clientX-t.canvas.offsetLeft),
		// 	y:t.scale*(event.changedTouches[0].clientY-t.canvas.offsetTop)
		// }
		return {
			x:t.scale*(event.changedTouches[0].pageX-t.canvas.offsetLeft),
			y:t.scale*(event.changedTouches[0].pageY-t.canvas.offsetTop)
		}
	}
	else{
		return {
			x:0,
			y:0
		}
	}
}
LinkMap.prototype.eventPublish = function(eventName,pos){
	var i,t = this;
	for(i = 0; i < t.pairs; i++){
		t.females[i].trigger(eventName,pos);
		t.males[i].trigger(eventName,pos);
	}
}
LinkMap.prototype.linkStart = function(person,pos){
	this.linking = true;
	this.curStart = person;
	person.linkStart(pos);
}
LinkMap.prototype.linkedWith = function(person){
	this.curStart.linkedWith(person);
	person.linkedWith(this.curStart);
	this.trigger('onLink',this.curStart,person);
}
LinkMap.prototype.linkEnd = function(person){
	this.linking = false;
}
LinkMap.prototype.isLinking = function(){
	return this.linking;
}
LinkMap.prototype.checkLine = function(person){
	if(this.curStart){
		if(this.curStart.isTop != person.isTop){
			return true;
		}
	}
	return false;
}
LinkMap.prototype.getLinkResult = function(){
	var result = {};
	var i,tmp;
	var t = this;
	for(i = 0; i < t.pairs; i++){
		tmp = t.males[i];
		if(tmp.isLinked()){
			result[tmp.guestNumber] = tmp.getPartner().guestNumber;
		}
		else{
			return false;
		}
	}
	return result;
}
LinkMap.prototype.link = function(maleNumber,femaleNumber){
	//console.log('wanna link m'+maleNumber+' with f'+femaleNumber);
	var i;
	var t = this;
	var targetMale,targetFemale;
	for(i = 0; i < t.pairs; i++){
		if(t.males[i].guestNumber == maleNumber){
			targetMale = t.males[i];
		}
		if(t.females[i].guestNumber == femaleNumber){
			targetFemale = t.females[i];
		}
	}
	//console.log('targetMale',targetMale);
	//console.log('targetFemale',targetFemale);
	targetMale.linkedWith(targetFemale);
	targetFemale.linkedWith(targetMale);
}
function LinkPerson(data,sex,parent,isTop){
	// if(!data||!data.id||!data.name||!data.head||!sex||!parent){
	// 	throw 'arguments invalid';
	// 	return false;
	// }
	this.parent = parent;
	for(var key in data){
		this[key] = data[key];
	}
	this.sex = sex;
	this.isTop = isTop;//是不是处于上边
	this.pos = {//左上角的坐标
		x:0,
		y:0
	}
	this.started = false;//是否为连线的起点
	this.selected = false;//是否被连线选中了
	this.lineEnd = {
		x:0,
		y:0
	};//连线的终点坐标
	this.partner = null;//被连线的另一半
	this.eventListener = {};
	this.init();
	this.scale = 0;
	return this;
}
LinkPerson.prototype.init = function(){
	var t = this;
	t.on('touchstart',function(pos){
		var pa = t.parent;
		//console.log('touchstart',pos,t);
		if(t.checkPosInBox(pos)&&!pa.isLinking()){//检查是否选中某个头像和是否正在连线中
			if(t.isLinked()){//如果已有连线的另一半，则另一半开始连线
				//console.log('partner linkStart');
				pa.trigger('onBreak',t,t.getPartner());
				pa.trigger('onChoose',t);
				pa.trigger('onChoose',t.getPartner());
				t.getPartner().loseLink();
				pa.linkStart(t.getPartner(),pos);
				t.loseLink();
				t.beSelected();
			}
			else{//自身开始连线
				//console.log('self linkStart',t);
				pa.linkStart(t,pos);
				pa.trigger('onChoose',t);
			}
			pa.draw();
		}
	});
	t.on('touchmove',function(pos){
		//console.log('touchmove',pos,t);
		if(t.isLinked()){return;}
		var pa = t.parent;
		if(t.checkPosInBox(pos)){//移入某个头像
			if(!pa.isLinking()){//如果还没有进入连线，则从当前选中的头像开始连线
				//console.log('noLinking here');
				t.trigger('touchstart',pos);
			}
			else{
				if(t.isSelected()){//本身被连线选中了
					if(t.isStarted()){//本身是起点则可以绘制线条
						t.lineTo(pos);
						pa.draw();
					}
				}
				else{
					if(pa.checkLine(t)){//检查连线是否合法
						t.beSelected();
						pa.trigger('onChoose',t);
						pa.draw();
					}
				}
			}
		}
		else{//移出某个头像
			if(t.isSelected()){//本身被连线选中了
				//console.log('moveout',t);
				if(t.isStarted()){//本身是连线起点则绘制线条
					//console.log('isStart');
					t.lineTo(pos);
				}
				else{
					t.loseSelect();
					pa.trigger('onCancel',t);
				}
				pa.draw();
			}
		}
	});
	t.on('touchend',function(pos){
		if(t.isLinked()||!t.isSelected()){return;}
		var pa = t.parent;
		pa.linkEnd();
		if(t.checkPosInBox(pos)){//移入某个头像
			if(t.isStarted()){
				t.linkCancel();
				pa.trigger('onCancel',t);
				pa.draw();
			}
			else{//本身是终点则检查是否可以连线
				if(pa.checkLine(t)){
					pa.linkedWith(t);
					pa.draw();
				}
			}
		}
		else{
			if(t.isStarted()){//本身是起点则可以绘制线条
				setTimeout(function(){
					if(!t.isLinked()){
						t.linkCancel();
						pa.trigger('onCancel',t);
						pa.draw();
					}
				},0);
			}
		}
	});
	// t.on('cut',function(line){
	// 	var pa = t.parent;
	// 	if(!t.isLinked()||pa.isLinking()){return;}
	// 	//console.log('cut here',line);
	// 	if(t.checkCross(line)){//检查两条线段是否相交
	// 		//console.log('yeah is crossLine');
	// 		pa.trigger('onBreak',t,t.getPartner());
	// 		t.getPartner().loseLink();
	// 		t.loseLink();
	// 		pa.draw();
	// 	}
	// });
	t.on('click',function(pos){
		//console.log('person on click',pos);
		var pa = t.parent;
		//pos.y -= pa.deltaY;
		if(t.checkPosInBox(pos)){
			pa.trigger('onClick',t);
			//alert('click at: '+t.name);
		}
	});
}
LinkPerson.prototype.loadHead = function(){
	var t = this;
	t.img = document.createElement('img');
	t.img.onload = function(){
		t.imgReady = true;
		t.canvas = t.drawCanvas(this,true);
		t.parent.onReady(t);
	}
	t.img.src = t.headImg;
}
LinkPerson.prototype.drawCanvas = function(head,drawName){
	var t = this;
	var pa = t.parent;
	var hs = pa.headSize-2*pa.thickness;
	var longSize,headX,headY,clipX,clipY,headScale;
	var tmpCanvas = document.createElement('canvas');
	tmpCanvas.width = hs;
	tmpCanvas.height = hs;
	var ctx = tmpCanvas.getContext('2d');//这个方案没有使用裁剪API,而是先画出大的再手动清除溢出的部分
	if(head.width<head.height){
		headScale = hs/head.width;
		longSize = headScale*head.height;
		headX = 0;
		headY = (hs-longSize)/2;
		ctx.drawImage(head,headX,headY,hs,longSize);
	}
	else{
		headScale = hs/head.height;
		longSize = headScale*head.width;
		headX = (hs-longSize)/2;
		headY = 0;
		ctx.drawImage(head,headX,headY,longSize,hs);
	}
	var cx = hs/2;
	var cy = hs/2;
	var sr = hs/2;
	//清除头像的四角
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx,cy,sr,0,0.5*Math.PI);//右下角
	ctx.lineTo(cx+sr,cy+sr);
	ctx.closePath();
	ctx.clip();
	ctx.clearRect(0,0,hs,hs);
	ctx.restore();
	//ctx.fill();

	ctx.save();
	ctx.beginPath();
	ctx.arc(cx,cy,sr,0.5*Math.PI,1*Math.PI);//左下角
	ctx.lineTo(cx-sr,cy+sr);
	ctx.closePath();
	ctx.clip();
	ctx.clearRect(0,0,hs,hs);
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.arc(cx,cy,sr,1*Math.PI,1.5*Math.PI);//左上角
	ctx.lineTo(cx-sr,cy-sr);
	ctx.closePath();
	ctx.clip();
	ctx.clearRect(0,0,hs,hs);
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.arc(cx,cy,sr,1.5*Math.PI,2*Math.PI);//右上角
	ctx.lineTo(cx+sr,cy-sr);
	ctx.closePath();
	ctx.clip();
	ctx.clearRect(0,0,hs,hs);
	ctx.restore();

	if(!drawName){
		return tmpCanvas;
	}

	return tmpCanvas;
}
LinkPerson.prototype.drawImg = function(){
	var t = this;
	
	var pa = t.parent;
	var ctx = pa.canvas.getContext('2d');
	var dr = pa.dotSize/2;//连线点的半径
	var dotPos = t.getDotPos();//连线点的圆心坐标
	var dx = dotPos.x;
	var dy = dotPos.y;
	if(t.isLinked()||t.isSelected()){
		ctx.fillStyle = pa.linkColor;
	}
	else{
		ctx.fillStyle = pa.dotDefaultColor;
	}
	ctx.beginPath();
	ctx.arc(dx,dy,dr,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
	var headCanvas;
	if(t.sex ==0){
		headCanvas = pa.defaultFemaleCanvas;
	}
	else{
		headCanvas = pa.defaultMaleCanvas;
	}

	//先画默认头像，再画用户头像
	var headX,headY;//头像左上角坐标
	headX = t.pos.x+pa.thickness;
	headY = t.pos.y+pa.thickness;
	var hs = pa.headSize-2*pa.thickness;//小圆直径
	if(t.scale<100){//完成动画之前绘制默认头像
		ctx.drawImage(headCanvas,headX,headY,hs,hs);
	}
	var cx = t.pos.x+pa.headSize/2;//圆心坐标
	var cy = t.pos.y+pa.headSize/2;//圆心坐标
	var br = pa.headSize/2;//大圆半径
	var sr = hs/2;//小圆半径

	if(t.isSelected()){//绘制头像的环
		ctx.fillStyle = pa.linkColor;
	}
	else{
		ctx.fillStyle = pa.neckDefaultColor;
	}

	ctx.beginPath();
	ctx.arc(cx,cy,br,0,1*Math.PI);
	ctx.lineTo(cx-br+pa.thickness,cy);
	ctx.arc(cx,cy,sr,1*Math.PI,0,true);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.arc(cx,cy,br,1*Math.PI,2*Math.PI);
	ctx.lineTo(cx+br-pa.thickness,cy);
	ctx.arc(cx,cy,sr,2*Math.PI,1*Math.PI,true);
	ctx.closePath();
	ctx.fill();

	//console.log('isReady',pa.isReady());
	if(t.scale<1){return;}
	//console.log('draw self',t.scale);

	headCanvas = t.canvas;
	headX = t.pos.x+pa.thickness+sr*(100-t.scale)/100;
	headY = t.pos.y+pa.thickness+sr*(100-t.scale)/100;
	ctx.globalAlpha=(t.scale/100);
	ctx.drawImage(headCanvas,headX,headY,hs*t.scale/100,hs*t.scale/100);
	ctx.globalAlpha=1;

	var textColor = pa.maleTextColor;
	var textBg = pa.maleTextBg;
	var sexFlag = '男';
	if(t.sex == 0){
		textColor = pa.femaleTextColor;
		textBg = pa.femaleTextBg;
		sexFlag = '女';
	}
	var text = sexFlag+t.guestNumber+' '+t.nickname;
	var textX = Math.floor(t.pos.x+hs*0.7);
	var textY = t.pos.y;
	ctx.font = pa.textSize+'px Arial';
	//console.log('draw text',ctx.font,pa.textSize);
	ctx.textBaseline = 'top';
	ctx.lineWidth = Math.floor(pa.textSize*0.7);
	ctx.strokeStyle = textBg;
	ctx.lineJoin = 'round';
	ctx.strokeText(text, textX, textY);
	ctx.fillStyle = textColor;
	ctx.fillText(text, textX, textY);
}
LinkPerson.prototype.drawLine = function(){
	var t = this;
	var pa = t.parent;
	if(!pa.isReady()){return;}
	if(t.isLinked()){
		if(t.getPartner().isTop){
			return;
		}
	}
	else{
		if(!t.isStarted()){
			return;
		}
	}
	var ctx = pa.canvas.getContext('2d');
	ctx.lineWidth = pa.lineWidth;
	ctx.strokeStyle = pa.linkColor;
	ctx.beginPath();
	var dotPos = t.getDotPos();
	ctx.moveTo(dotPos.x,dotPos.y);
	ctx.lineTo(t.lineEnd.x,t.lineEnd.y);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(t.lineEnd.x,t.lineEnd.y,pa.dotSize/2,0,2*Math.PI);
	ctx.fillStyle = pa.linkColor;
	ctx.fill();
}
LinkPerson.prototype.setIndex = function(index){
	var t = this;
	var pa = t.parent;
	t.index = index;
	if(t.isTop){
		t.pos.y = pa.topPadding;
	}
	else{
		t.pos.y = pa.canvas.height - pa.topPadding - pa.headSize;
	}
	t.pos.x = pa.deskMarginLeft+pa.headSideGap+index*(pa.headSize+pa.headBetweenGap);
	//t.pos.x = pa.topPadding+index*(pa.headBetweenGap+pa.headSize);
}
LinkPerson.prototype.getLeft = function(){
	var t = this;
	var pa = t.parent;
	var nextIndex = t.index-1;
	if(nextIndex<0){
		if(t.sex == 0){
			return pa.males[pa.pairs-1];
		}
		else{
			return pa.females[pa.pairs-1];
		}
	}
	else{
		if(t.sex == 0){
			return pa.females[nextIndex];
		}
		else{
			return pa.males[nextIndex];
		}
	}
}
LinkPerson.prototype.getRight = function(){
	var t = this;
	var pa = t.parent;
	var nextIndex = t.index+1;
	if(nextIndex>=pa.pairs){
		if(t.sex == 0){
			return pa.males[0];
		}
		else{
			return pa.females[0];
		}
	}
	else{
		if(t.sex == 0){
			return pa.females[nextIndex];
		}
		else{
			return pa.males[nextIndex];
		}
	}
}
LinkPerson.prototype.getPartner = function(){
	return this.partner;
}
LinkPerson.prototype.linkedWith = function(person){
	this.partner = person;
	var dotPos = this.partner.getDotPos();
	this.lineEnd.x = dotPos.x;
	this.lineEnd.y = dotPos.y;
	this.linkCancel();
}
LinkPerson.prototype.loseLink = function(){
	//console.log('loseLink',this);
	this.partner = null;
	this.linkCancel();
}
LinkPerson.prototype.isLinked = function(){
	return !!this.partner;
}
LinkPerson.prototype.beSelected = function(){
	this.selected = true;
}
LinkPerson.prototype.loseSelect = function(){
	//console.log('loseSelect',this);
	this.selected = false;
}
LinkPerson.prototype.isSelected = function(){
	return this.selected;
}
LinkPerson.prototype.linkStart = function(pos){
	//console.log('linkStart',this);
	this.selected = true;
	this.started = true;
	this.lineTo(pos);
}
LinkPerson.prototype.linkCancel = function(){
	//console.log('linkStart',this);
	this.selected = false;
	this.started = false;
}
LinkPerson.prototype.isStarted = function(){
	return this.started;
}
LinkPerson.prototype.lineTo = function(pos){
	this.lineEnd.x = pos.x;
	this.lineEnd.y = pos.y+this.parent.deltaY;
}
LinkPerson.prototype.getDotPos = function(){
	var t = this;
	var pa = t.parent;
	var dr = pa.dotSize/2;//点的半径
	var dx,dy;//点的圆心坐标
	if(t.isTop){
		dy = t.pos.y+pa.headSize+pa.deskMarginTop+pa.dotGapDesk+dr;
	}
	else{
		dy = t.pos.y-pa.deskMarginTop-pa.dotGapDesk-dr;
	}
	dx = t.pos.x+pa.headSize/2;
	return {
		x:dx,
		y:dy
	};
}
LinkPerson.prototype.checkPosInBox = function(pos){//检查点是否在某矩形区域中
	if(!pos){return false;}
	var t = this;
	var pa = t.parent;
	var border = pa.headBetweenGap*0.4;
	var boxWidth = pa.headSize+2*border;//区域盒子的大小
	var boxHeight = pa.headSize+pa.deskMarginTop+pa.dotGapDesk+pa.dotSize+2*border;
	var leftX,topY;//区域盒子左上角的坐标
	var dx,dy;//事件源点相对于左上角的相对坐标
	if(t.isTop){
		topY = t.pos.y-border;
	}
	else{
		topY = t.pos.y-pa.deskMarginTop-pa.dotGapDesk-pa.dotSize-border;
	}
	leftX = t.pos.x-border;
	dx = pos.x-leftX;
	dy = pos.y-topY+pa.deltaY;
	var result = (dx>=0&&dx<=boxWidth&&dy>=0&&dy<=boxHeight);
	// console.log('checkPosInBox',t,t.pos);
	// console.log(leftX,topY,dx,dy,boxWidth,boxHeight,result);
	return result;
}
LinkPerson.prototype.checkPosInSegment = function(point1,point2,point3){//检查点是否在某线段上
	var maxY = Math.max(point1.y,point2.y);
	var minY = Math.min(point1.y,point2.y);
	var maxX = Math.max(point1.x,point2.x);
	var minX = Math.min(point1.x,point2.x);
	return (point3.x>=minX&&point3.x<=maxX&&point3.y>=minY&&point3.y<=maxY);
}
LinkPerson.prototype.checkCross = function(crossLine){
	//console.log('checkCross',crossLine);
	// 求解两条线段是否相交，思路是先求出两条线段所在的直线是否有交点，如果有，再判断交点是否同时在两条线段上
	if(!crossLine){return false;}
	var t = this;
	var connectLine;
	var point1 = t.getDotPos();
	var point2 = t.getPartner().getDotPos();
	//线段所在直线表达式为y=ax+b
	//a = (y1-y2)/(x1-x2);
	//b = y1-a*x1;
	var dx = (point1.x-point2.x);
	var maxNum = 999999999;
	var a1;
	if(dx == 0){
		a1 = maxNum;
	}
	else{
		a1 = (point1.y-point2.y)/dx;
	}
	var b1 = point1.y-point1.x*a1;
	var point3 = crossLine.st;
	var point4 = crossLine.et;
	dx = (point3.x-point4.x);
	var a2;
	if(dx == 0){
		a2 = maxNum;
	}
	else{
		a2 = (point3.y-point4.y)/dx;
	}
	var b2 = point3.y-point3.x*a2;
	//console.log('a1',a1,'a2',a2);

	if(a1 == a2){//斜率相同表示两条直线平行，不可能相交
		return false;
	}
	var thePoint = {//求出交点坐标
		x:0,
		y:0
	}
	if(a1 == maxNum){//线段1斜率为无穷大
		if(a2 == 0){//线段2斜率为0
			//{x1 = point1.x
			//{y2 = point3.y
			thePoint.x = point1.x;
			thePoint.y = point3.y;
		}
		else{
			//{x1 = point1.x
			//{y2 = a2*x+b2
			thePoint.x = point1.x;
			thePoint.y = a2*thePoint.x+b2;
		}
	}
	else{
		if(a2 == maxNum){
			if(a1 == 0){
				//{y1 = point1.y;
				//{x2 = point3.x
				thePoint.x = point3.x;
				thePoint.y = point1.y;
			}
			else{
				//{y1 = a1*x+b1;
				//{x2 = point3.x
				thePoint.x = point3.x;
				thePoint.y = a1*thePoint.x+b1;
			}
		}
		else{
			if(a1 == 0){
				//{y1 = point1.y;
				//{y2 = a2*x+b2
				//即 a2*x+b2 = point1.y;
				//=> x = (point1.y-b2)/a2;
				//=> y = point1.y;
				thePoint.x = (point1.y-b2)/a2;
				thePoint.y = point1.y;
			}
			else{
				if(a2 == 0){//线段2斜率为0
					//{y1 = a1*x+b1
					//{y2 = point3.y
					//即 a1*x+b1 = point3.y;
					//=> x = (point3.y-b1)/a1;
					//=> y = a1*x+b1;
					thePoint.x = (point3.y-b1)/a1;
					thePoint.y = point3.y;
				}
				else{
					//{y1 = a1*x+b1
					//{y2 = a2*x+b2
					//即 a1*x+b1 = a2*x+b2;
					//=> x = (b2-b1)/(a1-a2);
					//=> y = a1*x+b1;
					thePoint.x = (b2-b1)/(a1-a2);
					thePoint.y = a1*thePoint.x+b1;
				}
			}
		}
	}
	return t.checkPosInSegment(point1,point2,thePoint)&&t.checkPosInSegment(point3,point4,thePoint);
}
LinkPerson.prototype.trigger = function(eventName,pos){
	var i,len;
	if(eventName in this.eventListener){
		len = this.eventListener[eventName].length;
		for(i = 0; i < len; i++){
			this.eventListener[eventName][i](pos);
		}
	}
}
LinkPerson.prototype.on = function(eventName,listener){
	if(typeof(eventName)!='string'||typeof(listener)!='function'){
		return;
	}
	if(!(eventName in this.eventListener)){
		this.eventListener[eventName] = [];
	}
	this.eventListener[eventName].push(listener);
}