$(document).ready(function () {
    var clientId = getUrlParameter('clientId');
    var cartId = getUrlParameter('cartId');
    sn.retrieveInvoiceDetails(clientId, cartId, false);

    $('#print-invoice').click(function () {
        var url = "invoice-print.jsp?clientId=" + clientId + "&cartId=" + cartId;
        window.open(url, '_blank');
    })
});