$("#addZombieForm").submit(function (e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    if (username === undefined || username.trim().length === 0 ||
            password === undefined || password.trim().length === 0) {
        $.toast({
            heading: 'Error',
            text: "Username and Password are required!<br>Blanks are not allowed!",
            showHideTransition: 'fade',
            icon: 'error'
        });
        return;
    }
    sn.addZombie(username, password);
});