<?php
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'order_db';

try {
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    echo "Updating returns table schema...\n";
    
    // Check if columns exist and add/rename them
    $conn->query("ALTER TABLE returns CHANGE COLUMN marketer_deduction marketer_profit DECIMAL(10,2) DEFAULT 0.00");
    $conn->query("ALTER TABLE returns CHANGE COLUMN admin_loss admin_profit DECIMAL(10,2) DEFAULT 0.00");
    $conn->query("ALTER TABLE returns CHANGE COLUMN my_loss my_profit DECIMAL(10,2) DEFAULT 0.00");
    
    echo "Done.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
