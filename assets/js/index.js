var url = "http://27.115.58.82:12429/immi/page/" //全局请求域名

var headerData = {
    //头部页面数据
    address: {
        title: "",
        type: null
    },
    background: {
        title: "",
        type: null
    },
    endDate: {
        title: "",
        type: null
    },
    engTitle: {
        title: "",
        type: null
    },
    logo: {
        title: "",
        type: null
    },
    startDate: {
        title: "",
        type: null
    },
    gripInfo: {
        title: [],
        type: null
    },
    title: {
        title: "",
        type: null
    },
    url: {
        title: "",
        type: null
    },
    littleTitle: {
        title: "",
        type: null
    }
}
//获取当前微页面的数据
$.ajax({
    type: "get",
    url: url + "searchMicroPageFieldByOrderId?id=15", //请求链接格式：页面文件/请求的操作(页面的带有WebMethod前缀的静态函数)
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    // data: JSON.stringify //传递的参数使用JSON.stringify转译为JSON格式
    // ({
    //     "in_Id": $("#hdfId").val(), //传递给后台的参数格式："参数名":值。参数名与参数个数一定要与后台函数的参数名及参数个数完全一致
    // }),
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    cacheControl: "no-cache",
    'X-Requested-With': "XMLHttpRequest",
    dataType: "json",
    success: function (res) {
        if (res.code == 666) {
            let data = [];

            for (var i in res.data) {
                data[res.data[i].fieldName] = {
                    title: res.data[i].fieldValue,
                    type: res.data[i].type
                }
            }
            for (let key in data) {
                headerData[key] = data[key];
            }
            if (headerData.gripInfo && headerData.gripInfo.title) {
                headerData.gripInfo.title = headerData.gripInfo.title.split(
                    ";"
                );
            }
            $('.backgroundImage').attr('src', headerData.background.title)
            $('.sy-logo').attr('src', headerData.logo.title)
            $('.sy-estitle').html(headerData.engTitle.title)
            $('.sy-zntitle').html(headerData.title.title)
            $('.sy-titleeg').html(headerData.littleTitle.title)
            $('.sy-start_time').html(headerData.startDate.title)
            $('.sy-end_time').html(headerData.endDate.title)
            $('.sy-url').html(headerData.url.title)
            $('.sy-content').html(headerData.address.title)
            var str = ''
            $.each(headerData.gripInfo.title, function (key, value) {
                str += "<img src='" + value + "'>"
            })
            $('.sy-fieldservie').html(str)
        }
    },
    error: function (err)

    {

    }
});

var formData = [] //定义全局文本数据源
//获取文本
$.ajax({
    type: "get",
    url: url + 'getTemplate',
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    cacheControl: "no-cache",
    'X-Requested-With': "XMLHttpRequest",
    dataType: "json",
    success: function (res) {
        formData = res.data.map(item => {
            return {
                fOrderId: 1,
                fieldId: item.id,
                type: item.type,
                fieldValue: "",
                optionValue: item.defaultValue ? [{
                        values: item.defaultValue.split(";")
                    },
                    {
                        name: item.name
                    }
                ] : "",
                name: item.name
            };
        });
        var substr = ''
        //根据不用的类型追加对应的数据
        $.each(formData, function (key, value) {
            if (value.type == 1) {
                substr += '<div class="sy-form-items"><div class="sy-form_label">' +
                    value.name + '</div><input class = "sy-form_input" disabled  onclick="handleSelect(' + key + ',' + value.type + ')" type = "text" value="' + value.fieldValue + '"><div class = "sy-form_right"><i class="icon icon-caretdown" onclick="handleSelect(' + key + ',' + value.type + ')"></i></div></div>'
            } else if (value.type == 2) {
                substr += '<div class="sy-form-items"><div class="sy-form_label">' +
                    value.name + '</div><input class = "sy-form_input" disabled onclick="handleSelect(' + key + ',' + value.type + ')" type = "text"  value="' + value.fieldValue + '"><div class = "sy-form_right"><i class="icon icon-caretdown" onclick="handleSelect(' + key + ',' + value.type + ')"></i></div></div>'
            } else if (value.type == 3) {
                substr += '<div class="sy-form-items"><div class="sy-form_label">' +
                    value.name + '</div><input class = "sy-form_input" type = "text"  value="' + value.fieldValue + '"></div>'
            } else if (value.type == 4) {
                substr += '<div class="sy-form-items"><div class="sy-form_label">' +
                    value.name + '</div><input class = "sy-form_input" type = "number"  value="' + value.fieldValue + '"></div>'
            } else if (value.type == 5) {
                substr += '<div class="sy-form-items"><div class="sy-form_label">' +
                    value.name + '</div><input id="demo1" readonly type="text"  vale="' + value.fieldValue + '"><div class = "sy-form_right"><i class="icon icon-caretdown"></i></div></div>'
            }
        })
        $('.sy-form-item').html(substr)
        var calendar = new LCalendar();
        calendar.init({
            'trigger': '#demo1', //标签id
            'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
            'minDate': '1970-01-01', //最小日期
            'maxDate': '2099-12-31' //最大日期
        });
    },
    error: function () {

    }
})

