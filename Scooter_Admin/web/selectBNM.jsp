<%@page import="common.StringEntityTranslator"%>
<%@page import="java.util.*"%>
<%@page import="com.google.gson.*"%>
<%@page import="controller.SNServer"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Select Brand and Model";
    String titleName = "Add Product - Select Brand and Model";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String query = request.getQueryString();
    String hyperlink = path + "?" + query;
    String breadCrumbName = "Select Brand and Model";
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
                                <form role="form" action="selectBnM" method="post">
                                    <div style="padding-top:10px;padding-left: 20px;padding-right:30px">
                                        <input type="checkbox" id="selectAllTop" /><Strong>Select all brand and model</strong>
                                        <div style="display: inline-block; margin-left: 50px;">
                                            <label for="search">Filter: </label>&emsp;
                                            <input type="text" id="search" placeholder="Search" />
                                            <input type="button" id="searchBtn" value="Search" style="margin-left: 20px;" />
                                            <div id="filter" style="display: none; margin-left: 20px;">
                                                <img src="img/spinner.gif" width="20" height="20">
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary"name="submit" style="float:right">Submit</button>
                                    </div>
                                    <div class="box-body">
                                        <br>
                                        <%
                                            String allBnM = "";
                                            if (request.getParameter("name") != null) {
                                                out.print("<input type='hidden' value='" + request.getParameter("name") + "' id='name'/>");
                                            }
                                            
                                            String results = SNServer.sendGET(Global.BASE_URL + "/bnm");
                                            JsonObject obj = new JsonParser().parse(results.toString()).getAsJsonObject();
                                            JsonArray arr = obj.get("bnm").getAsJsonArray();
                                            JsonObject bnmList = new JsonObject();
                                            JsonArray bnmArr = new JsonArray();

                                            TreeMap<String, List<String>> bnmMap = new TreeMap<>();
                                            List<String> modelList = new ArrayList<>();
                                            for (JsonElement bnm : arr) {
                                                JsonArray modelListArray = new JsonArray(); 
                                                out.print("<div class='form-group col-sm-6 col-xs-12'>");
                                                String brand = ((JsonObject) bnm).get("brand").getAsString();

                                                brand = StringEntityTranslator.translate(brand);

                                                out.print("<h1 class='brandtitle'>" + brand + "</h1>");
                                                JsonArray modelArr = ((JsonObject) bnm).get("modelList").getAsJsonArray();
                                                out.print("<br>");
                                                for (JsonElement model : modelArr) {
                                                    String modelString = StringEntityTranslator.translate(model.getAsString());
                                                    out.print("<input type='checkbox' name='models' class='models' value='" + modelString + "'/>&emsp;");
                                                    out.print("<span class='modelsName'>" + modelString + "</span><br>");
                                                    modelListArray.add(model.getAsString());
                                                }
                                                bnmList.addProperty("brand", brand);
                                                bnmList.add("modelList", modelListArray);
                                                bnmArr.add(bnmList);
                                                bnmList= new JsonObject();
                                                out.print("</div>");
                                                brand = "";
                                            }

                                            allBnM = bnmArr.toString();
                                            String temp = "";
                                            for (int i = 0; i < allBnM.length(); i++) {
                                                char current = allBnM.charAt(i);
                                                int charCode = allBnM.codePointAt(i);
                                                if (charCode != 194) {
                                                    temp += current;
                                                } 
                                            }
                                            allBnM = temp;
                                        %>
                                    </div>
                                    <!-- /.box-body -->
                                    <input type="hidden" id="id" name="id" value="<%=request.getParameter("_id")%>"/>
                                    <input type="hidden" id="json" name="json" value=""/>
                                    <input type="hidden" id="selectedBrand" name="selectedBrand" value=""/>
                                    <div class="box-footer">
                                        <input type="checkbox" id="selectAllBtm" name="selectall" /><strong>Select all brand and model</strong>
                                        <button type="submit" name="submit"class="btn btn-primary" style="float:right">Proceed to choose related products</button>
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
        <script src="js/selectBNM.js"></script>
    </body>
</html>