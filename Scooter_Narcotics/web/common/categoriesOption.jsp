<%@page import="java.util.*"%>
<%@page import="com.google.gson.*"%>
<%@page import="controller.SNServer"%>
<%@page import="common.Global"%>
<option value="" style="color:black">Categories</option>
<%
    JsonElement results= SNServer.sendGET(Global.BASE_URL + "/categories");
    JsonObject obj = results.getAsJsonObject();
    JsonArray arr = obj.get("categories").getAsJsonArray();
    TreeMap<String, List<String>> catMap = new TreeMap<>();
    List<String> modelList = new ArrayList<>();
    for (JsonElement cat : arr) {
        String categories = ((JsonObject) cat).get("categories").getAsString();
        out.print("<option style='color:black'>" + categories + "</option>");
        JsonArray modelArr = ((JsonObject) cat).get("modelList").getAsJsonArray();
        if (catMap.containsKey(categories)) {
            modelList = (List<String>) catMap.get(categories);
        }
        for (JsonElement model : modelArr) {
            modelList.add(model.getAsString());
        }
        catMap.put(categories, modelList);
        modelList = new ArrayList<>();
        categories = "";
    }
%>