var selectIndex = null //当前选择的索引
var selectType = null //当前选择的类型
var selectData = '' //单选的数据
var selectDatas = [] //多选的数据

//打开选项框
function handleSelect(index, type) {
    $('body').css('overflow', 'hidden')
    $('.sy-select').css('display', 'block')
    $(".sy-cavans").animate({
        height: "40%"
    }, 200);
    let str = ''
    $.each(formData[index].optionValue[0].values, function (key, value) {
        str += '<li onclick="handleChoice(' + key + ')">' + value + '</li>'
    })
    $('.sy-option').html(str)
    selectIndex = index
    selectType = type
    //根据类型判断，如果有数据就默认选择选项，如果没有数据就为空
    if (type == 1) {
        if (!formData[index].fieldValue) return
        $("li").eq(formData[index].optionValue[0].values.indexOf(formData[index].fieldValue)).addClass('is-selected')
    } else if (type == 2) {
        if (!formData[index].fieldValue || formData[index].fieldValue.length == 0) return
        if (typeof formData[index].fieldValue == 'string') {
            formData[index].fieldValue = formData[index].fieldValue.split(',')
        }
        selectDatas = formData[index].fieldValue
        $.each(formData[index].optionValue[0].values, function (key, value) {
            $.each(formData[index].fieldValue, function (index, item) {
                if (value === item) {
                    $("li").eq(key).addClass('is-selected')
                }
            })
        })
    }

}


//选择选项
function handleChoice(index) {
    if (selectType == 1) {
        $.each(formData[selectIndex].optionValue[0].values, function (key, value) {
            $("li").eq(key).removeClass('is-selected')
        })
        $("li").eq(index).addClass('is-selected')
        selectData = formData[selectIndex].optionValue[0].values[index]
    } else if (selectType == 2) {
        if (selectDatas.indexOf(formData[selectIndex].optionValue[0].values[index]) === -1) {
            $("li").eq(index).addClass('is-selected')
            selectDatas.push(formData[selectIndex].optionValue[0].values[index])
        } else {
            $("li").eq(index).removeClass('is-selected')
            selectDatas.splice(selectDatas.indexOf(formData[selectIndex].optionValue[0].values[index]), 1)
        }
    }
}


//关闭选择框清楚相应的数据
function clearData() {
    selectData = ''
    selectDatas = []
}

//取消选择
function handleCancel() {
    $('body').css('overflow', 'scroll')
    $(".sy-cavans").animate({
        height: "0"
    }, 150);
    setTimeout(function () {
        $('.sy-select').css('display', 'none')
    }, 150)
    clearData()
}

//确认选择
function handleQue() {
    if (selectType == 1) {
        $('input').eq(selectIndex).val(selectData)
        formData[selectIndex].fieldValue = selectData
    } else {
        $('input').eq(selectIndex).val(selectDatas)
        formData[selectIndex].fieldValue = selectDatas
    }
    clearData()
    handleCancel()
}


