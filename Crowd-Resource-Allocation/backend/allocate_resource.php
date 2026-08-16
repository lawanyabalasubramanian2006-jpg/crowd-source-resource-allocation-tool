<?php

session_start();

header("Content-Type: application/json");

require_once "db.php";


if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);

    exit;
}


$requestId =
    (int)($_POST["request_id"] ?? 0);


if ($requestId <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid request ID."
    ]);

    exit;
}


$conn->begin_transaction();


try {


    // Get request

    $sql = "
        SELECT
            id,
            resource_id,
            status
        FROM requests
        WHERE id = ?
        FOR UPDATE
    ";


    $stmt =
        $conn->prepare($sql);


    $stmt->bind_param(
        "i",
        $requestId
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Request not found."
        );
    }


    $request =
        $result->fetch_assoc();


    if ($request["status"] !== "Pending") {

        throw new Exception(
            "This request has already been processed."
        );
    }


    $resourceId =
        (int)$request["resource_id"];


    // Get resource

    $sql = "
        SELECT
            id,
            name,
            available_quantity
        FROM resources
        WHERE id = ?
        FOR UPDATE
    ";


    $stmt =
        $conn->prepare($sql);


    $stmt->bind_param(
        "i",
        $resourceId
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    if ($result->num_rows === 0) {

        throw new Exception(
            "Resource not found."
        );
    }


    $resource =
        $result->fetch_assoc();


    $available =
        (int)$resource["available_quantity"];


    if ($available <= 0) {

        throw new Exception(
            "Resource is currently unavailable."
        );
    }


    // Reduce resource

    $newQuantity =
        $available - 1;


    $sql = "
        UPDATE resources

        SET available_quantity = ?

        WHERE id = ?
    ";


    $stmt =
        $conn->prepare($sql);


    $stmt->bind_param(
        "ii",
        $newQuantity,
        $resourceId
    );


    $stmt->execute();


    // Update request

    $sql = "
        UPDATE requests

        SET status = 'Allocated'

        WHERE id = ?
    ";


    $stmt =
        $conn->prepare($sql);


    $stmt->bind_param(
        "i",
        $requestId
    );


    $stmt->execute();


    $conn->commit();


    echo json_encode([

        "success" => true,

        "message" =>
            "Resource allocated successfully.",

        "resource" =>
            $resource["name"],

        "remaining_quantity" =>
            $newQuantity

    ]);


} catch (Exception $e) {


    $conn->rollback();


    echo json_encode([

        "success" => false,

        "message" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>