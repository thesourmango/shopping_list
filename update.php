<?php
// Database connection settings
include "secrets.php";
// Connect to the MySQL database
try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

if (isset($_POST)) {
    $dataJSON = file_get_contents('php://input');
    // Decode sent JSON post-data 
    $data = json_decode(file_get_contents('php://input'), true);
    // print_r($data); // debug
    // Remove all previous versions of the list
    //$db->exec("DELETE FROM shopping_list");
    $db->exec("DELETE FROM shopping_list WHERE id NOT IN (SELECT id FROM (SELECT id FROM shopping_list ORDER BY id DESC LIMIT 10) foo);");
    // Insert new item
    $stmt = $db->prepare("INSERT INTO shopping_list (items) VALUES (:items)");
    $stmt->execute(array(':items' => $dataJSON));
    echo json_encode(['database update' => 'successful']);
} else {
    echo json_encode(['database update' => "unsuccessful"]);
}
exit;


/* Improvement suggestion for potentially less database pushes 
// create the ?,? sequence for a single row
$values = str_repeat('?,', count($data[0]) - 1) . '?';
// construct the entire query
$sql = "INSERT INTO shopping_list (item, number, checked) VALUES " . str_repeat("($values),", count($data) - 1) . "($values)";    
$stmt = $db->prepare($sql);
$stmt->execute(array_merge(...$data));
/*
INSERT INTO `shopping_list` (`id`, `item`, `number`, `checked`) VALUES (NULL, 'Ikkunasprujt', '12', '1'), (NULL, 'Potatis', '13', '0') 
*/