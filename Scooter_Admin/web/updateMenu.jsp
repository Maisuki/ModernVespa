<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | All Products";
    String titleName = "Update Product";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String query = request.getQueryString();
    String hyperlink = path + "?" + query;
    String breadCrumbName = "Update Menu";
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
                                <div class="box-body">
                                    <br>
                                    <a href="updateProduct.jsp?pid=<%=request.getParameter("pid")%>"> Update Product's Details</a>
                                    <br>
                                    <a href="updateProductBNM.jsp?pid=<%=request.getParameter("pid")%>"> Update Product's Brand and Model</a>
                                    <br>
                                    <a href="updateProductImage.jsp?pid=<%=request.getParameter("pid")%>"> Update Product's Image</a>
                                    <br>
                                    <a href="updateRelatedProduct.jsp?pid=<%=request.getParameter("pid")%>"> Update Related Products</a>
                                </div>
                                <!-- /.box-body -->
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
    </body>
</html>