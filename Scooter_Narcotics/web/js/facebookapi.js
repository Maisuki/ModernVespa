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
                                if (location.href.indexOf("#modal1") > -1) {
                                    $('#errMsg').text(data.message);
                                }
                                else {
                                    $.toast({
                                        heading: 'Error',
                                        text: data.message,
                                        showHideTransition: 'fade',
                                        icon: 'error'
                                    });
                                }
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

function activateFBLogin() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            FB.api('/me', {locale: 'en_US', fields: 'email'}, function (response) {
                if (response.error === undefined) {
                    $.ajax({
                        type: 'POST',
                        url: 'activateFBLogin',
                        data: {
                            fbId: response.id
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
                                
                                setTimeout(function() {
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

var fbId, fbEmail, fbFname, fbLname;

function FBRegister() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            FB.api('/me', {locale: 'en_US', fields: 'name, email, first_name, last_name'}, function (response) {
                if (response.error === undefined) {
                    $("#fbBtn").hide();
                    $("#fbAcknowledgement").show();
                    fbId = response.id;
                    fbEmail = response.email;
                    fbFname = response.first_name;
                    fbLname = response.last_name;
                    if (gEmail !== undefined && $(".fborgoogle:visible").length === 0) {
                        $(".fborgoogle").show();
                    } else {
                        $("#idFB").val(fbId);
                        $("#email").val(fbEmail);
                        $("#fname").val(fbFname);
                        $("#lname").val(fbLname);
                        $(".fborgoogle").hide();
                    }
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
                    FBRegister1();
                }
            }, {scope: 'public_profile,email'});
        }
    });
}