$(document).ready(function () {
    sn.retrieveZombie(getUrlParameter('id'));
});

$("#updateZombieForm").submit(function (e) {
    e.preventDefault();
    var id = getUrlParameter('id');
    var username = $("#username").val();
    var password = $("#password").val();

    if (id === undefined || id.trim().length === 0) {
        location.replace("zombieManager.jsp");
        return;
    }

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
    sn.updateZombie(id, username, password);
});