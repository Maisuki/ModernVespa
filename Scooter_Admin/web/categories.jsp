<%@page import="controller.SNServer"%>
<%@page import="common.Global"%>
<%@page import="com.google.gson.*"%>
<%
    try {
        String GET_URL = Global.BASE_URL + "/cat";
        String result = SNServer.sendGET(GET_URL);
        JsonObject obj = new JsonParser().parse(result.toString()).getAsJsonObject();
        JsonArray arr = obj.get("categories").getAsJsonArray();
        for (JsonElement elem : arr) {
            String productBrandName = elem.getAsString();
            out.print("<option>" + productBrandName + "</option>");
        }
    } catch (Exception ex) {
        System.out.println(ex.getMessage());
    }
%>