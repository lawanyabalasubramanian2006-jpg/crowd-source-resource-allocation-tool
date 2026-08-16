<?php
require_once "db.php";

$email = "member1@example.com";
$password = "member123";

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
$stmt->bind_param("ss", $hash, $email);

if ($stmt->execute()) {
    echo "Password reset successfully.<br>";
    echo "Email: member1@example.com<br>";
    echo "Password: member123";
} else {
    echo "Error: " . $conn->error;
}
?>