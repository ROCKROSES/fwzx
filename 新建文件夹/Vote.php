<?php

/*
2  投票成功
3  投票失败
*/
$name = $_GET['name'];
$department = $_GET['department'];
$db = mysqli_connect("localhost","root","root","Experiment");//连接数据库

$result = mysqli_query($db,"update candidate set votes = votes+1 where name = ".$name ."and department = " .$department);

if($result == true)
{
    echo 2;
}
else{
    echo 3;
}
?>