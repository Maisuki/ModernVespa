$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Products...',
        theme: 'dark'
    });
    sn.retrieveCRM("Buyer");
});