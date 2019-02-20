var gCaptchaRes;

$(document).ready(function () {
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }
    
    $("#forgetForm").submit(function(e) {
        e.preventDefault();
        var email = $("#email").val();
        
        if (email === undefined || email.trim().length === 0) {
            $("#message").html("Email is required to be entered!<br> Spaces only are not allowed!");
            return;
        }
        
        $.ajax({
            type: 'POST',
            url: 'forget',
            data: {
                email: email,
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
                        text: data.message,
                        showHideTransition: 'fade',
                        icon: 'success'
                    });
                    $("#success").text(data.message);
                    grecaptcha.reset();
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