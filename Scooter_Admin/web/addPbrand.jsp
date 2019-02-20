<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Add Product Brand";
    String titleName = "Add Product Brands";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Add Product Brands";
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
                        <!-- left column -->
                        <div class="col-md-12">
                            <!-- general form elements -->
                            <div class="box box-primary">
                                <!-- /.box-header -->
                                <!-- form start -->
                                <form role="form" id="addPbrandForm">
                                    <div class="box-body">
                                        <br>
                                        <div class="form-group col-sm-12 col-xs-12">
                                            <label for="productbrand">New Product Brand</label>
                                            <input id="productbrand" type="text" class="form-control" placeholder="Enter new Product Brand" required>
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t1bd">Tier 1 Brand Discount</label>
                                            <input id="t1bd" type="number" step="0.01" value="0.00" class="form-control" placeholder="Enter Tier 1 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t2bd">Tier 2 Brand Discount</label>
                                            <input id="t2bd" type="number" step="0.01" value="0.00" class="form-control" placeholder="Enter Tier 2 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t3bd">Tier 3 Brand Discount</label>
                                            <input id="t3bd" type="number" step="0.01" value="0.00" class="form-control" placeholder="Enter Tier 3 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t4bd">Tier 4 Brand Discount</label>
                                            <input id="t4bd" type="number" step="0.01" value="0.00" class="form-control" placeholder="Enter Tier 4 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t4bd">Product Brand Image</label>
                                            <input id="pbrandImage" type="file" class="form-control">
                                        </div>
                                    </div>
                                    <!-- /.box-body -->
                                    <div class="box-footer">
                                        &emsp;<button id="addPbrand" type="submit" class="btn btn-primary">Submit</button>&emsp;
                                        <button onclick="location.replace('pbrand.jsp');" type="button"  class="btn btn-primary">Back to List</button>
                                    </div>
                                </form>
                            </div>
                            <!-- /.box -->
                        </div>
                        <!--/.col (left) -->
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
        <script src="js/addPbrand.js"></script>
    </body>
</html>