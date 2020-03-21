//插入前三名
function insertTopThree(data,num){
    var TopThreeBox = $("#TopThreeBox");
    var id = 'No-' + num;
    var Nox = $("<div>").attr('id',id).addClass("topThree-img-box col-sm");
    if(num == 2){
        TopThreeBox.prepend(Nox);
    }
    else{
        TopThreeBox.append(Nox);
    }

    var crown = $("<img>").attr({"class":"crown",'src':'../imgs/'+num+'st.png'});//皇冠图片路径
    var HeadImg = $("<img>").attr({'class':'head-img','src':'../'+data[4]});

    var TextBox = $("<div>");
    var p = $("<p>");
    var strong = $("<strong>").html(data[0]);
    var span = $("<p>").html('&nbsp;' + data[1] + data[2]);
    p.append(strong,span);
    var voteNum = $("<span>").attr('class','votes-num').html(data[5]);
    var em = $("<em>").html('票');
    TextBox.append(p,voteNum,em);
    Nox.append(crown,HeadImg,TextBox);
}

//创建一个卡片节点,并返回
function createCard(data){
    //卡片外框
    var card = $("<div>").addClass("card");
    //图片
    var img = $("<img>").attr({'class':'card-img-top','src':'../'+data[4],'alt':'图片加载失败...'});
    //卡片文本
    var CardBody = $("<div>").addClass("card-body");
    var h5 = $("<h5>").addClass("card-title").html(data[0]);
    var post = $("<p>").addClass("card-text").html(data[1] + ' ' + data[2]);
    var ReasonText = '<strong>参选原因:</strong>' + data[3];
    var reason = $("<p>").addClass("card-text").html(ReasonText);
    var button = $("<button>").addClass("btn btn-primary vote").html('投&nbsp;票');
    CardBody.append(h5,post,reason,button);
    //卡片底部文本
    var CardFooter = $("<div>").addClass('card-footer');
    var CardFooterText = "当前票数:&nbsp;<strong>" + data[5] + "</strong>票";
    var p = $("<p>").html(CardFooterText);
    CardFooter.append(p);

    card.append(img,CardBody,CardFooter);

    return card;
}

//在页面下方插入所有参选人信息卡片
//此函数只接收数组
function insertAllCandidate(data){
    //插入卡片
    var AllCardBox = $("#AllCardBox");
    var CardDeck = $("<div>").addClass("card-deck eachRow-card");
    AllCardBox.append(CardDeck);
    var i;
    for(i = 0;i < data.length;i++){
        if(i < 4){
            var card = createCard(data[i]);
            CardDeck.append(card);
            continue;
        }
        if(i % 4 == 0){
            var CardDeck = $("<div>").addClass("card-deck eachRow-card");
            AllCardBox.append(CardDeck);
        }
        var card = createCard(data[i]);
        CardDeck.append(card);
    }


    //投票功能
    var BtnList = $('.vote')
    for(i = 0;i < BtnList.length;i++){
        BtnList[i].onclick = function(){
            // alert("hahahhasdfasf");
            var name = this.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
            // console.log(name);
            // var post = this.previousElementSibling.previousElementSibling.innerHTML;
            var formdata = new FormData();
            formdata.append('name',name);
            $.ajax({
                url:'../php/Vote.php',
                type:'POST',
                data:formdata,
                cache: false,
                async: true,
                processData: false,
                contentType: false,
                success:function(res){
                    console.log(res);
                    if(res ==3){
                        alert("投票失败");
                    }
                    else if(res ==2){
                        alert("投票成功!");
                    }
                },
                error:function(res){
                    alert("投票出错");
                }
            });  
        }
    }
}


