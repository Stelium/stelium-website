<?php
#error_reporting(E_ALL);
#ini_set('display_errors', '1');
require_once 'recaptcha/src/autoload.php';

$recaptcha = new \ReCaptcha\ReCaptcha('6Ld721UcAAAAAAh_I9ME8cOysbfoZFMT8ZKXyaQP');

$resp = $recaptcha->setExpectedHostname($_SERVER['HTTP_HOST'])
                  ->verify($_POST['g-recaptcha-response'], $_SERVER['REMOTE_ADDR']);
if (!$resp->isSuccess()) {
    $errors = $resp->getErrorCodes();
	echo '{
	"status" : "error",
	"message" : "The message was not sent. Please check the data and try again"
}';
	exit;
}

require 'mailer/Exception.php';
require 'mailer/PHPMailer.php';
require 'mailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer();

try {
    //Server settings
    $mail->SMTPDebug = false;//SMTP::DEBUG_SERVER;                      //Enable verbose debug output
	$mail->CharSet  = "UTF-8";
	$mail->Encoding = 'base64';
	$mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'mail.synergize.digital';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'stelium@synergize.digital';                     //SMTP username
    $mail->Password   = 'w1+]7cFC;a0D';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('stelium@' . $_SERVER['HTTP_HOST'], 'Stelium');
    $mail->addAddress('andrew@pantherprotocol.io');     //Add a recipient
    $mail->addAddress('hello.egour@gmail.com');     //Add a recipient
 
    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Message from Stelium web site';
    $mail->Body    = implode('<br>', [
		'Name: ' . ($_POST['name'] ?? ''),
		'Email: ' . ($_POST['email'] ?? ''),
		'Phone: ' . ($_POST['phone'] ?? ''),
		'Subject: ' . ($_POST['subject'] ?? ''),
		'Message: ' . ($_POST['message'] ?? '')
	]);

    $mail->send();
	
	echo '{
	"status" : "success",
	"message" : "Message sent"
}';
} 
catch (Exception $e) {
    echo '{
	"status" : "error",
	"message" : "The message was not sent. Please check the data and try again"
}';
}
