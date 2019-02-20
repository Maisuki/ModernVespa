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
    
    $("#cancel").click(function(e) {
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
    
    $('#registrationForm').submit(function(e) {
        e.preventDefault();
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var cfmpassword = $("#cfmpassword").val();
        var fname = $("#fname").val();
        var lname = $("#lname").val();
        var contact = $("#contact").val();
        var street = $("#street").val();
        var city = $("#city").val();
        var zip = $("#zip").val();
        var state = $("#state").val();
        var country = $("#country").val();
        var role = $("#role").val();

        if (username === undefined || username.trim().length === 0 ||
                email === undefined || email.trim().length === 0 ||
                password === undefined || password.trim().length === 0 ||
                cfmpassword === undefined || cfmpassword.trim().length === 0 ||
                fname === undefined || fname.trim().length === 0 ||
                lname === undefined || lname.trim().length === 0 ||
                contact === undefined || contact.trim().length === 0 ||
                street === undefined || street.trim().length === 0 ||
                city === undefined || city.trim().length === 0 ||
                zip === undefined || zip.trim().length === 0 ||
                state === undefined || state.trim().length === 0 ||
                country === undefined || country.trim().length === 0 ||
                role === undefined || role.trim().length === 0) {
            $("#message").html("Username, Email, Password, Confirm Password, First Name, Last Name, Contact, Street, City, Zip, State, Country and Role values are required to be entered!<br> Spaces only are not allowed!");
            return;
        }
        
        $.ajax({
            type: 'POST',
            url: 'register',
            data: {
                username: username,
                email: email,
                password: password,
                cfmpassword: cfmpassword,
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
    
    $('#fbRegistrationForm').submit(function(e) {
        e.preventDefault();
        var fbID = $("#idFB").val();
        var email = $("#emailFB").val();
        var fname = $("#fnameFB").val();
        var lname = $("#lnameFB").val();
        var contact = $("#contactFB").val();
        var street = $("#streetFB").val();
        var city = $("#cityFB").val();
        var zip = $("#zipFB").val();
        var state = $("#stateFB").val();
        var country = $("#countryFB").val();
        var role = $("#roleFB").val();

        if (fbID === undefined || fbID.trim().length === 0 ||
                email === undefined || email.trim().length === 0 ||
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
        
        $.ajax({
            type: 'POST',
            url: 'registerFB',
            data: {
                id: fbID,
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
    
    $('#googleRegistrationForm').submit(function(e) {
        e.preventDefault();
        var googleID = $("#idGoogle").val();
        var email = $("#emailGoogle").val();
        var fname = $("#fnameGoogle").val();
        var lname = $("#lnameGoogle").val();
        var contact = $("#contactGoogle").val();
        var street = $("#streetGoogle").val();
        var city = $("#cityGoogle").val();
        var zip = $("#zipGoogle").val();
        var state = $("#stateGoogle").val();
        var country = $("#countryGoogle").val();
        var role = $("#roleGoogle").val();

        if (googleID === undefined || googleID.trim().length === 0 ||
                email === undefined || email.trim().length === 0 ||
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
        
        $.ajax({
            type: 'POST',
            url: 'registerGoogle',
            data: {
                id: googleID,
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