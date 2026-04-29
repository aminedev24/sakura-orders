<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

/**
 * Standard .env loader
 */
function loadEnv($path) {
    if (!file_exists($path)) return;
    $content = file_get_contents($path);
    $lines = explode("\n", str_replace("\r", "", $content));
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) continue;
        $name = trim($parts[0]);
        $value = trim(trim($parts[1]), '"\' ');
        putenv("$name=$value");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}

loadEnv(__DIR__ . '/.env');

$http_host = $_SERVER['HTTP_HOST'] ?? '';
$is_local = in_array($http_host, ['localhost', '127.0.0.1', '192.168.1.100']) || strpos($http_host, 'localhost:') === 0;
$is_prod = (getenv('APP_ENV') === 'production' || !$is_local);

if ($is_prod) {
    $db_host_str = getenv('DB_HOST') ?: 'localhost';
    $db_user = getenv('DB_USER') ?: '';
    $db_pass = getenv('DB_PASS') ?: '';
    $db_name = getenv('DB_NAME') ?: '';
} else {
    $db_host_str = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'order_db';
}

$host_parts = explode(':', $db_host_str);
$db_host = $host_parts[0];
$db_port = isset($host_parts[1]) ? (int)$host_parts[1] : 3306;

try {
    mysqli_report(MYSQLI_REPORT_STRICT | MYSQLI_REPORT_ERROR);
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    file_put_contents(__DIR__ . '/debug.txt', date('[Y-m-d H:i:s] ') . "Connection Failed: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failed",
        "mysql_msg" => $e->getMessage()
    ]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'fetch') {
    $admins = [];
    $result = $conn->query("SELECT * FROM admins");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $row['id'] = (int)$row['id'];
            $row['orders'] = [];
            $row['returns'] = [];
            $admins[$row['id']] = $row;
        }
        if (!empty($admins)) {
            $adminIds = implode(',', array_keys($admins));

            // Fetch Orders
            $orderResult = $conn->query("SELECT * FROM orders WHERE admin_id IN ($adminIds) ORDER BY id DESC"); 
            while ($order = $orderResult->fetch_assoc()) {
                $order['id'] = (int)$order['id'];
                $order['admin_id'] = (int)$order['admin_id'];
                $order['my_profit'] = (float)$order['my_profit'];
                $order['admin_profit'] = (float)$order['admin_profit'];
                $order['marketer_profit'] = (float)$order['marketer_profit'];
                $admins[$order['admin_id']]['orders'][] = $order;
            }

            // Fetch Returns
            $returnResult = $conn->query("SELECT * FROM returns WHERE admin_id IN ($adminIds) ORDER BY id DESC");
            while ($ret = $returnResult->fetch_assoc()) {
                $ret['id'] = (int)$ret['id'];
                $ret['order_id'] = (int)$ret['order_id'];
                $ret['admin_id'] = (int)$ret['admin_id'];
                $ret['marketer_profit'] = (float)$ret['marketer_profit'];
                $ret['admin_profit'] = (float)$ret['admin_profit'];
                $ret['my_profit'] = (float)$ret['my_profit'];
                $admins[$ret['admin_id']]['returns'][] = $ret;
            }
        }
    }
    echo json_encode(array_values($admins));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add_return') {
    $data = json_decode(file_get_contents("php://input"), true);
    try {
        $stmt = $conn->prepare("INSERT INTO returns (order_id, admin_id, marketer_name, details, marketer_profit, admin_profit, my_profit) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iissddd",
            $data['orderId'],
            $data['adminId'],
            $data['marketerName'],
            $data['details'],
            $data['marketerProfit'],
            $data['adminProfit'],
            $data['myProfit']
        );

        if ($stmt->execute()) {
            $delStmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
            $delStmt->bind_param("i", $data['orderId']);
            $delStmt->execute();
            $delStmt->close();
            echo json_encode(["success" => true]);
        } else {
            throw new Exception("Execution failed");
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add_admin') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'] ?? '';
    if (!empty($name)) {
        try {
            $stmt = $conn->prepare("INSERT INTO admins (name) VALUES (?)");
            $stmt->bind_param("s", $name);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "id" => $conn->insert_id]);
            } else {
                throw new Exception("Execution failed");
            }
            $stmt->close();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Name is required"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_admin') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;
    $name = $data['name'] ?? '';
    if ($id > 0 && !empty($name)) {
        try {
            $stmt = $conn->prepare("UPDATE admins SET name = ? WHERE id = ?");
            $stmt->bind_param("si", $name, $id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Execution failed");
            }
            $stmt->close();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID and Name are required"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete_admin') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;
    if ($id > 0) {
        try {
            $stmt1 = $conn->prepare("DELETE FROM orders WHERE admin_id = ?");
            $stmt1->bind_param("i", $id);
            $stmt1->execute();
            $stmt1->close();

            $stmt2 = $conn->prepare("DELETE FROM admins WHERE id = ?");
            $stmt2->bind_param("i", $id);
            if ($stmt2->execute()) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Execution failed");
            }
            $stmt2->close();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID is required"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'add_order') {
    $data = json_decode(file_get_contents("php://input"), true);
    try {
        $stmt = $conn->prepare("INSERT INTO orders (admin_id, marketer_name, details, my_profit, admin_profit, marketer_profit) VALUES (?, ?, ?, ?, ?, ?)");
        $details = $data['details'] ?? '';
        $stmt->bind_param("issddd",
            $data['adminId'],
            $data['marketerName'],
            $details,
            $data['myProfit'],
            $data['adminProfit'],
            $data['marketerProfit']
        );
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            throw new Exception("Execution failed");
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_order') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;
    if ($id > 0) {
        try {
            $stmt = $conn->prepare("UPDATE orders SET admin_id = ?, marketer_name = ?, details = ?, my_profit = ?, admin_profit = ?, marketer_profit = ? WHERE id = ?");
            $stmt->bind_param("issdddi",
                $data['adminId'],
                $data['marketerName'],
                $data['details'],
                $data['myProfit'],
                $data['adminProfit'],
                $data['marketerProfit'],
                $id
            );
            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Execution failed");
            }
            $stmt->close();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID is required"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete_order') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;
    if ($id > 0) {
        try {
            $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Execution failed");
            }
            $stmt->close();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID is required"]);
    }
}

$conn->close();
?>
