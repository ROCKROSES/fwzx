<?php


/*
1 数据载入失败
*/



/*

一个二维数组
每个人的信息是一个数组
[0]是票数最高的人
[0][0] = name
[0][1] = 部门
[0][2] = 职务
[0][3] = 参选原因
[0][4] = 图片路径
[0][5] = 票数
*/
$db = mysqli_connect("localhost","root","root","fwzx");//连接数据库

$result = mysqli_query($db,"SELECT * FROM candidate order by votes DESC");

$array = [];
if($result==false)
{
    echo 1;
}
while($row=mysqli_fetch_row($result))
{
    array_push($array,$row);
}
var_dump($array);
$ret = json_encode($array,JSON_UNESCAPED_UNICODE);
echo $ret;


?>