## 约会挑战微信端协议

微信页面通用URl参数

    http://xx/list.html?uid=用户id&sign=签名

通用请求字段

协议字段  |  数据类型 | 必要性 | 说明
---------|----------|--------|--------
uid      |  String  | 必选    |用户id
sign     |  String  | 必选    |签名
vs       |  String  | 必选    |模板版本号
ts       |  Number  | 必选    |请求时间戳,单位为秒

    {
        uid:'wqfwf',
        sign:'dsdsad',
        vs:'0.0.1',
        ts:1422429098477
    }

通用返回字段

协议字段  |  数据类型 | 必要性 | 说明
---------|----------|--------|--------
error    |  Number  | 可选    |错误码，如果该字段为空就表示请求没有错误，否则根据错误码提示报错

    {
        error:1001
    }


* [发送短信验证码](#toc_1)
* [验证手机号](#toc_2)
* [请求个人信息](#toc_3)//只能请求用户自身的信息
* [编辑个人信息](#toc_4)//编辑用户自身的信息
* [请求验证个人账户](#toc_5)//验证通过的账户才可以创建所有人可见的活动
* [添加好友关系](#toc_6)
* [创建活动](#toc_7)
* [创建者编辑活动资料](#toc_8)//创建成功之后可以再次编辑活动资料，以防创建时资料输入错误不能修改
* [请求活动列表](#toc_9)
* [请求活动详情](#toc_10)
* [报名活动](#toc_12)
* [请求活动已报名填写的资料](#toc_12)//活动报名之后可以再次修改报名资料
* [创建者查看报名列表](#toc_13)
* [创建者选拨并公布嘉宾](#toc_14)
* [请求活动弹幕](#toc_15)
* [发送活动弹幕](#toc_16)
* [查看活动嘉宾的资料](#toc_17)
* [推荐活动嘉宾](#toc_18)//为活动嘉宾点靠谱或者写推荐语
* [提交连线方案](#toc_19)
* [查看连线数据](#toc_20)
* [请求约会任务列表](#toc_21)
* [请求约会任务详情](#toc_22)
* [提交约会任务](#toc_23)//约会任务提交之后也可以再次编辑
* [请求日记模板](#toc_24)//约会日记相关的暂时都不用实现
* [提交约会日记](#toc_25)//约会日记相关的暂时都不用实现
* [获取约会日记列表](#toc_26)//约会日记相关的暂时都不用实现
* [查看约会日记详情](#toc_27)//约会日记相关的暂时都不用实现
* [获取微信JSSDK配置参数](#toc_28)
* [支付系统](#toc_29)
* [点赞](#toc_30)
* [取消点赞](#toc_31)
* [评论](#toc_32)
* [删除评论](#toc_33)
* [关注](#toc_34)
* [取消关注](#toc_35)
* [图片上传系统](#toc_36)
* [提交用户建议（吐槽）](#toc_37)

#### 发送短信验证码 =====>> /wx/user/getcaptcha(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
mobile   | String   | 必选    | 手机号

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status         |  Number   | 必选  | 0代表发送成功，否则不成功 

    req:
    {
        mobile:'15201317810'
    }
    res:
    {
        status:0
    }



#### 验证手机号 =====>> /wx/user/verifymobile(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
mobile   | String   | 必选    | 手机号
captcha   | String   | 必选    | 短信验证码

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status         |  Number   | 必选  | 0代表验证成功，否则不成功 

    req:
    {
        mobile:'15201317810',
        captcha:'241231'
    }
    resp:
    {
        status:0
    }

#### 请求个人资料 =====>> /wx/user/getInfo(GET)，默认使用微信数据

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
targetId  | String   |   必要   | 请求目标用户的uid  

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
nickname      |  String   | 必选  | 昵称
sex           |  Number   | 必选  | 0代表女，1代表男
headImg       |  String   | 必选  | 头像
city          |  String   | 必选  | 用户所在城市
province      |  String   | 必选  | 用户所在省份
country       |  String   | 必选  | 用户所在国家
verified      |  Number   | 必选  | 0代表账号已验证，否则未验证
mobile        |  Number   | 可选  | 用户手机号，只返回给自身的请求
wx            |  String   | 可选  | 用户微信号
birthday      |  String   | 可选  | 生日
photos        |  Array    | 可选  | 相册
selfIntro     |  String   | 可选  | 自我介绍
expectation   |  String   | 可选  | 对另一半的期望

    req:
    {
    }
    resp:
    {
        nickname:'杜聪',
        sex:1,
        headImg:'http://xx.png',
        city: "广州", 
        province: "广东", 
        country: "中国", 
        mobile:15201317810,
        wx:'suoXingSuiXin',
        verified:0,
        birthday:'1992-04-15',
        photos:['http://xx.png','http://ee.png'],
        selfIntro:'hello world',
        expectation:'hello boy'
    }

#### 编辑个人资料 =====>> /wx/user/editInfo(GET)//可以编辑也可以从报名资料中同步

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
nickname      |  String   | 必选  | 昵称
headImg       |  String   | 必选  | 头像
city          |  String   | 必选  | 用户所在城市
province      |  String   | 必选  | 用户所在省份
country       |  String   | 必选  | 用户所在国家
mobile        |  Number   | 可选  | 用户手机号
wx            |  String   | 可选  | 用户微信号
birthday      |  String   | 可选  | 生日
photos        |  Array    | 可选  | 相册
selfIntro     |  String   | 可选  | 自我介绍
expectation   |  String   | 可选  | 对另一半的期望

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        |  Number   | 可选  | 0代表成功，否则失败

    req:
    {
        nickname:'杜聪',
        headImg:'http://xx.png',
        city: "广州", 
        province: "广东", 
        country: "中国", 
        mobile:15201317810,
        wx:'suoXingSuiXin',
        birthday:'1992-04-15',
        photos:['http://xx.png','http://ee.png'],
        selfIntro:'hello world',
        expectation:'hello boy'
    }
    resp:
    {
        status:0
    }


#### 请求验证个人账户 =====>> /wx/user/verify(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表添加提交请求成功，否则失败


    req:
    {
    }
    resp:
    {
        status:0//只是表示提交请求成功，验证的过程为后台管理员人工验证
    }


#### 添加好友关系 =====>> /wx/user/addFriend(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
userId    | String   | 必选    | 好友ID

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表添加好友成功，否则失败


    req:
    {
        userId:'jc' //此处添加好友为互相添加
    }
    resp:
    {
        status:0
    }

#### 创建活动 =====>> /wx/act/create(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
title     | String | 必要   | 活动标题
regDeadline  | Number | 必要   | 报名截止日期，'2015-11-11'
linkingDuration | Number | 必要 | 连线时长，单位天
desc      | String | 必要  | 活动说明
cover      | String | 必要  | 活动封面
permission | Number | 必须 | 0代表仅好友可见，1代表所有人可见，只有申请验证过的账号才可以创建所有人可见的活动

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number | 必要   | 0代表成功，否则失败
actId         | Number | 可选   | 活动ID，创建成功返回
actToken      | Number | 可选   | 活动Token


    req:
    {
        title:'一起跳舞',
        regDeadline:'2015-11-11',
        linkingDuration:3,
        desc:'谈恋爱不如跳舞',
        cover:'http://xxx.png',
        permission:1
    }
    resp:
    {
        status:0,
        actId:12,
        actToken:'dssds'
    }

#### 创建者编辑活动资料 =====>> /wx/act/editActInfo(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
title     | String | 必要   | 活动标题
regDeadline  | Number | 必要   | 报名截止日期，'2015-11-11'
linkingDuration | Number | 必要 | 连线时长，单位天
desc      | String | 必要  | 活动说明
cover      | String | 必要  | 活动封面
permission | Number | 必须 | 0代表仅好友可见，1代表所有人可见，只有申请验证过的账号才可以创建所有人可见的活动

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number | 必要   | 0代表成功，否则失败


    req:
    {
        title:'一起跳舞',
        regDeadline:'2015-11-11',
        linkingDuration:3,
        desc:'谈恋爱不如跳舞',
        cover:'http://xxx.png',
        permission:1
    }
    resp:
    {
        status:0
    }

#### 请求活动列表 =====>> /wx/act/getList(GET)

请求参数格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
list          | [Activity]| 必要   | 活动数组

Activity

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId     |  String   | 必选  | 对应数据库中的唯一ID
actId     |  Number  | 必要     | 活动唯一标识ID
actToken  |  String  | 必要     | 活动凭证,用来请求活动详情的
title     |  String  | 必要     | 活动标题
creatorName   |  String  | 必要     | 活动创建者昵称
creatorHead   |  String  | 必要     | 活动创建者头像
cover    |  String  | 必要     | 活动海报图片
createTime|  Number  | 必要     | 活动创建时间戳，单位为秒
status    |  Number  | 必要     | 活动当前状态，0表示报名中，1表示连线中，2表示约会中
followed  |  Number  | 必要     | 0代表已关注，否则代表未关注
tag       |  String  | 必要     | 活动标签，标签影响的排序规则由服务端完成


    req://虽然没有指定请求参数，但活动列表应该是默认根据用户的关注和好友关系已经热门活动生成
    {
    }
    resp:
    {
        list:[
            {
                uniId:'1221ex',
                actId:1,
                actToken:'x2ed2x',
                title:'光棍节特别活动',
                creatorName:'北大未名BBS',
                creatorHead:'xxx.png',
                createTime:1443067330711,
                cover:'http:/xxx.png',
                status:1,
                followed:0,
                tag:'热门'
            },
            {
                uniId:'1221ex',
                actId:2,
                actToken:'x2ed2x',
                title:'你们约会我买单',
                creatorName:'杜聪',
                creatorHead:'xxx.png',
                createTime:1443067330872,
                cover:'http:/xxx.png',
                status:1,
                followed:1,
                tag:'好友创建'
            }
        ]
    }

#### 请求活动详情 =====>> /wx/act/getDetail(GET)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
uniId         |  String   | 必选  | 对应数据库中的唯一ID
title     |  String  | 必要     | 活动标题
cover      | String | 必要  | 活动封面
creatorId   |  String  | 必要     | 活动创建者Id
creatorName   |  String  | 必要     | 活动创建者昵称
creatorHead   |  String  | 必要     | 活动创建者头像
createTime|  Number  | 必要     | 活动创建时间戳，单位为秒
status    |  Number  | 必要     | 活动当前状态，0表示报名中，1表示连线中，2表示约会中
linkData  |  Array   | 可选     | 连线数据，连线中和约会中返回，linkData(i)(j)表示女i+1号和男j+1号的连线数
followed  |  Number  | 必要     | 0代表已关注，否则代表未关注
tag       |  String  | 必要     | 活动标签，标签影响的排序规则由服务端完成
desc      |  String  | 必要     | 活动简介
regDeadline  |  Number  | 必要     | 活动报名截止日期
linkDeadline  |  Number  | 必要     | 连线截止时间戳，单位秒
linkingDuration|  Number | 必要     | 连线时长，单位天
registered|  Number  | 必要     | 0代表用户已经报名，否则未报名
males     | [Guest]  | 可选     | 男嘉宾列表，连线中和约会中返回
females   | [Guest]  | 可选     | 女嘉宾列表，连线中和约会中返回

Guest

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
nickname  | String   | 必选    | 昵称
guestNumber| Number   | 必选    | 嘉宾编号，如男一号、女三号
headImg   | String   | 必选    | 头像url
linkedNumber| Number   | 可选    |连线结束后返回，配对方的编号，用来标记被连线的对方嘉宾编号
taskNum   | Number   | 可选 |连线结束后返回，表示已完成的约会任务数目


    req:
    {
        actId:'act1'
    }
    resp:
    {
        uniId:'1221ex',
        title:'光棍节特别活动',
        creatorId:'12312d',
        creatorName:'北大未名BBS',
        creatorHead:'http://xxx.png',
        cover:'http://xxx.png',
        createTime:1443067330711,
        status:1,
        followed:1,
        tag:'热门',
        desc:'光棍节让我们相互取暖',
        regNum:123,//已报名的人数
        regDeadline:'2015-11-11',//报名截止日期
        linkDeadline:1443067330711,//连线截止时间戳
        linkingDuration:3,//连线时长，单位天
        linkData:[
            [10,9,8,7,6],
            [10,9,8,7,6],
            [10,9,8,7,6],
            [10,9,8,7,6],
            [10,9,8,7,6]
        ],
        males:[
            {
                nickname:'杜聪',
                guestNumber:1,//男1号
                headImg:'xxx.png',
                linkedNumber:3,//表示男1号和女3号被连接了
                taskNum:2//表示已完成2个约会任务
            }
        ],
        females:[
        ]
    }

#### 报名活动 =====>> /wx/act/signUp(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId     | Number   | 必选    | 活动ID
actToken  | String   | 必选    | 活动Token
nickname  | String   | 必选    | 昵称
birthday  | String   | 必选    | 生日,格式为'1992-03-13'
sex       | Number   | 必选    | 性别，1男0女
headImg   | String   | 必选    | 头像url
photos    | Array   | 必选    | 相册
selfIntro  | String   | 必选    | 自我介绍
expectation  | String   | 必选    | 对另一半的期望
wx         | String   | 必选    | 微信账号
province     | String   | 必选    | 所在省名称
city         | String   | 必选    | 所在市名称


返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        |  Number   | 必要   | 0代表报名成功，否则代表失败

    req:
    {
        actId:'ax23',
        actToken:'xxx',
        nickname:'杜聪',
        birthday:'1992-03-13',
        sex:1,
        headImg:'xxx.png',
        photos:['xx.png','yy.png'],
        selfIntro:'其实我是一个演员',
        expectation:'你爱谈天我爱笑',
        wx:'suoXingSuiXin',
        province:'湖北',
        city:'咸宁'
    }
    resp:
    {
        status:0
    }

#### 请求活动已报名填写的资料 =====>> /wx/act/getRegisterInfo(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId     | Number   | 必选    | 活动ID
actToken  | String   | 必选    | 活动Token

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
nickname  | String   | 必选    | 昵称
birthday  | String   | 必选    | 生日,格式为'1992-03-13'
sex       | Number   | 必选    | 性别，1男0女
wx         | String   | 必选    | 微信账号
province     | String   | 必选    | 所在省名称
city         | String   | 必选    | 所在市名称
headImg   | String   | 必选    | 头像url
photos    | Array   | 必选    | 相册
selfIntro  | String   | 必选    | 自我介绍
expectation  | String   | 必选    | 对另一半的期望

    req:
    {
        actId:'ax23',
        actToken:'xxx',
    }
    resp:
    {
        nickname:'杜聪',
        birthday:'1992-03-13',
        sex:1,
        wx:'suoXingSuiXin',
        province:'湖北',
        city:'咸宁',
        headImg:'xxx.png',
        photos:['xx.png','yy.png'],
        selfIntro:'其实我是一个演员',
        expectation:'你爱谈天我爱笑'
    }


#### 创建者查看报名列表 =====>> /wx/act/getRegList(GET)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
list          | [Guest]| 必要   | 活动数组

Guest

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uid    | String   | 必选    | 用户ID
nickname  | String   | 必选    | 昵称
mobile    | String   | 必选    | 手机号
wx        | String   | 必选    | 微信号
birthday  | String   | 必选    | 生日
sex       | Number   | 必选    | 性别
headImg| String   | 必选    | 头像url
photos    | StringArray   | 必选    | 相册
selfIntro  | String   | 必选    | 自我介绍
expectation  | String   | 必选    | 对另一半的期望
province   | String   | 必选    | 所在省
city       | String   | 必选    | 所在市

    req:
    {
        actId:'act3'
    }
    resp:
    {
        list:[
            {
                uid:'1x2x',
                nickname:'杜聪',
                mobile:'15201317810',
                birthday:'19920313',
                sex:1,
                headImg:'xxx.png',
                photos:['x0.png','x1.png'],
                selfIntro:'Hello World',
                expectation:'Hello dc',
                province:'湖北',
                city:'咸宁'
            }
        ]
    }

#### 创建者选拨并公布嘉宾列表 =====>> /wx/act/chooseGuest(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId     | Number   | 必选     | 活动ID
actToken   | Number   | 必选    | 活动Token
males     | [uid]  | 必要     | 嘉宾uid列表
females   | [uid]  | 必要     | 嘉宾uid列表

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        |  Number   | 必要   | 0代表取成功，否则代表失败


    req:
    {
        actId:'act2',
        males:['m0','m1','m2','m3','m4','m5','m6'],
        females:['f0','f1','f2','f3','f4','f5','f6']
    }
    resp:
    {
        status:0
    }

#### 请求活动弹幕 =====>> /wx/act/getBarrage(GET)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
list          | [Barrage]| 必要   | 活动数组

Barrage

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId   | String    | 必选   | 对应数据库的唯一ID，用于点赞
text  | String   | 必选    | 弹幕内容
headImg| String   | 必选    | 作者头像
ts     | Number   | 必选    | 弹幕发布时间戳
praised   | Number   | 必选    | 0代表用户已经赞过，否则没有赞过

    req:
    {
        actId:'act0'
    }
    resp:
    {
        list:[
            {
                text:'男一女七绝配啊~~',
                headImg:'xx.png',
                ts:21323213,
                praised:0//已经赞过这条弹幕
            },
            {
                text:'女二绝对好姑娘',
                headImg:'xx.png',
                ts:21323213,
                praised:1//没有赞过这条弹幕
            }
        ]
    }

#### 发送活动弹幕 =====>> /wx/act/sendBarrage(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token
text    | String   | 必选    | 弹幕内容

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        |  Number   | 必要   | 0代表取成功，否则代表失败


    req:
    {
        actId:'act0',
        text:'女三好姑娘'
    }
    resp:
    {
        status:0
    }

#### 查看活动嘉宾的资料 =====>> /wx/act/getGuestInfo(GET)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId     | Number   | 必选    | 活动ID
actToken  | String   | 必选    | 活动token
sex  | Number   | 必选    | 嘉宾性别，1男0女
num  | Number   | 必选    | 嘉宾编号，如男一号、女三号


返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
nickname  | String   | 必选    | 昵称
birthday  | String   | 必选    | 生日
province     | String   | 必选    | 所在省名称
city         | String   | 必选    | 所在市名称
headImg   | String   | 必选    | 头像url
photos    | StringArray   | 必选    | 相册
selfIntro  | String   | 必选    | 自我介绍
expectation  | String   | 必选    | 对另一半的期望
recommended  | Number   | 必选    | 代表用户是否已经推荐过这为嘉宾，0代表是，1代表不是
recommends   | [recommend] | 必选  | 嘉宾的推荐记录

recommend

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
nickname  | String   | 必选    | 推荐者昵称
headImg   | String   | 必选    | 推荐者头像
text      | String   | 可选    | 推荐者留言，有可能为空


    req:
    {
        actId:'ax23',
        actToken:'xxx',
        sex:0,
        num:2//代表请求2号女嘉宾的资料
    }
    resp:
    {
        nickname:'杜聪',
        birthday:'19920313',
        province: "广东",
        city: "广州",
        headImg:'xxx.png',
        photos:['x0.png','x1.png'],
        selfIntro:'Hello World',
        expectation:'Hello dc',
        recommended:1,
        recommends:[
        {
            headImg:'http://xxx.png',
            nickname:'杜聪',
            text:'她在与人相处的过程中非常的真诚！'
        },
        {
            headImg:'http://xxx.png',//代表只点赞没评论
            nickname:'杜聪'
        }
        ]
    }

#### 推荐活动嘉宾 =====>> /wx/act/recommendGuest(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken| String   | 必选    | 活动Token
sex  | Number   | 必选    | 嘉宾性别，1男0女
num  | Number   | 必选    | 嘉宾编号，如男一号、女三号
text | String   | 可选    | 推荐语，用户可以不填写

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        |  Number   | 必要   | 0代表取成功，否则代表失败


    req:
    {
        actId:'act1',
        actToken:'xxx',
        sex:0,oll
        num:2,
        text:'这妹子靠谱'//表示推荐2号女嘉宾，推荐语为'这妹子靠谱'
    }
    resp:
    {
        status:0
    }

#### 提交连线方案 =====>> /wx/act/submitLink(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken| String   | 必选    | 活动Token
map     | Object   | 必选    | 配对方案，key表示女嘉宾的编号，value表示男嘉宾的编号

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        |  Number   | 必要   | 0代表取成功，否则代表失败


    req:
    {
        actId:'act1',
        actToken:'xxx',
        map:{
            1:2,//表示1号女嘉宾和2男嘉宾配对
            2:4,
            3:3,
            4:1,
            5:5
        }
    }
    resp:
    {
        status:0
    }

#### 查看连线数据 =====>> /wx/act/getLinkData(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId     | String   | 必选    | 活动ID
actToken  | String   | 必选    | 活动Token

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
data     | Object   | 必选    | 连线数据，data(i)(j)表示女i+1号和男j+1号的连线数


    req:
    {
        actId:'act1',
        actToken:'xxx'
    }
    resp:
    {
        data:[
            [10,9,8,7,6],
            [10,9,8,7,6],
            [10,9,8,7,6],
            [10,9,8,7,6],
            [10,9,8,7,6]
        ]
    }


#### 请求约会任务列表 =====>> /wx/act/getDatingTasks(GET)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token
fNum  | Number   | 必选    | 女嘉宾编号

返回数据格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
tasks     |  [task]  |  必要    | 任务列表

task

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
uniId         |  String   | 必选  | 对应数据库中的唯一ID
title         | String  | 必要   | 任务描述
taskId        | Number  | 必要   | 任务编号
praised       | Number  | 必要   | 0表示已赞，否则代表未赞
commentList      | [comment]   | 必要   | 评论列表
praiseList     | [praise]  | 必要   | 点赞列表
donateList     | [donate]  | 必要   | 捐赠列表
flag          | Number  | 必要   | 0代表任务已完成，否则为未完成
date          | String  | 必要   | 任务所属日期，已完成的任务为完成日期，未完成的任务为发布日期
reply         | String  | 可选   | 任务完成时嘉宾发布的文字描述
photos        | Array   | 可选   | 任务完成时嘉宾发布的图片列表

comment

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
uniId         |  String   | 必选  | 对应数据库中的唯一ID，用于删除评论
nickname      | String  | 必要   | 评论者昵称
ownerId       | String  | 必要   | 评论者uid
headImg       | String  | 必要   | 评论者头像
text          | String  | 必要   | 评论内容
targetName    | Number  | 必要   | 评论对象,0代表回复帖子,否则代表回复的评论者的昵称
targetId      | Number  | 必要   | 评论对象,0代表回复帖子,否则代表回复的评论者的昵称
ts            | Number  | 必要   | 评论时间戳

praise

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
nickname      | String  | 必要   | 点赞者昵称
ownerId       | String  | 必要   | 点赞者uid
headImg       | String  | 必要   | 点赞者头像
ts            | Number  | 必要   | 点赞时间戳

donate

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
nickname      | String  | 必要   | 捐赠者昵称
ownerId       | String  | 必要   | 捐赠者uid
headImg       | String  | 必要   | 捐赠者头像
sum           | Number  | 必要   | 捐赠金额
ts            | Number  | 必要   | 捐赠时间戳

    req:
    {
        actId:'act1',
        actToken:'xxx',
        fNum:1
    }
    resp:
    {
        tasks:[
            {
                uniId:'1221ex',
                title:'一块儿吃个晚饭',
                taskId:1,
                praiseNum:123,
                praised:0,
                flag:0,
                date:'20150928',
                reply:'今天一块儿吃了巫山烤全鱼，开心~~',
                photos:['x0.png','x1.png','x2.png'],
                commentList:[
                    {
                        uniId:'qqq',
                        nickname:'杜聪',
                        ownerId:'xxx',//表示评论者的昵称为'杜聪',uid为'xxx'
                        headImg:'dc.png',
                        text:'晚餐很浪漫喔~',
                        ts:20123123
                    },
                    {
                        uniId:'www',
                        nickname:'蒋超',
                        ownerId:'yyy',//表示评论者的昵称为'蒋超',uid为'yyy'
                        headImg:'jc.png',
                        text:'你也可以去参加一个啊',
                        targetName:'杜聪',//回复用户'杜聪'的评论
                        targetId:'xxx',//表示用户'杜聪'的uid为'xxx'
                        ts:20123123
                    }
                ],
                praiseList:[
                    {
                        nickname:'杜聪',
                        ownerId:'xxx',//表示点赞者的昵称为'杜聪',uid为'xxx'
                        headImg:'dc.png',
                        ts:20123123
                    },
                    {
                        nickname:'蒋超',
                        ownerId:'yyy',//表示点赞者的昵称为'蒋超',uid为'yyy'
                        headImg:'jc.png',
                        ts:20123123
                    }
                ],
                donateList:[
                    {
                        nickname:'杜聪',
                        ownerId:'xxx',//表示捐赠者的昵称为'杜聪',uid为'xxx'
                        headImg:'dc.png',
                        sum:100,
                        ts:20123123
                    },
                    {
                        nickname:'蒋超',
                        ownerId:'yyy',//表示捐赠者的昵称为'蒋超',uid为'yyy'
                        headImg:'jc.png',
                        sum:50,
                        ts:20123123
                    }
                ]
            }
        ]
    }


#### 提交约会任务 =====>> /wx/act/publishDatingRecord(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token
taskId   | Number   | 必选    | 任务ID
reply   | String   | 必选    | 文字描述
photos   | Array   | 必选    | 图片列表


返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number   | 必要   | 0代表成功，否则失败


    req:
    {
        actId:'act1',
        actToken:'xxx',
        taskId:1,
        reply:'晚餐好浪漫好开心~',
        photos:['x1.png','x2.png']
    }
    resp:
    {
        status:0
    }

#### 请求日记模板 =====>> /wx/act/getDairyTemp(GET)//暂时不用实现这个功能

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token
fNum  | Number   | 必选    | 女嘉宾编号
date    | String   | 必选    | 日记日期

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
list          | Array  | 必要   | 问题列表

    req:
    {
        actId:'act1',
        fNum:1,
        date:'20150928'
    }
    resp:
    {
        list:[
            '今天有没有见面',
            '有没有聊天'
        ]
    }

#### 提交约会日记 =====>> /wx/act/submitDairy(POST)//暂时不用实现这个接口

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token
fNum  | Number   | 必选    | 女嘉宾编号
date    | String   | 必选    | 日记日期
answers | [answer]    | 必选    | 回答列表

answer

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
text          | String  | 必要   | 文本答案
photos        | Array   | 必要   | 图片列表

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | [dairy]| 必要   | 活动数组

    req:
    {
        actId:'act1',
        fNum:1,
        date:'20150928',
        answers:[
            {
                text:'见面了',
                photos:['x1.png','x2.png']
            },
            {
                text:'聊得很开心',
                photos:['x1.png','x2.png']
            }
        ]
    }
    resp:
    {
        status:0
    }

#### 获取约会日记列表 =====>> /wx/act/getDairyList(GET)//暂时不用实现这个接口

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token
fNum  | Number   | 必选    | 女嘉宾编号

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
list          | [Dairy]    | 必选    | 日记列表

Dairy

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
date          | String    | 必选   | 日记日期
authorId      | String    | 必选   | 作者ID
uniId         |  String   | 必选  | 对应数据库中的唯一ID

    req:
    {
        actId:'act1',
        fNum:1
    }
    resp:
    {
        list:[
            {
                uniId:'1221ex',
                date:'20150928',
                authorId:'dc'
            },
            {
                uniId:'1221ex',
                date:'20150926',
                authorId:'cc'
            }
        ]
    }

#### 查看约会日记详情 =====>> /wx/act/getDairyDetail(GET)//暂时不用实现这个接口

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
actId   | Number   | 必选    | 活动ID
actToken   | Number   | 必选    | 活动Token
fNum  | Number   | 必选    | 女嘉宾编号
authorId| String   | 必选    | 作者Id
date    | String   | 必选    | 日记日期

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
qas           | [qa]      | 必选   | 问答列表
comments      | [comment]      | 必选   | 评论列表
uniId         |  String   | 必选  | 对应数据库中的唯一ID

qa

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
question      | String  | 必要   | 问题
answer        | String  | 必要   | 文本答案
photos        | Array   | 必要   | 图片列表

comment

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
uniId         |  String   | 必选  | 对应数据库中的唯一ID
nickname      | String  | 必要   | 评论者昵称
headImg       | String  | 必要   | 评论者头像
text          | String  | 必要   | 评论内容
target        | Number  | 必要   | 评论对象,0代表回复帖子,否则代表回复的评论者的昵称
ts            | Number  | 必要   | 评论时间戳

    req:
    {
        actId:'act1',
        fNum:1,
        authorId:'dc',
        date:'20150928'
    }
    resp:
    {
        uniId:'1221ex',
        qas:[
            {
                question:'今天一块儿见面了么?',
                answer:'见面咯~',
                photos:['p1.png','p2.png']
            },
            {
                question:'今天一块儿吃饭了么?',
                answer:'吃饭咯~',
                photos:['p1.png','p2.png']
            }
        ],
        comments:[
            {
                uniId:'1221ex',
                nickname:'杜聪',
                headImg:'dc.png',
                text:'晚餐很浪漫喔~',
                target:0,//0代表回复帖子
                ts:20123123
            },
            {
                uniId:'1221ex',
                nickname:'蒋超',
                headImg:'jc.png',
                text:'你也可以去参加一个啊',
                target:'杜聪',//回复杜聪的评论
                ts:20123123
            }
        ]
    }


#### 获取微信JSSDK配置参数 =====>> /wx/common/getJSParams(GET)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
url       |   String  |  必选  | 当前页面链接

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
appid        |   String   |  必选  | 微信公众号的APPID
ts         |   Number   |  必选  | 生成签名的时间戳
nonceStr    |   String   |  必选  | 生成签名的随机数
signature   |   String   |  必选  | 生成的签名


    req:
    {
        actId:'15201317810'
    }
    resp:
    {
        appid: "wx04f312a2e91723bb",
        ts: 1423711727,
        nonceStr: "5hKpVsbbgZn649gd",
        signature: "eb8f7623f0bd27d1fc3b1c27f2b9a011aa3fcdc1"
    }

#### 支付系统 =====>> 使用微信的支付接口

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId  | String   | 必要   | 支付对象的uniID，对应数据库中的唯一ID

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表支付成功，否则失败
sum           | Number    | 可选   | 支付金额


    req:{//使用微信的支付接口
        uniId:'xxx'
    }
    resp:
    {
        status:0,
        sum:100
    }


#### 点赞 =====>> /wx/common/praise(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId  | String   | 必要   | 点赞的对象ID，对应数据库中的唯一ID

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表成功，否则失败

    req:{
        uniId:'x2e21'
    }
    resp:
    {
        status:0
    }

#### 取消点赞 =====>> /wx/common/cancelPraise(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId  | String   | 必要   | 取消点赞的对象ID，对应数据库中的唯一ID

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表成功，否则失败


    req:{
        uniId:'x2e21'
    }
    resp:
    {
        status:0
    }

#### 评论 =====>> /wx/common/comment(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId  | String   | 必要   | 评论的主体对象的ID，对应数据库中的唯一ID
text      | String   | 必要   | 评论内容
targetName    | String   | 可选   | 若该字段不存在则表示这条评论是回复的帖子，否则代表回复的其他用户的昵称
targetId    | String   | 可选   | 评论回复的用户的id，用于查看用户信息

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表支付成功，否则失败
sum           | Number    | 可选   | 支付金额


    req:{
        uniId:'xxxx',
        text:'你也可以去参加一个啊',
        targetName:'杜聪',//回复杜聪的评论
        targetId:'xxx'//表示'杜聪'的uid为'xxx'
    }
    resp:
    {
        status:0,
        sum:100
    }

#### 删除评论 =====>> /wx/common/deleteComment(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId  | String   | 必要   | 评论的uniID，对应数据库中的唯一ID

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表成功，否则失败


    req:{
        uniId:'2xxx'
    }
    resp:
    {
        status:0
    }

#### 关注 =====>> /wx/common/follow(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId  | String   | 必要   | 关注的对象ID，对应数据库中的唯一ID

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表成功，否则失败


    req:{
        uniId:'x2e21'
    }
    resp:
    {
        status:0
    }

#### 取消关注 =====>> /wx/common/cancelFollow(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
uniId  | String   | 必要   | 取消关注的对象ID，对应数据库中的唯一ID

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表成功，否则失败


    req:{
        uniId:'x2e21'
    }
    resp:
    {
        status:0
    }

#### 图片上传系统 =====>> /wx/common/qiNiuUpToken

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------

返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
uptoken       | String    | 必要   | 七牛的上传凭证


    req:{
    }
    resp:
    {
        uptoken:'xxxxx'
    }
    生成算法参见：http://developer.qiniu.com/docs/v6/api/reference/security/upload-token.html
    使用的配置参数如下：
    config:{
        domain:'http://7xn981.com1.z0.glb.clouddn.com',
        Bucket: "test",
        AK: "fPE6HIGbPDSRjPi1HQge9gWI9QKgl-z8-WUoNG5Z",
        SK: "iuVCHbBF-isVwIl5s9Wz9sSc6pmnPNmsrqvX0Oeg",
        putPolicy:{
            scope:'test',
            deadline:getCurTime()+24*3600//表示token在当前时间之后的1天以内有效
        }
    }
	
#### 提交用户建议（吐槽） =====>> /wx/act/submitSuggestion(POST)

请求参数格式

协议字段  | 数据类型 | 必要性  | 说明 
----------|----------|---------|-------
suggestion  | String   | 必要   | 用户提出的建议
email  | String   | 必要   | 用户的邮箱（可不填）


返回数据格式

协议字段       |  数据类型 | 必要性 | 说明      
--------------|-----------|-------|----------
status        | Number    | 必要   | 0代表支付成功，否则失败


    req:
	{
		suggestion："asdasdasdasd",
		email:""
	}
    resp:
    {
        status:0,
    }

