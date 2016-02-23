/**
 * Created by Administrator on 2015/11/5.
 */

Z(function(){
    var $ = Z;
    var actId = getValueFromSearch("actId");
    var actToken = getValueFromSearch("actToken");
    var maleHeadImg = new Image();
    var femaleHeadImg = new Image();
    maleHeadImg.src = window.imgUrl.maleHead;
    femaleHeadImg.src = window.imgUrl.femaleHead;
    var theGuests;
    var headSize = Math.ceil(2.5*window.fontSize);
    var femaleLeft = 2.5*window.fontSize;
    var maleLeft = 15.5*window.fontSize;
    var headTop = 1.5*window.fontSize;
    var $male = $(".headBg .linedGuest.male")
    var $maleName = $(".headBg .linedGuest.male .name")
    var $female = $(".headBg .linedGuest.female")
    var $femaleName = $(".headBg .linedGuest.female .name")
    var $middleLine = $(".headBg .middleLine")
    var $paBox = $(".headBg .linedGuest");


    $.ajax({
        url:window.actionUrl.getActDetail.url,
        type:window.actionUrl.getActDetail.type,
        data: $.extend({
            actId:actId,
            actToken:actToken
        },getCommonReqData()),
        success:function(reply){
            reply = checkReply(reply);
            if(!reply){return};
            renderCanvas(reply)
        },
        error:function(err){
            noNetwork();
        }
    })

    function renderCanvas(reply){

        var data = {
            pairs:reply.pairs,
            females:reply.females,
            males:reply.males,
            defaultFemaleHead:window.imgUrl.femaleHead,
            defaultMaleHead:window.imgUrl.maleHead,

            headSize:headSize,//头像大小
            borderSize:Math.ceil(0.1*window.fontSize),//边框值
            femaleLeft:femaleLeft,//女头像左边的距离
            maleLeft:maleLeft,//男头像左边的距离
            headTop:headTop,//头像上方的间距
            pointSize:Math.ceil(0.3*window.fontSize),//用于连线点的大小
            betweenPoint:4*window.fontSize,//点距离中线的距离
            pointMagin:0.5*window.fontSize,//点距离头像的距离

            headBgColorWhite:"#fff",
            headBgColorPink:"#ea4c89",
            pointColorGray:"#E2D0C4",
            pointColorPink:"#ea4c89",

            personalInfo:personalInfo,//显示个人信息;
            linkPeople:linkPeople,//针对头部,开始连线;
            linkFinished:linkFinished,//针对头部，连线结束
            linkRefresh:linkRefresh//刷新

        }
        theGuests = new theLianXian(data);


        function linkPeople(theFirst){
            //清空
            //_refresh();
            var headPic = theFirst.headImage;
            var name = theFirst.nickName;
            if(theFirst.sex == 0){//女
                var theHeadBox = $female.children(".headImg")
                _loadImg(headPic,theHeadBox)
                $female.children(".name").html(name)
            }else if(theFirst.sex == 1){//男
                var theHeadBox = $male.children(".headImg")
                _loadImg(headPic,theHeadBox)
                $male.children(".name").html(name)
            }
        }
        function linkFinished(){
            var middleLength = $middleLine.width() + window.fontSize*1
            var theTop = $(".headBg").height();
            var time = 0.3;

            $paBox.css("transition","all "+time+"s linear 0s")
            $female.css({"transform":"translateX(" + middleLength + "px)","opacity":"0"})
            $male.css({"transform":"translateX(" + -1 * middleLength + "px)","opacity":"0"})
            $middleLine.css("transition","all "+time+"s linear 0s")
            $middleLine.css("transform","scale(0,1)")
            setTimeout(function(){
                linkRefresh();
                $paBox.css("transition","none")
                $femaleName.html("女嘉宾")
                $maleName.html("男嘉宾")
                $female.css({"transform":"translateX(" + 0 + "px)","opacity":"0","transform":"scale(0.6,0.6)"})
                $male.css({"transform":"translateX(" + 0 + "px)","opacity":"0","transform":"scale(0.6,0.6)"})
                $middleLine.css("transition","all "+time+"s linear 0s")
                $middleLine.css("transform","scale(0.1,1)")

                setTimeout(function(){
                    $paBox.css("transition","all "+time+"s linear 0s")
                    $female.css({"transform":"translateX(" + 0 + "px)","opacity":"100","transform":"scale(1,1)"})
                    $male.css({"transform":"translateX(" +  0 + "px)","opacity":"100","transform":"scale(1,1)"})
                    $middleLine.css("transition","all "+time+"s linear 0s")
                    $middleLine.css("transform","scale(1,1)")

                },20)
            },time*1000)


        }
        function linkRefresh(){
            $paBox.css("transition","none")
            $female.css({"transform":"translateY(" + 0 + "px)","opacity":"100"})
            $male.css({"transform":"translateY(" + 0 + "px)","opacity":"100"})
            $female.children(".headImg").html("").children(".name").html("女嘉宾")
            $male.children(".headImg").html("").children(".name").html("男嘉宾")

        }
        function _loadImg(img,container){
            container.html(img);

            var imgWidth = img.width;
            var imgHeight = img.height;
            var boxWidth = container.width();
            var boxHeight = container.height();
            var headImage = container.find("img");
            var theWidth,theHeight;

            if(imgWidth>imgHeight){
                theWidth = imgWidth*boxHeight/imgHeight
                headImage.css({"width":theWidth,"height":boxHeight})
            }else{
                theHeight = imgHeight*boxWidth/imgWidth
                headImage.css({"width":boxWidth,"height":theHeight})

            }
        }
        function personalInfo(theFirst){


            var data = {
                "actId":actId,
                "actToken":actToken,
                "sex":theFirst.sex,
                "num":theFirst.guestNumber,
                "allPeople":{
                    "male":[
                        {
                            nickname:"num" + '1号',
                            num:1,
                            sex:1,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"num" + '2号',
                            num:2,
                            sex:1,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"num" + '3号',
                            num:3,
                            sex:1,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"num" + '4号',
                            num:4,
                            sex:1,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"num" + '5号',
                            num:5,
                            sex:1,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        }

                    ],
                    "female":[
                        {
                            nickname:"女" + '5号',
                            num:1,
                            sex:0,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"女" + '5号',
                            num:2,
                            sex:0,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"女" + '5号',
                            num:3,
                            sex:0,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"女" + '5号',
                            num:4,
                            sex:0,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        },
                        {
                            nickname:"女" + '5号',
                            num:5,
                            sex:0,
                            birthday:'1992-03-13',
                            province: "广东",
                            city: "广州",

                            photos:['http://7xn981.com2.z0.glb.qiniucdn.com/image.jpeg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g5tuc68ff14rl19in7lm10mi7.jpg','http://7xn981.com2.z0.glb.qiniucdn.com/o_1a1g60muu90o1jl91g49q8h1qbe7.jpg'],
                            selfIntro:'身高165cm，略瘦。大胃爱美食，开朗偶抽风，有时反射弧比较长…… 大部分时候外向加欢脱，但常常也比较纠结。曾经一度是大爱热血少年漫的死宅【不腐】，现在喜欢看小说看电影看话剧。微颜控，喜欢美丽和萌的东西，最怕鬼故事。。。爱好唱唱歌，有时间也想旅游，想出门走走停停。希望生活安乐满足，偶尔关注下养生神马……想去港丽餐厅吃饭',
                            expectation:'175~185，斯文温和，成熟靠谱，让人有安全感。喜欢运动，阳光乐观。有爱心和耐心，有主见，不必外向直接但希望ta真诚',

                        }
                    ]
                }
            }
            var $container = $("#personalInfo");


            for(var i = 0; i<theGuests.person.length;i++){
                var thisPerson = theGuests.person[i]

                if(thisPerson.sex == 0){
                    data.allPeople.female[thisPerson.guestNumber - 1].headImage = thisPerson.headImage;
                    data.allPeople.female[thisPerson.guestNumber - 1].headImg = thisPerson.headImg;
                }
                else if(thisPerson.sex == 1){
                    data.allPeople.male[thisPerson.guestNumber - 1].headImage = thisPerson.headImage;
                    data.allPeople.male[thisPerson.guestNumber - 1].headImg = thisPerson.headImg;
            }
        };

            personalPage.init($container, $.extend(data))
        }

    }


    function theLianXian(data){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.scale = window.devicePixelRatio||2;
        this.canvas.width = $(document.body).width()*this.scale;
        this.canvas.height = $(this.canvas).height()*this.scale;
        this.males = data.males;
        this.females = data.females;
        this.defaultMaleHead = data.defaultMaleHead;
        this.defaultFemaleHead = data.defaultFemaleHead;
        this.pairs = data.pairs;

        this.headSize = data.headSize * this.scale;
        this.borderSize = data.borderSize * this.scale;
        this.pointSize = data.pointSize * this.scale;
        this.pointMagin = data.pointMagin * this.scale;
        this.betweenPoint = data.betweenPoint * this.scale;
        this.femaleLeft = data.femaleLeft * this.scale;
        this.maleLeft = data.maleLeft * this.scale;
        this.headTop = data.headTop * this.scale;

        this.person = [];
        this.lines = {};

        this.headBgColorWhite = data.headBgColorWhite;
        this.headBgColorPink = data.headBgColorPink;
        this.pointColorGray = data.pointColorGray;
        this.pointColorPink = data.pointColorPink;
        this.lineColor = data.headBgColorPink;

        this.defaultHeadFinished = false;
        this.headsFinished = false;

        this.menHead = [];
        this.woMenHead = [];
        this.peopleCount = 0;
        this.headDefault = 0;
        this.bindEvent = false;

        this.personalInfo = data.personalInfo;
        this.linkPeople = data.linkPeople;
        this.linkFinished = data.linkFinished;
        this.linkRefresh = data.linkRefresh;

        this.init();
    }
    theLianXian.prototype = {
        init:function(){//加载头像，以及初始化
            var t = this;
            for(var i=0;i<this.pairs;i++){
                t.person.push(new thePerson($.extend({image:t.menHead[i],pa:t,sex:"1"},t.males[i])));
                t.person.push(new thePerson($.extend({image:t.woMenHead[i],pa:t,sex:"0"},t.females[i])));
            }

            this.drawHeadBgWhite();
            this.drawHeadBgPink();
            this.drawPointGray();
            this.drawPointPink();
            this.drawDefaultHead();
            this.run();
            this.controller();

        },
        controller:function(){
            var t = this;
            var startX;
            var startY;
            var R = (this.headSize/2  + this.headTop/2)/this.scale;
            var theOriginTop = $(t.canvas).offset().top;
            var theFirst;//被连

            $(t.canvas).on("touchstart",function(event){
                var startCount = 0;
                if(!t.bindEvent){return}//不加载完不添加事件

                startX = event.touches[0].pageX;
                startY = event.touches[0].pageY - theOriginTop;


                for(var i=0;i<t.pairs*2;i++){//计算在不在范围，
                    var thisPerson = t.person[i];


                    if((startX<(thisPerson.arcX/ t.scale + R)) && (startX>(thisPerson.arcX/ t.scale - R))){
                        if((startY<(thisPerson.arcY/ t.scale + R)) && (startY>(thisPerson.arcY/ t.scale - R))){
                            thisPerson.onSelected = true;
                            theFirst = thisPerson;
                            startCount++
                            //页面上半部分头像照片
                            t.linkPeople(theFirst);
                            break;
                        }
                    }
                }

                if(startCount<1){
                    theFirst = null;
                }

            })

            $(t.canvas).on("touchmove",function(event){


                //console.log(t.lines);
                var moveX = event.touches[0].pageX;
                var moveY = event.touches[0].pageY - theOriginTop;
                var dX = moveX - startX;
                var moveCount = 0;

                if(dX != 0){
                    if(theFirst){
                        event.preventDefault();

                        if(theFirst.onlinked == true){//对应的清除已连接属性
                            delete  t.lines[theFirst.linkedLine]
                            theFirst.onlinked = false;
                            theFirst.linkedNumber = 0;
                            for(var i=0;i< t.pairs*2;i++){
                                if(t.person[i].sex != theFirst.sex && t.person[i].linkedNumber == theFirst.guestNumber){
                                    t.person[i].onlinked = false;
                                    t.person[i].linkedNumber = 0;
                                    t.person[i].linking = false;
                                    t.person[i].onSelected = false;

                                }
                            }
                        }

                        var key = (theFirst.sex * t.pairs) + theFirst.guestNumber;

                        if(theFirst.onlinked == false ){//没有连线则新建连线
                            t.lines[key] = new linkLine(theFirst);

                        }

                        t.lines[key].endX = moveX * t.scale;
                        t.lines[key].endY = moveY * t.scale;

                        //第二个人的区域
                        for(var i=0;i<t.pairs*2;i++){//计算在不在范围，
                            var thisPerson = t.person[i];


                            if((moveX<=(thisPerson.arcX/ t.scale + R)) && (moveX>=(thisPerson.arcX/ t.scale - R))){
                                if((moveY<=(thisPerson.arcY/ t.scale + R)) && (moveY>=(thisPerson.arcY/ t.scale - R))){
                                    if(thisPerson.sex != theFirst.sex && thisPerson.onlinked == false){
                                        thisPerson.onSelected = true;
                                        thisPerson.linking = true;
                                        //moveCount++
                                        t.linkPeople(thisPerson);//连线的第二个人
                                        break;
                                    }
                                }
                                thisPerson.onSelected = false;
                                if(thisPerson.onlinked == false){
                                    thisPerson.linking = false;
                                }
                            }
                            thisPerson.onSelected = false;
                            if(thisPerson.onlinked == false){
                                thisPerson.linking = false;
                            }

                        }



                        theFirst.linking = true;
                        theFirst.onSelected = true;
                    }
                }
            })

            $(t.canvas).on("touchend",function(event){

                var linkCount = 0;//如果都没连则删除线

                var endX = event.changedTouches[0].pageX;
                var endY = event.changedTouches[0].pageY - theOriginTop;


                if(startX == endX && theFirst){//点击事件
                    theFirst&&(theFirst.onSelected = false);//取消颜色变化
                    theFirst&&(theFirst.onlinked = false);//取消颜色变化

                    t.linkRefresh();
                    t.personalInfo(theFirst);

                }else{//连线事件
                    if(theFirst){
                        theFirst.onSelected = false;//取消颜色变化

                        var key = (theFirst.sex * t.pairs) + theFirst.guestNumber;
                        //第二个人的区域
                        for(var i=0;i<t.pairs*2;i++){//计算在不在范围，
                            var thisPerson = t.person[i];


                            if((endX<=(thisPerson.arcX/ t.scale + R)) && (endX>=(thisPerson.arcX/ t.scale - R))){
                                if((endY<=(thisPerson.arcY/ t.scale + R)) && (endY>=(thisPerson.arcY/ t.scale - R))){
                                    if(thisPerson.sex != theFirst.sex && thisPerson.onlinked == false){

                                        t.linkFinished();//连线成功


                                        t.lines[key].endX = thisPerson.pointX;
                                        t.lines[key].endY = thisPerson.pointY;

                                        theFirst.onlinked = true;
                                        theFirst.linkedNumber = thisPerson.guestNumber;
                                        theFirst.linkedLine = key;
                                        theFirst.onSelected = false;
                                        theFirst.linking = true;

                                        thisPerson.onlinked = true;
                                        thisPerson.linkedNumber = theFirst.guestNumber;
                                        thisPerson.linkedLine = key;
                                        thisPerson.onSelected = false;
                                        thisPerson.linking = true;



                                        theFirst = null;
                                        linkCount++
                                        break
                                    }
                                }

                            }

                        }

                        for(var i = 0;i < t.pairs*2;i++){
                            if(!t.person[i].onlinked){
                                t.person[i].linking = false;
                                t.person[i].onSelected = false;
                            }
                        }

                        console.log(t.person)
                        //console.log("linkCount",linkCount)
                        if(linkCount<1){
                            theFirst.linking = false;
                            delete t.lines[key];
                            t.linkRefresh();
                        }
                    }
                }
            })

        },
        run:function(){
            var t = this;
            var raf = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function (callback){window.setTimeout(callback, 17);};
            function ani(){
                //console.log(t.headCount)
                if(t.headsFinished || t.headDefault == 2){
                    t.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                    for(var i=0;i< t.pairs*2;i++){
                        t.person[i].render();
                    }
                    for(var i in t.lines){
                        t.lines[i].render();
                    }
                }
                raf(ani);
            }
            ani();
        },
        drawHeadBgWhite:function(){
            this.whiteHeadBg = document.createElement("canvas");
            var ctx = this.whiteHeadBg.getContext("2d");
            var R = this.headSize/2 + this.borderSize;

            this.whiteHeadBg.width = 2*R;
            this.whiteHeadBg.height = 2*R;
            ctx.beginPath();
            ctx.arc(R,R,R,0,2*Math.PI);
            ctx.closePath();
            ctx.fillStyle = this.headBgColorWhite;
            ctx.fill();

        },
        drawHeadBgPink:function(){
            this.pinkHeadBg = document.createElement("canvas");
            var ctx = this.pinkHeadBg.getContext("2d");
            var R = this.headSize/2 + this.borderSize;

            this.pinkHeadBg.width = 2*R;
            this.pinkHeadBg.height = 2*R;
            ctx.beginPath();
            ctx.arc(R,R,R,0,2*Math.PI);
            ctx.closePath();
            ctx.fillStyle = this.headBgColorPink;
            ctx.fill();

        },
        drawPointGray:function(){
            this.GrayPoint= document.createElement("canvas");
            var ctx = this.GrayPoint.getContext("2d");
            var R = this.pointSize/2 ;
            this.GrayPoint.width = 2*R;
            this.GrayPoint.height = 2*R;
            ctx.beginPath();
            ctx.arc(R,R,R,0,2*Math.PI);
            ctx.closePath();
            ctx.fillStyle = this.pointColorGray;
            ctx.fill();
        },
        drawPointPink:function(){
            this.pinkPoint= document.createElement("canvas");
            var ctx = this.pinkPoint.getContext("2d");
            var R = this.pointSize/2 ;
            this.pinkPoint.width = 2*R;
            this.pinkPoint.height = 2*R;
            ctx.beginPath();
            ctx.arc(R,R,R,0,2*Math.PI);
            ctx.closePath();
            ctx.fillStyle = this.pointColorPink;
            ctx.fill();
        },
        drawDefaultHead:function(){
            var t = this;
            var femaleDefaultHead = new Image();
            femaleDefaultHead.src = this.defaultFemaleHead;
            femaleDefaultHead.onload = function(){
                t.drawHead(femaleDefaultHead,"female");
                delete femaleDefaultHead;
            };

            var maleDefaultHead = new Image();
            maleDefaultHead.src = this.defaultMaleHead;
            maleDefaultHead.onload = function(){
                t.drawHead(maleDefaultHead,"male");
                delete maleDefaultHead;
            }
        },
        drawHead:function(img){
            this.headDefault++
            this.maleDefault = document.createElement("canvas");
            this.maleDefault.width = this.headSize
            this.maleDefault.height = this.headSize
            this.maleCtx = this.maleDefault.getContext("2d");
            this.maleCtx.drawImage(img,0,0,this.headSize,this.headSize);

            this.femaleDefault = document.createElement("canvas");
            this.femaleDefault.width = this.headSize
            this.femaleDefault.height = this.headSize
            this.femaleCtx = this.femaleDefault.getContext("2d");
            this.femaleCtx.drawImage(img,0,0,this.headSize,this.headSize);


        },
        _showPersonDetail:function(person){
            window.location.href = 'guestInfo.html'+getCommonParams()
                +'&actId='+encodeURIComponent(actId)+'&actToken='+actToken
                +'&sex='+encodeURIComponent(person.sex)+'&num='+encodeURIComponent(person.guestNumber);
        }

    }

    function thePerson(obj){
        this.guestId = obj.guestId;
        this.guestNumber = obj.guestNumber;
        this.headImg = obj.headImg;
        this.linkedNumber = 0;
        this.nickName = obj.nickname;
        this.taskNum = obj.taskNum;
        this.headBgColor = obj.pa.headBgColorWhite;
        this.pointColor = obj.pa.pointColorGray;
        this.sex = obj.sex;
        this.pa = obj.pa;
        this.image = obj.image;
        this.drawHead();
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.pa.headSize;
        this.canvas.height =  this.pa.headSize;

        this.linkedNumber = 0;
        this.linkedLine = null;

        this.onlinked = false;
        this.onSelected = false;
        this.linking = false;



    }
    thePerson.prototype = {
        drawHead:function(){
            var pa = this.pa;
            var t = this
            var headImg = new Image();
            headImg.src = this.headImg;
            headImg.onload = function(){
                t.headImage = this
                pa.peopleCount++
                if(pa.peopleCount == pa.pairs*2){
                    pa.bindEvent = true;
                }

                var headCanvas = document.createElement("canvas");
                var ctx = headCanvas.getContext("2d");
                headCanvas.width = pa.headSize;
                headCanvas.height = pa.headSize;



                var imgWidth = this.width ;
                var imgHeight = this.height ;
                var imgSize = pa.headSize;
                var headScale,longSize,headX,headY;



                if(imgWidth<=imgHeight){
                    headScale = imgSize/imgWidth;
                    longSize = headScale*imgHeight;
                    headX = 0;
                    headY = (imgSize - longSize)/2
                    ctx.drawImage(this,headX,headY,longSize,imgSize);

                }else{
                    headScale = imgSize/imgHeight;
                    longSize = headScale*imgWidth;
                    headX = (imgSize - longSize)/2;
                    headY = 0;
                    ctx.drawImage(this,headX,headY,imgSize,longSize);
                }

                var cx = imgSize/2;
                var cy = imgSize/2;
                var sr = imgSize/2;


                //清除头像的四角
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx,cy,sr,0,1*Math.PI);
                ctx.lineTo(0,imgSize);
                ctx.lineTo(imgSize,imgSize);
                ctx.closePath();
                ctx.clip();
                ctx.clearRect(0,0,imgSize,imgSize);
                ctx.restore();

                ctx.beginPath();
                ctx.arc(cx,cy,sr,0,1*Math.PI,true);
                ctx.lineTo(0,0);
                ctx.lineTo(imgSize,0);
                ctx.closePath();
                ctx.clip();
                ctx.clearRect(0,0,imgSize,imgSize);

                t.canvas.getContext("2d").drawImage(headCanvas,0,0,pa.headSize,pa.headSize);

            }
        },

        render:function(){
            var t = this;
            var pa = this.pa;
            var theLeft = 0;
            var thePointLeft = 0;
            var defaultHead;
            var theTop = pa.headTop*this.guestNumber + pa.borderSize + (pa.borderSize*2 + pa.headSize)*(this.guestNumber - 1);
            var theMiddle = pa.canvas.width/2;
            this.Top = theTop;
            this.arcY = theTop + pa.headSize/2;
            this.pointY = theTop + pa.headSize/2;
            var headBg;
            var pointImage;

            if(this.sex == 1){
                defaultHead = pa.maleDefault
                theLeft = theMiddle + pa.betweenPoint + pa.pointSize + pa.pointMagin + pa.borderSize;
                thePointLeft = theLeft - pa.pointMagin - pa.pointSize - pa.borderSize;
                this.left = theLeft;//给头像添加left属性
                this.arcX = theLeft + pa.headSize/2;
                this.pointX = thePointLeft + pa.pointSize/2;


            }else if(this.sex == 0){
                defaultHead = pa.femaleDefault
                theLeft = theMiddle - pa.betweenPoint - pa.pointSize - pa.pointMagin - pa.headSize - pa.borderSize;
                thePointLeft = theLeft + pa.borderSize*2 + pa.headSize + pa.pointMagin
                this.left = theLeft;
                this.arcX = theLeft + pa.headSize/2;
                this.pointX = thePointLeft + pa.pointSize/2;

            }
            headBg = this.onSelected?pa.pinkHeadBg:pa.whiteHeadBg;
            pointImage = this.linking?pa.pinkPoint:pa.GrayPoint;


            pa.ctx.drawImage(headBg,theLeft - pa.borderSize,theTop - pa.borderSize);
            pa.ctx.drawImage(pointImage,thePointLeft,theTop + pa.headSize/2 - pa.pointSize/2);
            pa.ctx.drawImage(defaultHead,theLeft,theTop,pa.headSize,pa.headSize);
            pa.ctx.drawImage(t.canvas,theLeft,theTop,pa.headSize,pa.headSize);




        }

    }

    function linkLine(from){
        this.pa = from.pa;
        this.beiginX = from.pointX;
        this.beiginY = from.pointY;
        this.endX = from.pointX;
        this.endY = from.pointY;
    }
    linkLine.prototype = {
        render:function(){
            var pa = this.pa;
            pa.ctx.drawImage(pa.pinkPoint,this.endX - pa.pointSize/2,this.endY - pa.pointSize/2);
            pa.ctx.beginPath();
            pa.ctx.lineWidth = 3;
            pa.ctx.moveTo(this.beiginX,this.beiginY);
            pa.ctx.lineTo(this.endX,this.endY);
            pa.ctx.strokeStyle = pa.lineColor;
            pa.ctx.stroke();
        }
    }

})