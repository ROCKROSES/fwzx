<?php

/*
此PHP为录入信息接口
参数列表:
name   姓名
department  社团和部门
post   职务
reason  原因
file  上传的图片
path  图片保存路径
*/


/*

create table candidate(
    name varchar(20) primary key,
    department varchar(50) not null ,
    post varchar(20) not null,
    reason varchar(200) not null ,
    path varchar(50) not null,
    votes int )
    charset = utf8;



    建表代码

*/


/*
返回值说明

1  该名字已参选
2  插入数据库失败
3  图片保存失败
OK 上传成功
*/
header('content-type:text/html;charset=utf-8');//设置请求头




$name = $_POST['name'];
$department = $_POST['department'];
$post = $_POST['post'];
$reason = $_POST['reason'];
$file = $_FILES['file'];


function MoveFile($file,$name)
{
    $tmpName = $file['tmp_name']; //获取临时文件



    $uploadfile = '../photo'; //设置存储照片目录
    if(!file_exists($uploadfile)){
        mkdir($uploadfile, 0777, true);
                chmod($uploadfile, 0777);
            }

    

    $savename = $name . $file['name']; //设置存储名字

    $saveresult = move_uploaded_file($tmpName,$uploadfile.'/'.$savename);//移动文件

    if($saveresult == false)//判断图片是否保存成功
    {
        echo 3;
        exit(1);
    }

    return $uploadfile.'/'.$savename;
}


function InsertDB($file,$name,$department,$post,$reason)
{
    $path = MoveFile($file,$name);
    $db = mysqli_connect("localhost","root","root","fwzx");//连接数据库

    $result = mysqli_query($db,"SELECT name FROM candidate"); //查询表中已有姓名

    while($row=mysqli_fetch_row($result)) //mysqli_fetch_row 取出一行
    {
    foreach($row as $value)
    {
        if(strcmp($value,$name)==0) //strcmp函数比较字符串是否相同
        {
            echo 1;
            return;
        }
    }
    }


    $table = 'candidate';
    $insertresult = mysqli_query($db,"insert into $table(name,department,post,reason,path,votes)values('$name','$department','$post','$reason','$path',0) ");

    if($insertresult == true)
    {
        echo 'OK';
    }
    else
    {
        echo 2;
    }

}


InsertDB($file,$name,$department,$post,$reason);


?>