var page = '';
$(document).ready(function () {
    var uri = window.location.href;
    if (uri.indexOf("?") > -1) {
        var queryParams = uri.split("?")[1];
        if (queryParams.indexOf("&") > -1) {
            var params = queryParams.split("&");
            for (var idx in params) {
                var param = params[idx];
                if (param.indexOf("page") > -1) {
                    page = param.substring(param.indexOf("page") + 5);
                } else if (param.indexOf("message") > -1) {
                    var message = param.substring(param.indexOf("message") + 8);
                    message = decodeURI(message);
                    $("#message").html(message);
                }
            }
        } else if (queryParams.indexOf("page") > -1) {
            page = queryParams.substring(queryParams.indexOf("page") + 5);
        }
    }

    $("#loginForm").submit(function (e) {
        e.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        var zombie = $('#zombie').is(':checked');

        if (username === undefined || username.trim().length === 0 ||
                password === undefined || password.trim().length === 0) {
            $("#message").text("Username and Password are required!");
            return;
        }
        sn.login(username, password, zombie, page);
    });

    $("#username, #password").keyup(function () {
        $("#message").text("");
    });
});