<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="roleChecker.jsp" %>
<%
    String pageName = " | Transaction";
    String titleName = "Transaction";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Transaction";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body class="hold-transition skin-maroon sidebar-mini">
        <div class="wrapper">
            <%@include file="common/header-nav.jsp" %>
            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper">
                <%@include file="common/titlePanel.jsp" %>
                <!-- Main content -->
                <section class="invoice">
                    <!-- title row -->
                    <div class="row">
                        <div class="col-xs-12">
                            <h4>
                                <span id="tDate"></span>
                                <p class="pull-right">
                                    <a class="btn btn-default" id="viewInvoice">View Invoice</a>
                                    &emsp;
                                    <a class="btn btn-default" id="shipNow">Ship Now</a>
                                </p>
                            </h4>
                        </div>
                        <!-- /.col -->
                    </div>
                    <!-- info row -->
                    <div class="row invoice-info">
                        
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
                </section>
                <!-- Main content -->
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title">Ordered Items</h3>
                                </div>
                                <!-- /.box-header -->
                                <div class="box-body">
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
                                <!-- /.box-body -->
                                <div class="row">
                                    <!-- accepted payments column -->
                                    <div class="col-sm-8">
                                    </div>
                                    <!-- /.col -->
                                    <div class="col-sm-4 col-xs-12">
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
                                    <!-- /.row -->
                                </div>
                                <!-- /.box -->
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->
                </section>
                <!-- /.content -->
            </div>
            <!-- /.content-wrapper -->
            <%@include file="common/footer.jsp" %>
        </div>
        <!-- ./wrapper -->
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/transaction.js"></script>
    </body>
</html>

