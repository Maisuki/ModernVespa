var gCaptchaRes;

$(document).ready(function () {
    $('.fborgoogle').hide();
    $('#pswd_info').hide();
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }

    $('#password').focus(function () {
        $('#pswd_info').show();
    }).blur(function () {
        $('#pswd_info').hide();
    });

    $("#cancel").click(function (e) {
        e.preventDefault();
        $(".regFields").removeAttr("required");
        $("#registrationForm").removeAttr("action");
        location.replace("login.jsp");
    });

    $.ajax({
        type: 'GET',
        url: 'retrieveRoles',
        success: function (data) {
        },
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200) {
                for (var i = 0; i < data.roles.length; i++) {
                    $("#role, #roleFB, #roleGoogle").append("<option value='" + data.roles[i] + "'>" + data.roles[i] + "</option>");
                }
            }
        },
        dataType: 'json'
    });


    $('#registrationForm').submit(function (e) {
        e.preventDefault();

        if ($(".fborgoogle").is(":visible") && (!$("#fbCheck").prop("checked") && !$("#googleCheck").prop("checked"))) {
            $.toast({
                heading: 'Error',
                text: "Please choose if you want to use facebook email or google email above!",
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }

        if (!$("#verify").prop("checked")) {
            $.toast({
                heading: 'Error',
                text: "You need to agree to the Terms of Use!",
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }

        var email = $("#email").val();
        var fname = $("#fname").val();
        var lname = $("#lname").val();
        var contact = $("#contact").val();
        var street = $("#street").val();
        var city = $("#city").val();
        var zip = $("#zip").val();
        var state = $("#state").val();
        var country = $("#country").val();
        var role = $("#role").val();

        if (email === undefined || email.trim().length === 0 ||
                fname === undefined || fname.trim().length === 0 ||
                lname === undefined || lname.trim().length === 0 ||
                contact === undefined || contact.trim().length === 0 ||
                street === undefined || street.trim().length === 0 ||
                city === undefined || city.trim().length === 0 ||
                zip === undefined || zip.trim().length === 0 ||
                state === undefined || state.trim().length === 0 ||
                country === undefined || country.trim().length === 0 ||
                role === undefined || role.trim().length === 0) {
            $("#message").html("Email, First Name, Last Name, Contact, Street, City, Zip, State, Country and Role values are required to be entered!<br> Spaces only are not allowed!");
            return;
        }

        var username = $("#username").val();
        var password = $("#password").val();
        var cfmpassword = $("#cfmpassword").val();
        var fbId = $("#idFB").val();
        var googleId = $("#idGoogle").val();

        $.ajax({
            type: 'POST',
            url: 'register',
            data: {
                fbId: fbId,
                googleId: googleId,
                username: username,
                password: password,
                cfmpassword: cfmpassword,
                email: email,
                fname: fname,
                lname: lname,
                contact: contact,
                street: street,
                city: city,
                zip: zip,
                state: state,
                country: country,
                role: role,
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
                        text: "You have successfully registered to Scooter Narcotics! You will be redirected back to your login page!",
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


$("#fbCheck").change(function () {
    $("#googleCheck").prop("checked", false);
    $("#idFB").val(fbId);
    $("#email").val(fbEmail);
    $("#fname").val(fbFname);
    $("#lname").val(fbLname);
});

$("#googleCheck").change(function () {
    $("#fbCheck").prop("checked", false);
    $("#idGoogle").val(gId);
    $("#email").val(gEmail);
    $("#fname").val(gFname);
    $("#lname").val(gLname);
});