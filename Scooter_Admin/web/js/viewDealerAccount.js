$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving dealer accounts...',
        theme: 'dark'
    });
    sn.retrieveCRM("Dealer");
});