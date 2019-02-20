<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | All Products";
    String titleName = "Update Product - Select Brand and Model";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String query = request.getQueryString();
    String hyperlink = path + "?" + query;
    String breadCrumbName = "Update Brand & Model";
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
                                <form id="updateBNM" role="form">
                                    <div style="padding-top:10px;padding-left: 10px;padding-right:10px">
                                        <input type="checkbox" id="selectAllTop" /><Strong>Select all brand and model</strong>
                                        <div style="display: inline-block; margin-left: 50px;">
                                            <label for="search">Filter: </label>&emsp;
                                            <input type="text" id="search" placeholder="Search" />
                                            <input type="button" id="searchBtn" value="Search" style="margin-left: 20px;" />
                                            <div id="filter" style="display: none; margin-left: 20px;">
                                                <img src="img/spinner.gif" width="20" height="20">
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary"name="submit" style="float:right">Update</button>
                                    </div>
                                    <div id="bnmList" class="box-body">
                                        <br>
                                    </div>
                                    <!-- /.box-body -->
                                    <input type="hidden" id="pId" name="id" value="<%=request.getParameter("pid")%>" />
                                    <input type="hidden" id="json" name="json" />
                                    <div class="box-footer">
                                        <input type="checkbox" id="selectAllBtm" name="selectall" /><strong>Select all brand and model</strong>
                                        <button type="submit" name="submit"class="btn btn-primary" style="float:right">Update</button>
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
        <script src="js/updateProductBNM.js"></script>
    </body>
</html>