<?php

header("Content-Type: application/json");

require_once "db.php";


/*
    Ranking Formula

    Need          = 40%
    Urgency       = 30%
    Votes         = 20%
    Waiting Time  = 10%
*/


/* Get maximum vote count */

$voteMaxQuery = "
    SELECT MAX(vote_count) AS max_votes
    FROM (
        SELECT
            r.id,
            COUNT(v.id) AS vote_count
        FROM requests r
        LEFT JOIN votes v
            ON r.id = v.request_id
        WHERE r.status = 'Pending'
        GROUP BY r.id
    ) AS vote_data
";


$voteMaxResult = $conn->query($voteMaxQuery);


if (!$voteMaxResult) {

    echo json_encode([
        "success" => false,
        "message" => "Vote query failed: " . $conn->error
    ]);

    exit;
}


$voteMaxRow =
    $voteMaxResult->fetch_assoc();


$maxVotes =
    (int)($voteMaxRow["max_votes"] ?? 0);


/* Get requests */

$sql = "
    SELECT

        r.id,

        r.user_id,

        r.resource_id,

        res.name AS resource_name,

        r.description,

        r.need_score,

        r.urgency_score,

        r.status,

        r.created_at,

        COUNT(v.id) AS vote_count,

        TIMESTAMPDIFF(
            DAY,
            r.created_at,
            NOW()
        ) AS waiting_days

    FROM requests r

    INNER JOIN resources res
        ON r.resource_id = res.id

    LEFT JOIN votes v
        ON r.id = v.request_id

    WHERE r.status = 'Pending'

    GROUP BY
        r.id,
        r.user_id,
        r.resource_id,
        res.name,
        r.description,
        r.need_score,
        r.urgency_score,
        r.status,
        r.created_at

    ORDER BY r.created_at ASC
";


$result =
    $conn->query($sql);


if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => "SQL Error: " . $conn->error
    ]);

    exit;
}


$ranking = [];


while ($row = $result->fetch_assoc()) {

    $need =
        (float)$row["need_score"];


    $urgency =
        (float)$row["urgency_score"];


    $votes =
        (int)$row["vote_count"];


    $waitingDays =
        (int)$row["waiting_days"];


    /*
        Need score

        Already expected between 0 and 100.
    */

    $needScore =
        min(100, max(0, $need));


    /*
        Urgency score

        Already expected between 0 and 100.
    */

    $urgencyScore =
        min(100, max(0, $urgency));


    /*
        Community vote score

        Highest voted request = 100.
    */

    if ($maxVotes > 0) {

        $voteScore =
            ($votes / $maxVotes) * 100;

    } else {

        $voteScore = 0;

    }


    /*
        Waiting time

        Every waiting day contributes 10 points.
        Maximum = 100.
    */

    $waitingScore =
        min(100, $waitingDays * 10);


    /*
        Final weighted score
    */

    $finalScore =

        ($needScore * 0.40) +

        ($urgencyScore * 0.30) +

        ($voteScore * 0.20) +

        ($waitingScore * 0.10);


    $ranking[] = [

        "id" =>
            (int)$row["id"],

        "resource" =>
            $row["resource_name"],

        "description" =>
            $row["description"],

        "need_score" =>
            $needScore,

        "urgency_score" =>
            $urgencyScore,

        "vote_count" =>
            $votes,

        "vote_score" =>
            round($voteScore, 2),

        "waiting_days" =>
            $waitingDays,

        "waiting_score" =>
            $waitingScore,

        "final_score" =>
            round($finalScore, 2)

    ];

}


/* Sort by final score */

usort(
    $ranking,
    function ($a, $b) {

        return
            $b["final_score"]
            <=>
            $a["final_score"];

    }
);


/* Add rank */

$rank = 1;


foreach ($ranking as &$item) {

    $item["rank"] =
        $rank++;

}


echo json_encode([

    "success" => true,

    "ranking" => $ranking

]);


$conn->close();

?>