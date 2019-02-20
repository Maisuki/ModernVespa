$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Transactions...',
        theme: 'dark'
    });

    sn.retrieveAllTransactions();
});