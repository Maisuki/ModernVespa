<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Add Categories";
    String titleName = "Add Categories";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Add Categories";
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
                                <form id="addCatForm" role="form">
                                    <div class="box-body">
                                        <br>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="categoryName">New Category</label>
                                            <input type="text" class="form-control" name="catName" id="catName" placeholder="Enter new Category name">
                                        </div>
                                    </div>
                                    <!-- /.box-body -->
                                    <div class="box-footer">
                                        &emsp;<button id="addCat" type="submit" class="btn btn-primary">Submit</button>&emsp;
                                        <button onclick="location.replace('cat.jsp');" type="button"  class="btn btn-primary">Back to List</button>
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
        <script src="js/addCat.js"></script>
    </body>
</html>