$(document).ready(function () {
    var cartId = getUrlParameter('cartId');
    var clientId = getUrlParameter('clientId');
    sn.retrieveInvoiceDetails(clientId, cartId, true);
});