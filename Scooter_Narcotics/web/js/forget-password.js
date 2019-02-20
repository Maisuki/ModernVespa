var gCaptchaRes;

$(document).ready(function () {
    $('#pswd_info').hide();
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }

    $('#password').focus(function () {
        $('#pswd_info').show();
    }).blur(function () {
        $('#pswd_info').hide();
    });
    
    $("#forgetForm").submit(function(e) {
        e.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        var cfmpassword = $("#cfmpassword").val();
        
        if (username === undefined || username.trim().length === 0 ||
                password === undefined || password.trim().length === 0 ||
                cfmpassword === undefined || cfmpassword.trim().length === 0) {
            $("#message").html("Username, Password and Confirm Password are required to be entered!<br> Spaces only are not allowed!");
            return;
        }
        
        $.ajax({
            type: 'POST',
            url: 'update',
            data: {
                username: username,
                password: password,
                cfmpassword: cfmpassword,
                "g-recaptcha-response": gCaptchaRes
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                var rawData = e.responseText;
                if (rawData === "Unauthorized access!") {
                    $.toast({
                        heading: 'Error',
                        text: rawData,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                    grecaptcha.reset();
                    return;
                }
                
                var data = ($.parseJSON(e.responseText));

                if (e.status === 200 && data.status) {
                    $.toast({
                        heading: 'Success',
                        text: "Password updated successfully! You will be redirected to login page!",
                        showHideTransition: 'fade',
                        icon: 'success'
                    });
                    
                    setTimeout(function() {
                        location.replace("login.jsp");
                    }, 2000);
                }
                else {
                    $.toast({
                        heading: 'Error',
                        text: data.message,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                    grecaptcha.reset();
                }
            },
            dataType: 'json'
        });
    });
});

function captchaCallback(response) {
    gCaptchaRes = response;
}