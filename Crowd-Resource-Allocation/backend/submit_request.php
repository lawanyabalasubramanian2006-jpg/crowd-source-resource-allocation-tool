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


$userId =
    (int)$_SESSION["user_id"];


$resourceId =
    (int)($_POST["resource_id"] ?? 0);


$description =
    trim($_POST["description"] ?? "");


$need =
    $_POST["need"] ?? "";


$urgency =
    $_POST["urgency"] ?? "";


$scoreMap = [

    "Low" => 30,

    "Medium" => 60,

    "High" => 100

];


if (
    $resourceId <= 0 ||
    $description === "" ||
    !isset($scoreMap[$need]) ||
    !isset($scoreMap[$urgency])
) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid request data."
    ]);

    exit;
}


$needScore =
    $scoreMap[$need];


$urgencyScore =
    $scoreMap[$urgency];


$sql = "
    INSERT INTO requests
    (
        user_id,
        resource_id,
        description,
        need_score,
        urgency_score
    )
    VALUES
    (
        ?,
        ?,
        ?,
        ?,
        ?
    )
";


$stmt =
    $conn->prepare($sql);


$stmt->bind_param(
    "iisii",
    $userId,
    $resourceId,
    $description,
    $needScore,
    $urgencyScore
);


if ($stmt->execute()) {

    echo json_encode([

        "success" => true,

        "message" =>
            "Request submitted successfully.",

        "request_id" =>
            $stmt->insert_id

    ]);

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to submit request."

    ]);

}


$stmt->close();

$conn->close();

?>