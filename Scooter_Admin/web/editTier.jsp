<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="roleChecker.jsp" %>
<%
    String pageName = " | Dealer Tier Details";
    String titleName = "Dealer Account - Edit Tier Details";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Dealer Account - Edit Tier Details";
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

                                <div class="box-body">
                                    <br>

                                    <div class="form-group col-sm-6 col-md-8 col-xs-12">
                                        <div class="row">
                                            <form role="form" id="tierMgmtForm">
                                                <div class="col-md-4">
                                                    <h5>Tier:</h5>
                                                </div>
                                                <div class="col-md-4">
                                                    <select class="form-control select2" id="tier"></select>
                                                </div>
                                                <div class="col-md-4">
                                                    <button id="tierBtn" type="submit"  class="btn btn-primary">Change Tier</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="row">
                                            <form role="form" id="pBrandDiscountMgmtForm">
                                                <div class="col-md-4">
                                                    <h5>Select Product Brand:</h5>
                                                </div>
                                                <div class="col-md-4">
                                                    <select class="form-control select2" id="productbrands">
                                                        <option value="">Select Product Brand</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-4">
                                                    <button id="brandDiscountBtn" type="submit"  class="btn btn-primary">Assign Brand Discount</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-6 col-md-12 col-xs-12">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <h5><b>Brand Discount Listings</b></h5>

                                                <div class="box">
                                                    <!-- /.box-header -->
                                                    <div class="box-body">
                                                        <table id="discountTable" class="table table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>Product Brand</th>
                                                                    <th>Discount (%)</th>
                                                                    <th></th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody></tbody>
                                                        </table>
                                                    </div>
                                                    <!-- /.box-body -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
        <script src="js/editTier.js"></script>
    </body>
</html>