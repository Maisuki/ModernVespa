<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Dealer Tier Assignment";
    String titleName = "Dealer Tier Assignment";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Dealer Tier Assignment";
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
                                <form role="form" id="tierAssignForm">
                                    <div class="box-body">
                                        <br>
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="tierGroup">Tier Assignment</label>
                                            <select class="form-control select2" id="tierGroup" name="tierGroup" style="width: 100%;">
                                                <option value="">Choose Tier</option>
                                                <%  for (int i = 1; i <= 4; i++) { %>
                                                <option value='<%=i%>'>Tier <%=i%></option>
                                                <%  } %>
                                            </select>
                                        </div>
                                    </div> 
                                    <!-- /.box-body -->
                                    <div class="box-footer">
                                        <button type="submit"  class="btn btn-primary" style="float:right">Set Tier</button>
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
        <script src="js/assignTier.js"></script>
    </body>
</html>