<%@page import="controller.SNServer"%>
<%@page import="common.Global"%>
<%@page import="com.google.gson.*"%>

<option value="">Select Category</option>
<%
    JsonElement result = SNServer.sendGET(Global.BASE_URL + "/cat");
    JsonObject catObj = result.getAsJsonObject();
    JsonArray catArr = catObj.get("categories").getAsJsonArray();

    for (JsonElement cat : catArr) {
        String cname = cat.getAsString();
%>
<option value="<%=cname%>">
    <a href="products.jsp?cat=<%=cname%>">
        <i class="fa fa-plus-square-o"></i>
        <%=cname%>
    </a>
</option>
<%
    }
%>

