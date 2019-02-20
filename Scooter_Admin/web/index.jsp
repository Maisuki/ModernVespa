<%@page import="common.Global"%>
<%@page import="com.google.gson.JsonElement"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="com.google.gson.JsonParser"%>
<%@page import="controller.SNServer"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Dashboard";
    String titleName = "Dashboard";
    String hyperlink = "index.jsp";
    String breadCrumbName = "Dashboard";
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
                    <!-- Main row -->
                    <div class="row">
                        <!-- /.col -->
                        <div class="col-md-5">
                            <!-- PRODUCT LIST -->
                            <div class="box box-primary">
                                <div class="box-header with-border">
                                    <h3 class="box-title">Recently Added Products</h3>
                                </div>
                                <!-- /.box-header -->
                                <div class="box-body">
                                    <ul class="products-list product-list-in-box">
                                        <%
                                            String POST_URL = Global.BASE_URL + "/retrieveRecentlyAdded";
                                            String POST_PARAMS = "";
                                            String results = SNServer.sendPOST(POST_URL, POST_PARAMS);
                                            JsonObject resObj = new JsonParser().parse(results).getAsJsonObject();
                                            boolean status = resObj.get("status").getAsBoolean();
                                            JsonArray prodList = new JsonArray();
                                            if (status) {
                                                prodList = resObj.get("products").getAsJsonArray();
                                            }
                                            for (JsonElement elem : prodList) {
                                                JsonObject product = elem.getAsJsonObject();
                                                String id = product.get("_id").getAsString();
                                                JsonElement img = product.get("img");
                                                String prodImage = "";
                                                if (img == null || img.getAsJsonArray().size() == 0) {
                                                    prodImage = "img/coming_soon.jpg";
                                                }
                                                else {
                                                    JsonArray images = product.get("img").getAsJsonArray();
                                                    prodImage = Global.BASE_URL + "/" + images.get(0).getAsString();
                                                }
                                                String url = "updateMenu.jsp?pid=" + id;
                                        %>
                                        <li class="item">
                                            <div class="product-img">
                                                <img src="<%=prodImage%>" alt="Product Image">
                                            </div>
                                            <div class="product-info">
                                                <a href="<%=url%>" class="product-title"><%=product.get("name").getAsString()%>
                                                    <span class="label label-info pull-right"><%=product.get("localprice").getAsString()%> SGD</span></a>
                                                <span class="product-description">
                                                    <%=product.get("desc").getAsString()%>
                                                </span>
                                            </div>
                                        </li>
                                        <%
                                            }
                                        %>
                                    </ul>
                                </div>
                                <!-- /.box-body -->
                                <div class="box-footer text-center">
                                    <a href="products.jsp" class="uppercase">View All Products</a>
                                </div>
                                <!-- /.box-footer -->
                            </div>
                            <!-- /.box -->
                        </div>
                        <!-- /.col -->
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