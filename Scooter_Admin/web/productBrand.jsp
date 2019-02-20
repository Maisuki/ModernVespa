<%@page import="controller.SNServer"%>
<%@page import="common.Global"%>
<%@page import="com.google.gson.*"%>
<%
    try {
        String POST_URL = Global.BASE_URL + "/retrieveProductBrandNames";
        String POST_PARAMS = "";
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result.toString()).getAsJsonObject();
        JsonArray arr = obj.get("productBrands").getAsJsonArray();
        for (JsonElement elem : arr) {
            String productBrandName = elem.getAsString();
            out.print("<option>" + productBrandName + "</option>");
        }
    } catch (Exception ex) {
        System.out.println(ex.getMessage());
    }
%>