<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI() +       // "/people"
             "?" +                           // "?"
             request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = " | Invoice";
    String titleName = "";
    String breadCrumbName = "";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body >
        <span style="color:#fff">
            <%--
            <%@include file="common/countryDetector.jsp" %>
            <%@include file="common/currencyDetector.jsp" %>
            --%>
        </span>

        <div class="wrapper">
            <!-- Main content -->
            <section class="invoice">
                <!-- title row -->
                <div class="row">
                    <div class="col-xs-12" >
                        <h2 class="page-header">
                            <img src="img/logo_Black.png" width="350" height="80">
                            <small class="pull-right">Date: <span id="tDate"></span></small>
                        </h2>
                    </div>
                    <!-- /.col -->
                </div>
                <!-- info row -->
                <div class="row invoice-info">
                    <div class="col-sm-12 invoice-col">

                        <h5>Customer ID: <b><span id="cid"></span></b></h5>
                        <br>

                    </div>
                </div>
                <div class="row invoice-info">
                    <div class="col-sm-4 invoice-col">
                        From:
                        <address>
                            <strong>Mark, Scooter Narcotics.</strong><br>
                            25 Kaki Bukit Road 4,<br>
                            #01-35 (SYNERGY),Singapore (417800)<br>
                            Phone: (+65) 8687-8551<br>
                            Email: mark@scooternarcotics.com
                        </address>
                    </div>
                    <!-- /.col -->
                    <div class="col-sm-4 invoice-col">
                        To:
                        <address>
                            <strong><span id="name"></span></strong><br>
                            <span id="street1"></span><br>
                            <span id="postal"></span><br>
                            Phone: <span id="phone"></span><br>
                            Email: <span id="email"></span>
                        </address>
                    </div>
                    <!-- /.col -->
                    <div class="col-sm-4 invoice-col">
                        <b>Invoice: <span id="inum"></span></b><br>
                        <br>
                        <b>Order Type:</b> Online Purchase<br>
                        <b>Merchandise Value:</b> <span id="mValue"></span><br>
                        <b>Forwarder:</b> <span id="forwader"></span>
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->

                <!-- Table row -->
                <div class="row">
                    <div class="col-xs-12 table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Product weight</th>
                                    <th>Unit Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody id="invoiceDetails">	  
                            </tbody>
                        </table>
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->

                <div class="row">
                    <!-- accepted payments column -->
                    <div class="col-xs-6">
                        <span class="lead">Payment Method:</span>
                        <span id="paymentType"></span>


                    </div>
                    <!-- /.col -->
                    <div class="col-xs-6">

                        <div class="table-responsive">
                            <table class="table">
                                <tr>
                                    <th style="width:50%">Total Weight:</th>
                                    <td id="totalWeight"></td>
                                </tr>
                                <tr>
                                    <th style="width:50%">Number of Packages:</th>
                                    <td id="noPackage"></td>
                                </tr>
                                <tr>
                                    <th style="width:50%">Subtotal:</th>
                                    <td id="subTotal"></td>
                                </tr>
                                <tr>
                                    <th>Shipping:</th>
                                    <td id="shipping"></td>
                                </tr>
                                <tr>
                                    <th>Total:</th>
                                    <td id="total"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->
            </section>
            <!-- /.content -->
        </div>
        <!-- ./wrapper -->
        <script src="js/jquery.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/fastclick.js"></script>
        <script src="js/admin.js"></script>
        <script>
            $(document).ready(function () {
                invoiceDetails = $("#invoiceDetails");
                cartId = '<%=request.getParameter("cartId")%>';
                clientId = '${sessionScope.clientId}';
                productTotalWeight = 0;
                subTotal = 0;
                cartInfo = "";
                productQty = 0;
                productUprice = 0;
                productWeight = 0;
                noPackage = 0;
                $.ajax({
                    type: 'POST',
                    url: '<%=Global.BASE_URL%>/retrieveCartForInvoice',
                    dataType: 'json',
                    data: {
                        clientId: clientId,
                        cartId: cartId
                    },
                    success: function (data) {},
                    complete: function (e, xhr, settings) {
                        if (e.status === 200) {
                            var data = ($.parseJSON(e.responseText));
                            if (data.status) {
                                cartItems = data.cart.cart_items;

                                for (var i = 0; i < data.cart.cart_items.length; i++) {
                                    productQty = parseFloat(cartItems[i].qty);
                                    productUprice = parseFloat(cartItems[i].price);
                                    productWeight = parseFloat(cartItems[i].weight);
                                    productTotalWeight += productWeight * productQty;
                                    subTotal += productUprice * productQty;
                                    cartInfo = "<tr>";
                                    cartInfo += "<th>" + (i + 1) + "</th>";
                                    cartInfo += "<td>" + cartItems[i].name + "</td>";
                                    cartInfo += "<td>" + productQty + "</td>";
                                    cartInfo += "<td>" + productWeight + "KG</td>";
                                    cartInfo += "<td>" + ccode + productUprice + "</td>";
                                    cartInfo += "<td>" + ccode + (productUprice * productQty).toFixed(2) + "</td>";
                                    cartInfo += "</tr>";
                                    invoiceDetails.append(cartInfo);
                                }
                                transaction = data.cart.transaction[0];
                                courier = transaction.courier;
                                shipping = transaction.shippingCosts;
                                paymentType = transaction.paymentType;
                                tDate = new Date(transaction.transaction_date);
                                shippingDetails = transaction.shippingDetails;
                                name = shippingDetails.name;
                                street = shippingDetails.street1;
                                zip = shippingDetails.zip;
                                city = shippingDetails.city;
                                shipmentInfo = transaction.shipmentInfo;

                                for (var j = 0; j < shipmentInfo.length; j++) {
                                    noPackage += shipmentInfo[j].shipment.length;
                                }
                                total = subTotal + shipping;
                                document.getElementById("cid").innerHTML = clientId;
                                document.getElementById("name").innerHTML = name;
                                document.getElementById("postal").innerHTML = city + ", " + zip;
                                document.getElementById("street1").innerHTML = street;
                                document.getElementById("inum").innerHTML = transaction._id;
                                document.getElementById("totalWeight").innerHTML = productTotalWeight + "KG";
                                document.getElementById("noPackage").innerHTML = noPackage;
                                document.getElementById("subTotal").innerHTML = ccode + subTotal.toFixed(2);
                                document.getElementById("shipping").innerHTML = ccode + parseFloat(shipping).toFixed(2);
                                document.getElementById("total").innerHTML = ccode + parseFloat(total).toFixed(2);
                                document.getElementById("paymentType").innerHTML = paymentType;
                                document.getElementById("forwader").innerHTML = courier;
                                document.getElementById("mValue").innerHTML = ccode + subTotal.toFixed(2);
                                document.getElementById("tDate").innerHTML = tDate.getDate() + "/" + (tDate.getMonth() + 1) + "/" + tDate.getFullYear();
                                window.print();
                            }
                        }
                    }
                });
            });
        </script>
    </body>
</html>