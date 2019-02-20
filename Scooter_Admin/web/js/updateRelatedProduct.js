$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving all products...',
        theme: 'dark'
    });
    sn.retrieveProductsForRelatedUpdate(getUrlParameter("pid"));
});