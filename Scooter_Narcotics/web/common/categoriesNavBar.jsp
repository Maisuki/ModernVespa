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
<li class="mobile-nav-display-full">
    <a style="padding-left: 0px;" href="products.jsp?cat=<%=encodedCname%>&brand=&model=" class="user-summary">
        <i style="margin-left: 320px;" class="fa fa-chevron-right"></i>
        <label style="width: 280px;"><%=cname%></label>
    </a>
</li>
<%
    }
%>