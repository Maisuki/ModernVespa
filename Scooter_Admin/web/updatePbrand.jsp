<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Update Product Brand";
    String titleName = "Update Product Brand";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Update Product Brand";
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
                                <form role="form" id="updatePbrandForm">
                                    <div class="box-body">
                                        <font color="red">${message}</font>
                                        <input id="pbID" type="hidden" class="form-control" name="pbID">
                                        <br>
                                        <div class="form-group col-sm-12 col-xs-12">
                                            <label for="productbrand">New Product Brand</label>
                                            <input id="productbrand" type="text" class="form-control" name="pbrand" placeholder="Enter new Product Brand" required>
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t1bd">Tier 1 Brand Discount</label>
                                            <input id="t1bd" type="number" step="0.01" value="0.00" class="form-control" name="t1bd" placeholder="Enter Tier 1 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t2bd">Tier 2 Brand Discount</label>
                                            <input id="t2bd" type="number" step="0.01" value="0.00" class="form-control" name="t2bd" placeholder="Enter Tier 2 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t3bd">Tier 3 Brand Discount</label>
                                            <input id="t3bd" type="number" step="0.01" value="0.00" class="form-control" name="t3bd" placeholder="Enter Tier 3 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="t4bd">Tier 4 Brand Discount</label>
                                            <input id="t4bd" type="number" step="0.01" value="0.00" class="form-control" name="t4bd" placeholder="Enter Tier 4 Brand Discount">
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="pbrandImage">Product Brand Image</label>
                                            <br>
                                            <input type="button" id="pbrandImageBtn" class="btn btn-primary" value="Replace with New Image" />
                                            <input id="pbrandImageFileChooser" type="file" class="form-control">
                                            <br><br>
                                            <img id="pbrandImage" width="300" height="250" />
                                        </div>
                                    </div>
                                    <!-- /.box-body -->
                                    <div class="box-footer">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="updatePBrand" type="submit" class="btn btn-primary">Update</button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick="location.replace('pbrand.jsp');" type="button" class="btn btn-primary">Return Back to List</button>
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
        <script src="js/updatePbrand.js"></script>
    </body>
</html>