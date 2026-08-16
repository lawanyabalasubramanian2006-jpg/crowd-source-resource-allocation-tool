<?php

header("Content-Type: application/json");

require_once "db.php";

/* Stop PHP errors from being displayed as HTML */
ini_set('display_errors', 0);
error_reporting(0);

try {

    /* Get data sent from voting.html */
    $user_id = isset($_POST['user_id'])
        ? intval($_POST['user_id'])
        : 0;

    $request_id = isset($_POST['request_id'])
        ? intval($_POST['request_id'])
        : 0;


    /* Validate input */
    if ($user_id <= 0 || $request_id <= 0) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid Member ID or Request ID."
        ]);

        exit;
    }


    /* Check whether member exists */
    $stmt = $conn->prepare(
        "SELECT id FROM users WHERE id = ?"
    );

    $stmt->bind_param("i", $user_id);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Member ID does not exist."
        ]);

        exit;
    }


    /* Check whether request exists */
    $stmt = $conn->prepare(
        "SELECT id FROM requests WHERE id = ?"
    );

    $stmt->bind_param("i", $request_id);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Request does not exist."
        ]);

        exit;
    }


    /*
       IMPORTANT:
       One member can vote only ONCE in the entire system.
    */

    $stmt = $conn->prepare(
        "SELECT id FROM votes WHERE user_id = ?"
    );

    $stmt->bind_param("i", $user_id);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        echo json_encode([
            "success" => false,
            "message" => "This member has already voted. Each member can vote only once."
        ]);

        exit;
    }


    /* Insert vote */
    $stmt = $conn->prepare(
        "INSERT INTO votes (user_id, request_id)
         VALUES (?, ?)"
    );

    $stmt->bind_param(
        "ii",
        $user_id,
        $request_id
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Vote submitted successfully."
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Unable to save vote."
        ]);
    }


    $stmt->close();
    $conn->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error occurred."
    ]);

}

?>