var cart;
var transaction;
var isShipped;

$(document).ready(function () {
    var clientId = getUrlParameter('clientId');
    var cartId = getUrlParameter('cartId');
    sn.retrieveCart(clientId, cartId, cart, transaction, isShipped);

    $('#orderIds').change(function () {
        var orderId = $(this).val();
        var shipmentInfos = transaction.shipmentInfo;
        $.each(shipmentInfos, function (index, shipmentInfo) {
            if (orderId === shipmentInfo.shipmentId) {
                isShipped = shipmentInfo.isShipped;
            }
            if (cart.status === "partialShipped" && isShipped) {
                $("#shipped").hide();
            }
        });
    });

    $('#shipNow').click(function () {
        var orderId = $("#orderIds").val();
        var courier = transaction.courier;
        sn.buyShipment(orderId, courier, cartId, isShipped);
    });
    
    $('#viewInvoice').click(function() {
        var url = 'invoice.jsp?cartId=' + cartId + '&clientId=' + clientId;
        location.href = url;
    });
});