//ajax函数
function FuncAjax() {
    var name = $('#name').val();
    var department = $('#department').val();
    var post = $('#post').val();
    var reason = $('#reason').val();
    var file = $("#uploadHeadBtn")[0].files[0];
    //判断是否有信息未填写
    if(name != "" && department != "" && post != "" && reason != "" && file != null){
        var formdata = new FormData();
        formdata.append('name', name);
        formdata.append('department', department);
        formdata.append('post', post);
        formdata.append('reason', reason);
        formdata.append('file',file);
        $.ajax({
            url: '../php/InfoCollect.php',
            cache: false,
            type: 'POST',
            async: true,
            data: formdata,
            processData: false,
            contentType: false,
            success: function(res) {
                console.log(res);
                if (res == 'OK') {
                    alert('上传成功:)');
                    console.log('上传成功');
                }
                else if(res == 1){
                    alert('该名字已参选');
                }
                else if(res == 2){
                    alert('插入数据库失败');
                }
                else{
                    alert('图片保存失败');
                }
            },
            error: function(param) {
                console.log(param);
                alert(param);
            }
        });
    }
    else{
        alert("请将信息填写完整！！！");
    }
}

//监听头像上传按钮属性值变化
function onChangeUploadHeadBtn(){
    $("#uploadTip").remove();
    var file = $("#uploadHeadBtn")[0].files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
        $("#HeadImg").attr('src',this.result);
        this.abort();
    }
    
}

$(document).ready(function() {
    //点击上传头像
    $("#HeadImgBox").click(function(e){
        $("#uploadHeadBtn").click();
        
    });
    // 提交按钮点击事件
    $('#submit').click(function(e) {
        e.preventDefault();
        //调用ajax函数
        FuncAjax();
    });
    //返回按钮
    $('#returnButton').click(function(e){
        // window.location.href = "../html/InfoCollect.html";
        $(location).attr('href', 'Vote.html');
    });
    //隐藏文件上传按钮
    $('#uploadHeadBtn').hide();
    
});