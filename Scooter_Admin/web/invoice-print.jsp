<%@page import="common.Global"%>
<%
    String pageName = " | Invoice";
    String titleName = "Invoice";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Invoice";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body>
        <span style="color:#fff"></span>
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
                            <tbody id="invoiceDetails"></tbody>
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
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/invoice-print.js"></script>
    </body>
</html>
