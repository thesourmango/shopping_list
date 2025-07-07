<?php
// Database connection settings
include "../init.php";

if (isset($_POST)) {
    $dataJSON = file_get_contents('php://input');
    // Decode sent JSON post-data 
    $data = json_decode(file_get_contents('php://input'), true);
    // print_r($data); // debug
    // Remove all previous versions of the list
    //$db->exec("DELETE FROM shopping_list");
    $conn->exec("DELETE FROM shopping_list WHERE id NOT IN (SELECT id FROM (SELECT id FROM shopping_list ORDER BY id DESC LIMIT 10) foo);");
    // Insert new item
    $stmt = $conn->prepare("INSERT INTO shopping_list (items) VALUES (:items)");
    $stmt->execute(array(':items' => $dataJSON));
    echo json_encode(['database update' => 'successful']);
} else {
    echo json_encode(['database update' => "unsuccessful"]);
}
exit;