function ToastCheck() {
    $('.sy-toast').css('display', 'block')
    $('.sy-toast').css('top', '5%')
    setTimeout(function () {
        $('.sy-toast').css('top', '0')
        $('.sy-toast').css('display', 'none')
    }, 1500)
}

function Toast(type, name, value) {
    if (!value) {
        if (type == 1 || type == 2 || type == 5) {
            $('.sy-toast').html('请选择' + name)
            ToastCheck()
        } else if (type == 3 || type == 4) {
            $('.sy-toast').html('请填写' + name)
            ToastCheck()
        }
    } else {
        $('.sy-toast').html(value)
        ToastCheck()
    }
}


//提交表单数据
function handleConfirm() {
    var bool = true
    var phoenPatter = /^1[3-9]\d{9]$/
    $.each(formData, function (key, value) {
        value.fieldValue = $('input').eq(key).val()
        if (!value.fieldValue) {
            Toast(value.type, value.name, null)
            bool = false
            return false
        } else if (value.type == 4 && phoenPatter.test(value.fieldValue)) {
            Toast(value.type, value.name, '手机号码格式不正确')
            bool = false
            return false
        }
        if (value.type == 2) {
            value.fieldValue.split(',')
        }
    })
    if (!bool) return
    let form = formData.map(item => {
        return {
            fOrderId: item.fOrderId,
            fieldId: item.fieldId,
            fieldValue: item.fieldValue
        };
    });
    $.ajax({
        type: "post",
        url: url + "submitConferenceInfo", //请求链接格式：页面文件/请求的操作(页面的带有WebMethod前缀的静态函数)
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {
            data: JSON.stringify(form)
        }, //传递给后台的参数格式："参数名":值。参数名与参数个数一定要与后台函数的参数名及参数个数完全一致
        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        cacheControl: "no-cache",
        'X-Requested-With': "XMLHttpRequest",
        dataType: "json",
        success: function (res) {
            if (res.code == 666) {
                $('.sy-toast').html('报名成功')
                ToastCheck()
            }
        },
        error: function () {}
    })
}

var qrcode = new QRCode(document.getElementById("canvas"), {
    width: 60,
    height: 60
});

function Qrcode() {
    var domain = window.location.href;
    qrcode.makeCode('https://www.qq.com');
}


//分享
function handleShare() {
    $('.sy-shareImg').css('display', 'block')
    $('body').css('overflow', 'hidden')
    $('.backgroundImage').attr('src', headerData.background.title)
    $('.sy-slogo').attr('src', headerData.logo.title)
    let str = ''
    str = '<div class="sy-estitle">' + headerData.engTitle.title + '</div><div>' + headerData.title.title + '</div>'
    $('.sy-stitle').html(str)
    Qrcode()
    $('.sy-stitleeg').html(headerData.littleTitle.title)
    $('.sy-sstart_time').html(headerData.startDate.title)
    $('.sy-send_time').html(headerData.endDate.title)
    $('.sy-scontent').html(headerData.address.title)
    $('.sy-surl').html(headerData.url.title)
    shareImg()
}

function handleCancelShare() {
    $('.sy-shareCanvas').css('display', 'none')
    $('body').css('overflow', 'scroll')
}


function shareImg() {
    var element = document.querySelector('.sy-headershareImg');
    //要显示图片的img标签
    var image = document.querySelector('#img');
    // var width = $('.img')[0].clientWidth
    // var height = $('.img')[0].clientHeight
    //调用html2image方法
    var width = 300;
    var height = 540;
    var scale = 2;
    html2image(element, image);

    function html2image(source, image) {
        html2canvas(source, {
            allowTaint: true,
            width: width,
            height: height,
            scale: scale,
            useCORS: true
        }).then(function (canvas) {
            var imageData = canvas.toDataURL(1);
            image.src = imageData;
            $('#img').attr('src', imageData)
        });
    }
    $('.sy-shareImg').css('display', 'none')
    $('.sy-shareCanvas').css('display', 'block')
}