//输出参选人的信息,此处调用了insertAllCandidate(),insertTopThree()
function printInfo(candidates){
    //接收后端数组candidates[][]
    //一维,每个参选人,按票数降序排列
    //二维,0-姓名,1-社团部门,2-职务,3-原因,4-头像路径,5-票数

    //无人参选时，输出提示
    if(candidates.length == 0){
        var tip = $("<strong>").html('当前无人参选...');
        $("#TopThreeBox").css({'color':'red','font-size':'1.5rem'}).append(tip);
        return;
    }

    //在页面下方插入所有人的信息卡片
    insertAllCandidate(candidates);

    //插入前5名
    var i;
    for(i = 0;i < candidates.length;i++){
        if(i < 3){
            if(i == 1){
                // console.log(candidates[2])
                insertTopThree(candidates[i],i + 1);
            }
            else{
                insertTopThree(candidates[i],i + 1);
            }
        }
        else if(i>=3){
            // console.log(i,candidates[i])
            var voteRankList = $("#voteRankList");
            var RankItem = $("<div>").addClass("rank-item row");
            voteRankList.append(RankItem);

            var ColSm8 = $("<div>").addClass("col-sm-8");
            var strong = $("<strong>").html(candidates[i][0]);
            var span = $("<span>").html('&nbsp;' + candidates[i][1] + candidates[i][2]);
            ColSm8.append(strong,span);
            var ColSm4 = $("<div>").addClass("col-sm-4");
            var voteNum = $("<span>").addClass("votes-num").html(candidates[i][5]);
            var em = $("<em>").html('票');
            ColSm4.append(voteNum,em);

            RankItem.append(ColSm8,ColSm4);
        }
    } 
}

//载入页面时发送post请求,请求参选人信息
function outputCandidates(){
    //发送ajax请求
    $.ajax({
        url:'../php/Onload.php',
        type:'POST',
        success:function(res){
            // console.log(res)
            if(res == 1){
                alert("数据载入失败");
            }
            else{
                printInfo(JSON.parse(res));
            }
        },
        error:function(res){
            console.log(res);
            alert('数据获取失败');
        }
    });
}

//搜索函数
function Search(){
    var name = $("#searchName").val();
    if(name == ""){
        alert("请输入参选人的姓名");
        return;
    }
    var formdata = new FormData();
    formdata.append(name);
    $.ajax({
        url:'../php/Vote.php',
        type: 'GET',
        data: formdata,
        success:function(res){
            //if res == 1 => 查无此人
            //else 返回值必须为数组
            if(res){
                alert("查无此人，请输入正确的参选人姓名！");
            }
            else{
                $("#AllCardBox").empty();
                insertAllCandidate(res);
                $('#Return').attr("disabled",false);
            }
        },
        error:function(res){
            console.log(res);
            alert("Sorry!查询失败。");
        }
    });
}
$(document).ready(function(){
    
    //载入页面时，输出参选人信息
    outputCandidates();

    //搜索参选人功能
    $("#Search").click(function(e){
        Search();
    });

    //返回全部结果功能
    $('#Return').click(function(e){
        location.reload();
    });

    //动态改变TopContainer和mainBox的高度
    window.addEventListener('load', function() {
        //加载完页面之后
        // console.log(window.innerHeight);
        $("#TopContainer").height(window.innerHeight);
        var TopContainer = $("#TopContainer");
        var MainBox = $("#mainBox");
        if(TopContainer.outerHeight() <= MainBox.outerHeight()){
            var TopConHeight = MainBox.outerHeight() + 100;
            TopContainer.height(TopConHeight);
        }
        else{
            TopContainer.height(window.innerHeight);
        }
        //改变视窗大小时
        window.addEventListener('resize', function() {
            // console.log(window.innerHeight);
            $("#TopContainer").height(window.innerHeight);
            var TopContainer = $("#TopContainer");
            var MainBox = $("#mainBox");
            if(TopContainer.outerHeight() <= MainBox.outerHeight()){
                var TopConHeight = MainBox.outerHeight() + 100;
                TopContainer.height(TopConHeight);
            }
            else{
                TopContainer.height(window.innerHeight);
            }
        })
    })
});