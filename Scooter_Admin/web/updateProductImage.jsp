<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | All Products";
    String titleName = "Update Product - Upload Product Image";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String query = request.getQueryString();
    String hyperlink = path + "?" + query;
    String breadCrumbName = "Update Product Image";
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
                                <form role="form" action="updateImage" enctype='multipart/form-data' method="post">
                                    <div class="box-body">
                                        <br>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="fileUploader">Product Image</label>
                                            <input type="file" name="file" multiple>
                                            <p class="help-block">product.jpg</p>
                                            <div class="col-xs-12">
                                                <div class="box">
                                                    <!-- /.box-header -->
                                                    <div class="box-body">
                                                        <table id="imageList" class="table table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>Current Images</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody></tbody>
                                                        </table>
                                                    </div>
                                                    <!-- /.box-body -->
                                                </div>
                                                <!-- /.box -->
                                            </div>
                                            <div id="pImg"></div>
                                        </div>
                                        <input type="hidden" name="pid" value="${param.pid}" >
                                    </div>
                                    <!-- /.box-body -->

                                    <div class="box-footer">
                                        <label>
                                            Please ensure that all images are within the same folder.
                                        </label>
                                        <button type="submit" class="btn btn-primary" name="upload" style="float:right">Submit</button>
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
        <script src="js/updateProductImage.js"></script>
    </body>
</html>