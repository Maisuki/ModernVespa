<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Update related products";
    String titleName = "Update Product - Update related products";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String query = request.getQueryString();
    String hyperlink = path + "?" + query;
    String breadCrumbName = "Update related products";
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
                                <form role="form" action="selectRelatedProducts" method="post">
                                    <div class="row" style="padding-top:10px;padding-left: 20px;padding-right:30px">
                                        <button type="submit" class="btn btn-primary"name="submit" style="float:right">Submit</button>
                                    </div>
                                    <div class="box-body" id="productPanel">
                                        <br>
                                    </div>
                                    <!-- /.box-body -->
                                    <input type="hidden" id="id" name="id" value="<%=request.getParameter("pid")%>"/>
                                    <input type="hidden" id="selectedProducts" name="selectedProducts" value=""/>
                                    <div class="box-footer">
                                        <button type="submit" name="submit"class="btn btn-primary" style="float:right">Submit</button>
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
        <script src="js/updateRelatedProduct.js"></script>
    </body>
</html>
