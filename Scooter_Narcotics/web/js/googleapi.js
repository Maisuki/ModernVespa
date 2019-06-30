/**
 * Initializes the Sign-In client.
 */
function init() {
    gapi.load('auth2', async function () {
        gapi.auth2.init({
            apiKey: 'AIzaSyAjq2JjRf94RRqusfBX8vyEhVqnsDPAYZs',
            client_id: '292673991281-kk8hekpfi5p6smf8eeoi6f6gm2u540rn.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        });

        // login from modal
        if ($("#signin-button").length !== 0) {
            gapi.auth2.getAuthInstance().attachClickHandler('signin-button', {}, onSuccess, onFailure);
        }

        // login from login.jsp
        if ($("#signin-button1").length !== 0) {
            gapi.auth2.getAuthInstance().attachClickHandler('signin-button1', {}, onSuccess, onFailure);
        }

        // register
        if ($("#signin-button2").length !== 0) {
            gapi.auth2.getAuthInstance().attachClickHandler('signin-button2', {}, onSuccess1, onFailure1);
        }

        // activate fb login
        if ($("#signin-button3").length !== 0) {
            gapi.auth2.getAuthInstance().attachClickHandler('signin-button3', {}, onSuccess2, onFailure2);
        }
    });
}

function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    loginGoogle(profile.getId(), profile.getEmail());
}

function onFailure(error) {
    $.toast({
        heading: 'Error',
        text: error.error,
        showHideTransition: 'fade',
        icon: 'error'
    });
}

function loginGoogle(id, email) {
    $.ajax({
        type: 'POST',
        url: 'login',
        data: {
            googleId: id,
            email: email,
            type: 'google'
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));

            if (data.status) {
                var url = location.pathname;
                if (location.search.length > 0) {
                    url += "?" + location.search;
                }
                location.replace(url);
            } else {
                if (location.href.indexOf('#modal1') === -1) {
                    $.toast({
                        heading: 'Error',
                        text: data.message,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                } else {
                    $('#errMsg').text(data.message);
                }
            }
        },
        dataType: 'json'
    });
}

var gId, gEmail, gFname, gLname;

function GoogleRegister(googleId, email, first_name, last_name) {
    $("#googleBtn").hide();
    $("#googleAcknowledgement").show();

    gId = googleId;
    gEmail = email;
    gFname = first_name;
    gLname = last_name;
    $("#idGoogle").val(gId);

    if (fbId !== undefined && $(".fborgoogle:visible").length === 0) {
        $(".fborgoogle").show();
    } else {
        $("#email").val(gEmail);
        $("#fname").val(gFname);
        $("#lname").val(gLname);
        $(".fborgoogle").hide();
    }
}

function onSuccess1(googleUser) {
    var profile = googleUser.getBasicProfile();
    GoogleRegister(profile.getId(), profile.getEmail(), profile.getGivenName(), profile.getFamilyName());
}

function onFailure1(error) {
    $.toast({
        heading: 'Error',
        text: error.error,
        showHideTransition: 'fade',
        icon: 'error'
    });
}

function activateGoogleLogin(googleId) {
    $.ajax({
        type: 'POST',
        url: 'activateGoogleLogin',
        data: {
            googleId: googleId
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
                return;
            }

            var data = ($.parseJSON(e.responseText));

            if (data.status) {
                $.toast({
                    heading: 'Success',
                    text: 'Activated successfully!',
                    showHideTransition: 'fade',
                    icon: 'success'
                });

                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                $.toast({
                    heading: 'Error',
                    text: rawData,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        },
        dataType: 'json'
    });
}

function onSuccess2(googleUser) {
    var profile = googleUser.getBasicProfile();
    activateGoogleLogin(profile.getId());
}

function onFailure2(error) {
    $.toast({
        heading: 'Error',
        text: error.error,
        showHideTransition: 'fade',
        icon: 'error'
    });
}