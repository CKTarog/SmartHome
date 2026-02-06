<?php
// =====================
// HEADERS (CORS + JSON)
// =====================
header("Access-Control-Allow-Origin: *"); // Allow all origins (so no cors errors)
header("Content-Type: application/json; charset=UTF-8"); // JSON response
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type"); // Allowed headers

// Preflight for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connect.php'; // provides $pdo

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // =====================
    // GET: Arduino fetches state
    // =====================
    case 'GET':

        $stmt = $pdo->prepare("
            SELECT 
                master,
                led1, led1_value,
                led2, led2_value,
                led3, led3_value,
                led4, led4_value,
                led5, led5_value,
                dcMotor, dcMotor_speed
            FROM device_state
            WHERE id = 1
            LIMIT 1
        ");
        $stmt->execute();
        $state = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($state ?: []);
        break;


    // =====================
    // POST: Frontend updates state
    // =====================
    case 'POST':

        $raw = file_get_contents("php://input"); // get raw POST data
        $data = json_decode($raw, true); // convert to php array

        if ($data === null) { // invalid JSON
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            break;
        }

        // ---------------------
        // Master switch (0 or 1)
        //if master value is 1, set to 1, else set to 0
        // ---------------------
        $master = ($data['master'] ?? 0) == 1 ? 1 : 0;

        // ---------------------
        // Sanitize LED booleans (0 or 1)
        //if led value is 1, set to 1, else set to 0
        // ---------------------
        $led1 = ($data['led1'] ?? 0) == 1 ? 1 : 0;
        $led2 = ($data['led2'] ?? 0) == 1 ? 1 : 0;
        $led3 = ($data['led3'] ?? 0) == 1 ? 1 : 0;
        $led4 = ($data['led4'] ?? 0) == 1 ? 1 : 0;
        $led5 = ($data['led5'] ?? 0) == 1 ? 1 : 0;

        // ---------------------
        // Sanitize LED brightness (0–4)
        // if brightness <0 set to 0, if >4 set to 4
        // ---------------------
        $led1_value = max(0, min(4, (int) ($data['led1_value'] ?? 0)));
        $led2_value = max(0, min(4, (int) ($data['led2_value'] ?? 0)));
        $led3_value = max(0, min(4, (int) ($data['led3_value'] ?? 0)));
        $led4_value = max(0, min(4, (int) ($data['led4_value'] ?? 0)));
        $led5_value = max(0, min(4, (int) ($data['led5_value'] ?? 0)));

        // ---------------------
        // Sanitize motor (0 or 1) and speed (0–3)
        // if motor value is 1, set to 1, else set to 0
        // ---------------------
        $dcMotor = ($data['dcMotor'] ?? 0) == 1 ? 1 : 0;
        $dcMotor_speed = max(0, min(3, (int) ($data['dcMotor_speed'] ?? 0)));

        // ---------------------
        // if master OFF, force all to OFF/0
        // ---------------------
        if ($master == 0) {
            $led1 = $led2 = $led3 = $led4 = $led5 = 0;
            $led1_value = $led2_value = $led3_value = $led4_value = $led5_value = 0;
            $dcMotor = 0;
            $dcMotor_speed = 0;
        } else {
            // If master is ON, but individual device is OFF, set its value to 0
            if ($led1 == 0)
                $led1_value = 0;
            if ($led2 == 0)
                $led2_value = 0;
            if ($led3 == 0)
                $led3_value = 0;
            if ($led4 == 0)
                $led4_value = 0;
            if ($led5 == 0)
                $led5_value = 0;
            if ($dcMotor == 0)
                $dcMotor_speed = 0;
        }

        // ---------------------
        // UPDATE DB row
        // ---------------------
        $stmt = $pdo->prepare("
            UPDATE device_state
            SET
                master = ?,
                led1 = ?, led1_value = ?,
                led2 = ?, led2_value = ?,
                led3 = ?, led3_value = ?,
                led4 = ?, led4_value = ?,
                led5 = ?, led5_value = ?,
                dcMotor = ?, dcMotor_speed = ?
            WHERE id = 1
        ");

        $stmt->execute([
            $master,
            $led1,
            $led1_value,
            $led2,
            $led2_value,
            $led3,
            $led3_value,
            $led4,
            $led4_value,
            $led5,
            $led5_value,
            $dcMotor,
            $dcMotor_speed
        ]);

        echo json_encode(["status" => "updated"]); //convert to json
        break;


    // =====================
    // METHOD NOT ALLOWED
    // =====================
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
