<!doctype html>
<!--[if lte IE 9]> <html class="lte-ie9" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en"> <!--<![endif]-->
<?php
$data=file_get_contents('../login/config.json');
$json= json_decode($data);
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Remove Tap Highlight on Windows Phone IE -->
    <meta name="msapplication-tap-highlight" content="no"/>

    <link rel="icon" type="image/png" href="/assets/img/favicon-16x16.png" sizes="16">
    <link rel="icon" type="image/png" href="/assets/img/favicon-32x32.png" sizes="32x32">

    <title>Renaissance</title>

    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel='stylesheet' type='text/css'>

    <!-- uikit -->
    <link rel="stylesheet" href="/bower_components/uikit/css/uikit.almost-flat.min.css"/>

    <!-- altair admin login page -->
    <link rel="stylesheet" href="/assets/css/login_page.min.css" />

         <link rel="stylesheet" href="/assets/jquery.toast.min.css">
        <script src="/assets/jquery.min.js"></script>
        <script type="text/javascript" >
            let url;
            $(document).ready(function(){
                url ="<?php echo $json->host->protocal; ?>"+'://'+"<?php echo $json->host->domain; ?>"+("<?php echo $json->host->port; ?>"?':'+"<?php echo $json->host->port; ?>":'')+'/'+"<?php echo $json->host->subFolder; ?>";
            })
        </script>

</head>
<body class="login_page">
    <div class="login_page_wrapper">
        <div class="md-card" id="login_card">
            <div class="md-card-content large-padding" id="login_form">
                <div class="login_heading">
                    <div class="user_avatar"></div>
                </div>
                <form>
                    <div class="uk-form-row">
                        <label for="login_username">New Password</label>
                        <input class="md-input" type="password" id="new_password" tabindex="1"/>
                    </div>
                    <div class="uk-form-row">
                        <label for="login_password">Confirm Password</label>
                        <input class="md-input" type="password" id="conf_password" tabindex="2"/>
                    </div>
                    <div class="uk-margin-medium-top">
                        <a href="javascript:void(0)" class="md-btn md-btn-primary md-btn-block md-btn-large login-form-btn"  tabindex="3" onclick="checkPassword()">Save</a>
                    </div>
                   
                </form>
            </div>
           
        </div>
    </div>  
    <!-- common functions -->
    <script src="/assets/js/common.min.js"></script>
    <!-- uikit functions -->
    <script src="/assets/js/uikit_custom.min.js"></script>
    <!-- altair core functions -->
    <script src="/assets/js/altair_admin_common.min.js"></script>

    <!-- altair login page functions -->
    <script src="/assets/js/pages/login.min.js"></script>

    <script src="/assets/jquery.toast.min.js"></script>
    
    <script src="/assets/toast.js"></script>

    <script>
       
        // check for theme
        if (typeof(Storage) !== "undefined") {
            var root = document.getElementsByTagName( 'html' )[0],
                theme = localStorage.getItem("altair_theme");
            if(theme == 'app_theme_dark' || root.classList.contains('app_theme_dark')) {
                root.className += ' app_theme_dark';
            }
        }
    </script>

    <script>
        function checkPassword(){
           let confPassword =  $('#conf_password').val();
           let newPassword =  $('#new_password').val();
           if(newPassword !== confPassword){
                error_message(); 
                return;
           }
            var id= "<?php echo $_REQUEST['user_id'];?>"; 
            var postData = {};
             postData['password'] = $('#new_password').val();
             console.log(postData);
             $.ajax({
                url: url+'/api/user/user/forgotPassword/'+id,
                data: postData,
                method:'POST',
                beforeSend: function () {
                 }, complete: function () {
                    }, success: function (response) {
                        console.log('response data is =', response.status);
                        if (response.status) {
                                    console.log('success');
                                    success_message();
                                    // alert('valid user');
                                   }
                                else {
                                    error_message();
                                    console.log('error in adding the conter');
                                }
                        }, error: function () {
                                    error_message(); 
                                }
                            })
                        }

         function error_message($msg) {
            console.log('error message function is called');
            $.toast({
                heading: 'Failed to login',
                text: 'Confirm password not match with New password, please try again.',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'error',
                hideAfter: 3500
            });
        }
        
        function success_message() {
            $.toast({
                heading: 'Success',
                text: 'Password changed successfully login',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'success',
                hideAfter: 35000,
                stack: 6
            });
        }
        
    </script>
</body>
</html>
