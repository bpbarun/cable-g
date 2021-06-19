<?php
    require 'PHPMailerAutoload.php';

    try {
        if (!file_exists("config.json")) {
            error_log("config file not exist!!!" . $config->{'config'});
            exit;
        }
        $config = json_decode(file_get_contents("config.json"));
        if (!file_exists($config->{'smtp-config-file'})) {
            error_log("Given SMTP config file not exist!!!" . $config->{'smtp-config-file'});
            echo '<script>alert("Given SMTP config file not exist!!!");</script>';
            exit;
        }
        $smtpconfig = json_decode(file_get_contents($config->{'smtp-config-file'}));

        $mail = new PHPMailer;

        $mail->isSMTP();

        $mail->Host = $smtpconfig->smtp->host;
        $mail->Port = $smtpconfig->smtp->port;

        $mail->SMTPSecure =  $smtpconfig->smtp->smtpsecure;
        $mail->SMTPAuth = $smtpconfig->smtp->smtpauth;

        $mail->Username = $smtpconfig->smtp->username;
        $mail->Password = $smtpconfig->smtp->password;

    }
    catch(Exception $e) {
        error_log("ERROR before sending mail!!!" . $e->getMessage());
        echo '<script>alert("' . $e->getMessage() . '");</script>';
        echo 'Message: ' . $e->getMessage();
        exit;
    }

    if (isset($smtpconfig->smtp->fromname)) {
        $mail->setFrom((isset($smtpconfig->smtp->fromemail)) ? $smtpconfig->smtp->fromemail : $smtpconfig->smtp->username, $smtpconfig->smtp->fromname);
    }
    elseif (isset($smtpconfig->smtp->fromemail)) {
        $mail->setFrom( $smtpconfig->smtp->fromemail );
    }

    $email = (!empty($_REQUEST['email_id']))?$_REQUEST['email_id']:'';

    $CC_email = (!empty($_REQUEST['cc_mail_id']))?$_REQUEST['cc_mail_id']:'';

    $subject = (!empty($_REQUEST['subject']))?$_REQUEST['subject']:'Forgot Password';

    $message = (!empty($_REQUEST['message']))?$_REQUEST['message']:'Message';

    $mail->Subject = $subject;

    $mail->msgHTML($message);

    if ($email != '') {
        foreach (explode(',',$email) as $iemail) {
            $mail->addAddress($iemail);
        }
        if ($CC_email != '') {
            foreach (explode(',',$CC_email) as $iCC_email) {
                $mail->AddCC($iCC_email);
            }
        }
    }
    else {
        if ($CC_email != '') {
            foreach (explode(',',$CC_email) as $iCC_email) {
                $mail->addAddress($iCC_email);
            }
        }
        else {
            $mail->addAddress('barun@displayfort.com');
        }
    }


    if (!$mail->send()) {
        $error = "Mailer Error: " . $mail->ErrorInfo;
        error_log('Mail status failer'.$error);
        echo '<script>alert("' . $error . '");</script>';
    }
    else {
        error_log('Mail status success');
        echo '<script>alert("Message sent!");</script>';
    }

?>
