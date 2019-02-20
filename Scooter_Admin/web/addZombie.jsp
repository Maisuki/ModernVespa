<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="roleChecker.jsp" %>
<%
    String pageName = " | Add Zombie Accounts";
    String titleName = "Add Zombie Accounts";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Add Zombie Accounts";
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
                                <form role="form" id="addZombieForm">
                                    <div class="box-body">
                                        <br>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="username">Username</label>
                                            <input type="text" class="form-control" id="username" placeholder="Enter username" required>
                                        </div>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="password">Password</label>
                                            <input type="password" class="form-control" id="password" placeholder="Enter password" required>
                                        </div>
                                        <div align="center" class="box-footer">
                                            <button id="addZombie" type="submit"  class="btn btn-primary">Add Zombie</button>&emsp;
                                            <button onclick="location.replace('zombieManager.jsp');" type="button"  class="btn btn-primary">Back to List</button>
                                        </div>
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
        <script src="js/addZombie.js"></script>
    </body>
</html>