<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%    String pageName = " | Update Brand & Models";
    String titleName = "Update Brand & Models";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Update Brand & Models";
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
                                <form role="form" id="updateBMForm">
                                    <div class="box-body">
                                        <br>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="brand">Brand Name </label>
                                            <input type="text" class="form-control" id="brand">
                                            <br>
                                            <label>Model List </label>
                                            <div id="modelList">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Models</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="model"></tbody>
                                                </table>
                                            </div>
                                            <button type="button" id="modelAdd" class="btn btn-primary"> Add model</button>
                                        </div>
                                    </div>
                                    <!-- /.box-body -->
                                    <div class="box-footer">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="updateBM" type="submit" class="btn btn-primary">Update</button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick="location.replace('BM.jsp');" type="button" class="btn btn-primary">Return Back to List</button>
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
        <script src="js/updateBM.js"></script>
    </body>
</html>