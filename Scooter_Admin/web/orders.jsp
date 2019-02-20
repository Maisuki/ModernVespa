<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="roleChecker.jsp" %>
<%
    String pageName = " | All Orders";
    String titleName = "All Orders";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "All Orders";
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
                                    <table id="orders" class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Transaction ID</th>
                                                <th>Placed On</th>
                                                <th>Total Price</th>
                                                <th>Customer</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tranList"></tbody>
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
        <script src="js/orders.js"></script>
    </body>
</html>