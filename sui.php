<?php

class Dbhelper {
    public static function conn() {
        $conn   = mysqli_connect('localhost', 'user', 'pass', 'dbname');
        $conn || Response::json(0, 'db connect err!');
        return $conn;
    }
}

class Response { 
    public static function json($code, $message='', $data=[]) { 
        echo json_encode([
            'code'      => $code, 
            'message'   => $message, 
            'data'      => $data
        ], JSON_UNESCAPED_UNICODE); 
        exit; 
    }
}

header('application/json;charset=utf-8');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST,GET,PUT,OPTIONS,DELETE');

$json = file_get_contents('php://input');
$json || Response::json(0, 'empty data!!!');

$json   = json_decode($json, True);
$conn   = Dbhelper::conn();

$sql    = 'INSERT IGNORE INTO amount (`amountCategory`, `amountAcount`, `amount`, `amountDate`, `amountAddTime`) VALUES ';
foreach ($json as $item) {
    $addtime    = round($item['addtime'] / 1000);
    $sql .= '(\'' . implode('\',\'', [
        $item['category'],
        $item['acount'],
        $item['amount'],
        date('Y-m-d', $addtime),
        $addtime
    ]) . '\'),';
}
$result = mysqli_query($conn, rtrim($sql, ','));
Response::json($result);
