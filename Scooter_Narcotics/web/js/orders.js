var myVar;

function myFunction() {
    myVar = setTimeout(showPage, 1500);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}

function GetSelectedDate(ddlDate) {
    DateSelected = ddlDate.options[ddlDate.selectedIndex].value;

    var splitedDate = DateSelected.split("-");
    sortDateLoad(splitedDate[0], splitedDate[1]);

}

$(document).ready(function () {
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }

    $.ajax({
        type: 'POST',
        url: 'retrieveTransactions',
        data: {},
        success: function (data) {},
        complete: function (e, xhr, settings) {
            if (e.status === 200) {
                var data = ($.parseJSON(e.responseText));
//                            console.log(data);

                if (data.status) {
                    var month = "";
                    var year = "";
                    var transactions = data.transactions;
                    for (var i = 0; i < transactions.length; i++) {
                        var transaction = transactions[i];
                        var infor = "<b>TRANSACTION ID:</b> &nbsp; ";
                        infor += "<b style='font-size: 18px; color: #a6eb14'>" + data.transactions[i].cartId + "</b>";
                        infor += "<br>";
                        infor += "<a href='invoice-print.jsp?cartId=" + transaction.cartId + "' class='invoice-button button' target='_blank'>Print Invoice</a>";
                        infor += "<br><br>";
                        infor += "<table>";
                        infor += "<tr>";
                        infor += "<th colspan='2'></th>";
                        infor += "<th colspan='3'>Item Name</th>";
                        infor += "<th>Price</th>";
                        infor += "<th>Quantity</th>";
                        infor += "<th>Status</th>";
                        infor += "</tr>";

                        var carts = transaction.cart;
                        for (var j = 0; j < carts.length; j++) {
                            var cart = carts[j];
                            var cart_items = cart.cart_items;
                            for (var k = 0; k < cart_items.length; k++) {
                                var cart_item = cart_items[k];
                                infor += "<tr class='tr1'>";
                                infor += "<td colspan='2'>";
                                infor += "<a href='#' class='pic'>";
                                infor += "<img src='" + base + "/" + cart_item.img + "' width='100' height='100' style='border-radius: 5px' alt=''>";
                                infor += "</a>";
                                infor += "</td>";

                                infor += "<td colspan='3'>";
                                infor += cart_item.name;
                                infor += "</td>";
                                infor += "<td align='center'>";
                                infor += ccode + " " + parseFloat(cart_item.price).toFixed(2);
                                infor += "</td>";
                                infor += "<td align='center'>" + cart_item.qty + "</td>";
                                infor += "<td align='center'>Delivered</td>";
                                infor += "</tr>";
                                infor += "</table>";
                                infor += "<br><br><br>";
                            }
                        }
                        $("#transactionHistory").append(infor);

                        var date = new Date(data.transactions[i].transaction_date);

                        if (date.getMonth() !== month || date.getFullYear() !== year) {
                            month = date.getMonth();
                            year = date.getFullYear();
                            var monthArr = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

                            $("#sortByDate").append("<option style='color:black;' value='" + (month + 1) + "-" + year + "'>" + monthArr[month] + "-" + year + "</option>");
                        }
                    }
                } else {
                    if (data.message === "You must login to view your transactions!") {
                        $.toast({
                            heading: 'Error',
                            text: 'Please login to view your transaction!',
                            showHideTransition: 'fade',
                            icon: 'error'
                        });
                        var href = window.location.href;
                        var lastSlashIndex = href.lastIndexOf("/") + 1;
                        var redirectUrl = href.substring(lastSlashIndex);
                        window.location.replace("login.jsp?page=" + redirectUrl);
                    }
                }
            }
        },
        dataType: 'json'
    });
});

function sortDateLoad(mth, yr) {
    $("#transactionHistory").empty();

    $.ajax({
        type: 'POST',
        url: 'transactionSearch',
        data: {
            monthFilter: mth,
            yearFilter: yr
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            if (e.status === 200) {
                var data = ($.parseJSON(e.responseText));
                console.log(data);

                if (data.status) {
                    var month = "";
                    var year = "";
                    var trasactions = data.transactions;
                    for (var i = 0; i < transactions.length; i++) {
                        var transaction = transactions[i];
                        var infor = "<tr>";
                        infor += "<th colspan='2'>Transaction ID: </th>";
                        infor += "<th>" + transaction.transactionId + "</th>";
                        infor += "<th>Item Name</th>";
                        infor += "<th>Unit Price</th>";
                        infor += "<th>Quantity</th>";
                        infor += "<th>Status</th>";
                        infor += "<th>";
                        infor += "<a href='shipment.jsp' style='float: right; color: white;'>MANAGE ORDER</a>";
                        infor += "</th>";
                        infor += "</tr>";
                        
                        var carts = transaction.cart;
                        for (var j = 0; j < carts.length; j++) {
                            var cart = carts[j];
                            var cart_items = cart.cart_items;
                            for (var k = 0; k < cart_items.length; k++) {
                                var cart_item = cart_items[k];
                                infor += "<tr>";
                                infor += "<td colspan='2'></td>";

                                infor += "<td>";
                                infor += "<a href='#' class='pic'>";
                                infor += "<img src='" + cart_item.img + "' width='100' height='100' alt=''>";
                                infor += "</a>";
                                infor += "</td>";

                                infor += "<td>";
                                infor += cart_item.name;
                                infor += "</td>";

                                infor += "<td>";
                                infor += ccode + " " + parseFloat(cart_item.price).toFixed(2);
                                infor += "</td>";

                                infor += "<td>";
                                infor += cart_item.qty;
                                infor += "</td>";

                                infor += "<td>";
                                infor += "<span style='float: right'>Delivered</span>";
                                infor += "</td>";

                                infor += "<td></td>";

                                infor += "</tr>";
                            }
                        }
                        $("#transactionHistory").append(infor);
                    }
                } else {
                    if (data.message === "You must login to perform transaction search!") {
                        $.toast({
                            heading: 'Error',
                            text: 'Please login to perform transaction search!',
                            showHideTransition: 'fade',
                            icon: 'error'
                        });
                        var href = window.location.href;
                        var lastSlashIndex = href.lastIndexOf("/") + 1;
                        var redirectUrl = href.substring(lastSlashIndex);
                        window.location.replace("login.jsp?page=" + redirectUrl);
                    } else {
                        $.toast({
                            heading: 'Error',
                            text: data.message,
                            showHideTransition: 'fade',
                            icon: 'error'
                        });
                    }
                }
            }
        },
        dataType: 'json'
    });
}