function checkLoginState() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            FB.api('/me', {locale: 'en_US', fields: 'email'}, function (response) {
                if (response.error === undefined) {
                    $.ajax({
                        type: 'POST',
                        url: 'login',
                        data: {
                            fbId: response.id,
                            email: response.email,
                            type: 'fb'
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
                                $('#errMsg').text(data.message);
                            }
                        },
                        dataType: 'json'
                    });
                } else {
                    $.toast({
                        heading: 'Error',
                        text: response.error.message,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                }
            });
        } else {
            // The person is not logged into your app or we are unable to tell.
            FB.login(function (response) {
                if (response.authResponse) {
                    // connected
                    checkLoginState();
                }
            }, {scope: 'public_profile,email'});
        }
    });
}

function FBRegister() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            FB.api('/me', {locale: 'en_US', fields: 'name, email, first_name, last_name'}, function (response) {
                if (response.error === undefined) {
                    $('#fbRegistrationForm').slideDown('slow');
                    $('#fbAcknowledgement').slideDown('slow');
                    $('#registrationForm').slideUp('slow');
                    $('#fbBtn, #googleBtn').slideUp('slow');

                    $('#idFB').val(response.id);
                    $('#emailFB').val(response.email);
                    $('#fnameFB').val(response.first_name);
                    $('#lnameFB').val(response.last_name);
                } else {
                    $.toast({
                        heading: 'Error',
                        text: response.error.message,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                }
            });
        } else {
            // The person is not logged into your app or we are unable to tell.
            FB.login(function (response) {
                if (response.authResponse) {
                    // connected
                    FBRegister();
                }
            }, {scope: 'public_profile,email'});
        }
    });
}