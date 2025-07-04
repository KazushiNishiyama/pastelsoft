<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "あなたのメールアドレス";
    $subject = "お問い合わせが届きました";
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);
    $body = "お名前: $name\nメール: $email\nメッセージ:\n$message";

    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "送信が完了しました。";
    } else {
        echo "送信に失敗しました。";
    }
}
?>
