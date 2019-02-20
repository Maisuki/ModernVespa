<%@page import="java.util.*"%>
<%@page import="com.google.gson.*"%>
<%@page import="common.Global"%>
<%@page import="controller.SNServer"%>
<option value="" style="color:black">Select Brand</option>
<%
    JsonElement result = SNServer.sendGET(Global.BASE_URL + "/bnm");
    JsonObject bnmObj = result.getAsJsonObject();
    JsonArray bnmArr = bnmObj.get("bnm").getAsJsonArray();
    TreeMap<String, List<String>> bnmMap = new TreeMap<>();
    List<String> modelList = new ArrayList<>();
    for (JsonElement bnm : bnmArr) {
        String brand = ((JsonObject) bnm).get("brand").getAsString();
        JsonArray modelArr = ((JsonObject) bnm).get("modelList").getAsJsonArray();
        if (bnmMap.containsKey(brand)) {
            modelList = (List<String>) bnmMap.get(brand);
        }
        for (JsonElement model : modelArr) {
            modelList.add(model.getAsString());

        }
        bnmMap.put(brand, modelList);
        modelList = new ArrayList<>();
%>
<option style='color:black'><%=brand%></option>
<%
    }
    request.getSession().setAttribute("bnm", bnmMap);
%>