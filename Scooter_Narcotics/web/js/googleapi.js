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

//        gapi.auth2.getAuthInstance().currentUser.listen((user) => {
//            var profile = user.getBasicProfile();
//            if (profile !== undefined && location.href.indexOf('registration.jsp') === -1) {
//                loginGoogle(profile.getId(), profile.getEmail());
//            }
//        });
        if ($("#signin-button").length !== 0) {
            gapi.auth2.getAuthInstance().attachClickHandler('signin-button', {}, onSuccess, onFailure);
        }

        if ($("#signin-button1").length !== 0) {
            gapi.auth2.getAuthInstance().attachClickHandler('signin-button1', {}, onSuccess, onFailure);
        }
        if ($("#signin-button2").length !== 0) {
            gapi.auth2.getAuthInstance().attachClickHandler('signin-button2', {}, onSuccess1, onFailure1);
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
    console.log("123")
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

function GoogleRegister(googleId, email, first_name, last_name) {
    $('#googleRegistrationForm').slideDown('slow');
    $('#googleAcknowledgement').slideDown('slow');
    $('#registrationForm').slideUp('slow');
    $('#fbBtn, #googleBtn').slideUp('slow');

    $('#idGoogle').val(googleId);
    $('#emailGoogle').val(email);
    $('#fnameGoogle').val(first_name);
    $('#lnameGoogle').val(last_name);
}

function onSuccess1(googleUser) {
    console.log("hi1");
    var profile = googleUser.getBasicProfile();
    GoogleRegister(profile.getId(), profile.getEmail(), profile.getGivenName(), profile.getFamilyName());
}

function onFailure1(error) {
    console.log("hi");
    $.toast({
        heading: 'Error',
        text: error.error,
        showHideTransition: 'fade',
        icon: 'error'
    });
}