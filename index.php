<?php
// Database connection settings and list of allowed users
include "../init.php";
if (!$loginSuccessful) {
    header("Refresh:0; url=../login");
    die();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping list</title>
    <link rel="stylesheet" href="./style.css" />
    <script src="drag-drop-touch.esm.min.js?autoload" type="module"></script>
    <script src="./script.js" defer></script>
    <link rel="apple-touch-icon" sizes="180x180" href="./favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./favicon/favicon-16x16.png">
    <!-- <link rel="manifest" href="./favicon/site.webmanifest"> -->
</head>

<body>
    <?php 
    // Init empty php array
    $item_list = array();

    // Fech shopping list from DB
    try { 
        $stmt = $conn->query("SELECT items FROM shopping_list ORDER BY id DESC LIMIT 1");
        $items = $stmt->fetch(PDO::FETCH_ASSOC);
        //print($items['items']); // Debug, result from db should be JSON already
        ?>
        <!-- Store fetched items from DB in localStorage, script rendering shopping list runs after this -->
        <script>localStorage.setItem('item_list', JSON.stringify(<?=$items['items']?>))</script>
        <?php
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    
    ?>
    <div id="container">
        <section ondragover="event.preventDefault()" ondrop="drop(event)">
            <input type="text" id="new_item" placeholder="Add item">
        </section>
    </div>
</body>
</html>