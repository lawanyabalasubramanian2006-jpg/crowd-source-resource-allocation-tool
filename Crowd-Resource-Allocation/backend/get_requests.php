<?php

header("Content-Type: application/json");

require_once "db.php";

ini_set('display_errors', 0);
error_reporting(0);

try {

    $sql = "
        SELECT
            r.id,
            res.name AS resource,
            r.description,

            CASE
                WHEN r.need_score >= 80 THEN 'High'
                WHEN r.need_score >= 50 THEN 'Medium'
                ELSE 'Low'
            END AS need,

            CASE
                WHEN r.urgency_score >= 80 THEN 'High'
                WHEN r.urgency_score >= 50 THEN 'Medium'
                ELSE 'Low'
            END AS urgency,

            (
                SELECT COUNT(*)
                FROM votes v
                WHERE v.request_id = r.id
            ) AS vote_count

        FROM requests r

        INNER JOIN resources res
            ON r.resource_id = res.id

        WHERE r.status = 'Pending'

        ORDER BY r.id ASC
    ";


    $result = $conn->query($sql);


    if (!$result) {

        echo json_encode([
            "success" => false,
            "message" => "Unable to load requests."
        ]);

        exit;
    }


    $requests = [];


    while ($row = $result->fetch_assoc()) {

        $requests[] = $row;

    }


    echo json_encode([
        "success" => true,
        "requests" => $requests
    ]);


    $conn->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error."
    ]);

}

?>