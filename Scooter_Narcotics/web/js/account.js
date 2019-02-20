var myVar;

function myFunction() {
    myVar = setTimeout(showPage, 1500);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}

$(document).ready(function () {
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }
    if (userObject !== "") {
        var billAddress = userObject.billAddress;
        var craftedBillAddress = "<b>Street</b>: <u>" + billAddress.street + "</u>";
        craftedBillAddress += "<br>";
        craftedBillAddress += "<b>City</b>: <u>" + billAddress.city + "</u>";
        craftedBillAddress += "<br>";
        craftedBillAddress += "<b>Country</b>: <u>" + billAddress.country + "</u>";
        craftedBillAddress += "<br>";
        craftedBillAddress += " <b>State</b>: <u>" + billAddress.state + "</u>";
        craftedBillAddress += "<br>";
        craftedBillAddress += " <b>Zip</b>: <u>" + billAddress.zip + "</u>";
        $("#billAdd").html(craftedBillAddress);
    }

    var gtotal = 0;

    $.ajax({
        type: 'POST',
        url: 'retrieveTransactions',
        data: {},
        success: function (data) {},
        complete: function (e, xhr, settings) {
            if (e.status === 200) {
                var data = ($.parseJSON(e.responseText));
                if (data.status) {
                    var transactions = data.transactions;
                    for (var i = 0; i < transactions.length; i++) {
                        var transaction = transactions[i];
                        var transactionId = transaction.transactionId;
                        var transactionDate = transaction.transaction_date;
                        var cartId = transaction.cartId;
                        var shippingCosts = transaction.shippingCosts;

                        total = parseFloat(cartCost(transaction.cart));
                        gtotal += total;

                        var infor = "<tr style='height:100px'>";
                        infor += "<td colspan='2' style='padding-left:10px'>";
                        infor += transactionId;
                        infor += "</td>";
                        infor += "<td class='mobile-nav-display-none' align='center'>";
                        infor += transactionDate;
                        infor += "</td>";
                        infor += "<td class='mobile-nav-display-none-1' align='center'>";
                        infor += ccode + " " + total;
                        infor += "</td>";
                        infor += "<td class='mobile-nav-display-none' align='center'>";
                        infor += ccode + " " + parseFloat(shippingCosts).toFixed(2);
                        infor += "</td>";
                        infor += "<td align='center'>";
                        infor += "<a href='invoice-print.jsp?cartId=" + cartId + "' style='padding-right:10px;' target='_blank' class='button'>Print Invoice</a>";
                        infor += "</td>";
                        infor += "</tr>";
                        $("#transactionHistory").append(infor);
                    }
                    if (role === buyer) {
                        var accountPrice = "<span class='account-price'>";
                        accountPrice += "Total Spending: &nbsp; ";
                        accountPrice += "<b style='border-bottom: 2px solid #a6eb14;'>" + ccode + " " + gtotal.toFixed(2) + "</b>";
                        accountPrice += "</span>";

                        $("#amountSpent").append(accountPrice);
                    } else if (role === dealer) {
                        var accountPrice = "<span class='account-price'>";
                        accountPrice += "Turnover: &nbsp; ";
                        accountPrice += "<b style='border-bottom: 2px solid #a6eb14;'> " + ccode + " " + gtotal.toFixed(2) + "</b>";
                        accountPrice += "</span>";

                        $("#amountSpent").append(accountPrice);
                    }
                }
            }
        },
        dataType: 'json'
    });
});

function cartCost(carts) {
    total = 0;
    for (var i = 0; i < carts.length; i++) {
        var cart = carts[i];
        var cart_items = cart.cart_items;
        for (var j = 0; j < cart_items.length; j++) {
            var price = cart_items[j].price;
            var qty = cart_items[j].qty;
            total = (price * qty).toFixed(2);
        }
    }
    return total;
}