<%@page import="com.google.gson.*"%>
<%@page import="controller.SNServer"%>
<%
    JsonElement result = SNServer.sendGET("https://ssl.geoplugin.net/json.gp?k=6e84138e92121b36");
    //JsonElement result = SNServer.sendGET("http://www.geoplugin.net/json.gp");
    JsonObject obj = result.getAsJsonObject();
    String geoplugin_city = obj.get("geoplugin_city").getAsString();
    String geoplugin_region = obj.get("geoplugin_region").getAsString();
    String geoplugin_regionCode = obj.get("geoplugin_regionCode").getAsString();
    String geoplugin_regionName = obj.get("geoplugin_regionName").getAsString();
    String geoplugin_countryCode = obj.get("geoplugin_countryCode").getAsString();
    String geoplugin_countryName = obj.get("geoplugin_countryName").getAsString();
    String geoplugin_continentCode = obj.get("geoplugin_continentCode").getAsString();
    String geoplugin_continentName = obj.get("geoplugin_continentName").getAsString();
    double geoplugin_latitude = obj.get("geoplugin_latitude").getAsDouble();
    double geoplugin_longitude = obj.get("geoplugin_longitude").getAsDouble();
    double geoplugin_locationAccuracyRadius = obj.get("geoplugin_locationAccuracyRadius").getAsDouble();
    String geoplugin_timezone = obj.get("geoplugin_timezone").getAsString();
    String geoplugin_currencyCode = obj.get("geoplugin_currencyCode").getAsString();
    String geoplugin_currencySymbol = obj.get("geoplugin_currencySymbol").getAsString();
    String geoplugin_currencySymbol_UTF8 = obj.get("geoplugin_currencySymbol_UTF8").getAsString();
    double geoplugin_currencyConverter = obj.get("geoplugin_currencyConverter").getAsDouble();
%>