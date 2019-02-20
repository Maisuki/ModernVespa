<%@page import="controller.SNServer"%>
<%@page import="com.google.gson.*"%>
<option value="0" disabled selected>Select a Country</option>
<%
    JsonElement results = SNServer.sendGET("https://restcountries.eu/rest/v2/all");
    JsonArray countriesArr = results.getAsJsonArray();
    for (JsonElement country : countriesArr) {
        JsonObject obj = country.getAsJsonObject();
        String countryName = obj.get("name").getAsString();
%>
<option style="color: black;" value="<%=countryName%>"><%=countryName%></option>
<%
    }
%>