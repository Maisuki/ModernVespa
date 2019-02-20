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
    
    $("#cancelDesktop, #cancelMobile").click(function(e) {
        e.preventDefault();
        $(".updatePass").removeAttr("required");
        $("#updateForm").removeAttr("action");
        location.replace("account.jsp");
    });
    
    $("#updateForm").submit(function(e) {
        e.preventDefault();
        var currentPassword = $("#currentPassword").val();
        var newPassword = $("#password").val();
        var cfmPassword = $("#cfmPassword").val();
        
        if (currentPassword === undefined || currentPassword.trim().length === 0 ||
                newPassword === undefined || newPassword.trim().length === 0 ||
                cfmPassword === undefined || cfmPassword.trim().length === 0) {
            $("#message").html("Current Password, New Password and Confirm Password values are required to be entered!<br> Spaces only are not allowed!");
            return;
        }
        
        $.ajax({
            type: 'POST',
            url: 'changePassword',
            data: {
                currentPassword: currentPassword,
                newpassword: newPassword,
                cfmpassword: cfmPassword,
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
                        text: "Password updated successfully! You will be redirected back to your account dashboard!",
                        showHideTransition: 'fade',
                        icon: 'success'
                    });
                    
                    setTimeout(function() {
                        location.replace("account.jsp");
                    }, 2000);
                }
                else {
                    if (data.message === "You must login to change your password!") {
                        location.replace("login.jsp?page=change-password.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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
                }
            },
            dataType: 'json'
        });
    });
});

function captchaCallback(response) {
    gCaptchaRes = response;
}