
$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Account informations...',
        theme: 'dark'
    });
    var id = getUrlParameter('id');
    sn.retrieveCRMByClientId("Dealer", id);

    sn.retrieveTransactions(id);
});