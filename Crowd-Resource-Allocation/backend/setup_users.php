<?php

require_once "db.php";


// Default password for demo users

$defaultPassword = "member123";

$hashedPassword = password_hash(
    $defaultPassword,
    PASSWORD_DEFAULT
);


$sql = "
    INSERT INTO users
    (
        name,
        email,
        password,
        role
    )
    VALUES
    (
        ?,
        ?,
        ?,
        'member'
    )
";

$stmt = $conn->prepare($sql);


for ($i = 1; $i <= 100; $i++) {

    $name =
        "Community Member " . $i;

    $email =
        "member" . $i . "@example.com";


    // Check whether user already exists

    $checkSql = "
        SELECT id
        FROM users
        WHERE email = ?
    ";

    $checkStmt =
        $conn->prepare($checkSql);

    $checkStmt->bind_param(
        "s",
        $email
    );

    $checkStmt->execute();

    $result =
        $checkStmt->get_result();


    if ($result->num_rows > 0) {

        $checkStmt->close();

        continue;
    }


    $stmt->bind_param(
        "sss",
        $name,
        $email,
        $hashedPassword
    );

    $stmt->execute();

    $checkStmt->close();
}


$stmt->close();

$conn->close();


echo "100 community members created successfully.";

?>