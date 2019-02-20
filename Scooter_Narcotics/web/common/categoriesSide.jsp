<%@page import="controller.SNServer"%>
<%@page import="common.Global"%>
<%@page import="com.google.gson.*"%>

<%
    JsonElement results = SNServer.sendGET(Global.BASE_URL + "/cat");
    JsonObject obj = results.getAsJsonObject();
    JsonArray arr = obj.get("categories").getAsJsonArray();
    for (JsonElement cat : arr) {
        String cname = cat.getAsString();
        String encodedCname = cname.replace("&", "%26");
%>
<li>
    <a href="products.jsp?cat=<%=encodedCname%>&brand=&model=">
        <img src='img/plus.jpg' width='15' height='15' alt />&nbsp;&nbsp;
        <label style="display: inline-flex; width: 89%;"><%=cname%></label>
    </a>
</li>
<%
    }
%>

