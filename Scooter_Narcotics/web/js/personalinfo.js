var gCaptchaRes;

$(document).ready(function () {
    $('#pswd_info').hide();
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }
    if (userObject !== "") {
        $("#fname").val(userObject["fname"]);
        $("#lname").val(userObject["lname"]);
        $("#username").val(userObject["username"]);
        $("#email").val(userObject["email"]);
        $("#phone").val(userObject["contact"]);
        var billAddress = userObject["billAddress"];
        $("#street").val(billAddress["street"]);
        $("#city").val(billAddress["city"]);
        $("#country").val(billAddress["country"]);
        $("#state").val(billAddress["state"]);
        $("#zip").val(billAddress["zip"]);
    }
    
    $('#password').focus(function () {
        $('#pswd_info').show();
    }).blur(function () {
        $('#pswd_info').hide();
    });
    
    $("#cancelDesktop, #cancelMobile").click(function(e) {
        e.preventDefault();
        $(".formElements").removeAttr("required");
        $("#userDetailForm").removeAttr("action");
        location.replace("account.jsp");
    });
    
    $('#userDetailForm').submit(function(e) {
        e.preventDefault();
        var fname = $("#fname").val();
        var lname = $("#lname").val();
        var username = $("#username").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var street = $("#street").val();
        var city = $("#city").val();
        var zip = $("#zip").val();
        var state = $("#state").val();
        var country = $("#country").val();

        if (fname === undefined || fname.trim().length === 0 ||
                lname === undefined || lname.trim().length === 0 ||
                username === undefined || username.trim().length === 0 ||
                email === undefined || email.trim().length === 0 ||
                phone === undefined || phone.trim().length === 0 ||
                street === undefined || street.trim().length === 0 ||
                city === undefined || city.trim().length === 0 ||
                zip === undefined || zip.trim().length === 0 ||
                state === undefined || state.trim().length === 0 ||
                country === undefined || country.trim().length === 0 ) {
            $("#message").html("First Name, Last Name, Email, Phone, Street, City, Zip, State, Country values are required to be entered!<br> Spaces only are not allowed!");
            return;
        }
        
        $.ajax({
            type: 'POST',
            url: 'updateUserInfo',
            data: {
                fname: fname,
                lname: lname,
                username: username,
                email: email,
                contact: phone,
                street: street,
                city: city,
                zip: zip,
                state: state,
                country: country,
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
                        text: "Account details updated successfully! You will be redirected back to your account dashboard!",
                        showHideTransition: 'fade',
                        icon: 'success'
                    });
                    
                    setTimeout(function() {
                        location.replace("account.jsp");
                    }, 2000);
                }
                else {
                    if (data.message === "You must login to change your password!") {
                        location.replace("login.jsp?page=personalinfo.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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


