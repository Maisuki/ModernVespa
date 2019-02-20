<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="roleChecker.jsp" %>
<%
    String pageName = " | Dealer Account Details";
    String titleName = "Dealer Account Details";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Dealer Account Details";
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
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <!-- /.box-header -->
                                <div class="box-body">
                                    <table  class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>User Id</th>
                                                <th>Customer's Name</th>
                                                <th>Username</th>
                                                <th>Billing Address</th>
                                                <th>Customer's Contact</th>
                                                <th>Total Spending</th>

                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody id="userListing"></tbody>
                                    </table>
                                    <br>
                                    <div id="edit"></div>
                                    <br>
                                    <table id="orders" class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th colspan="2">Transaction ID</th>
                                                <th>Placed On</th>
                                                <th>Cart Total Price</th>
                                                <th>Shipping Cost</th>
                                                <th>Grand Total</th>
                                            </tr>
                                        </thead>
                                        <tbody id="transactionHistory"></tbody>
                                    </table>
                                </div>
                                <!-- /.box-body -->
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
        <script src="js/dealerAccount.js"></script>
    </body>
</html>