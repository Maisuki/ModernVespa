<%@page import="com.google.gson.JsonObject"%>
<%   
    if (session.getAttribute("user") == null) {
        String url = request.getRequestURI().toString();
        if (url == null) {
            url = "index.jsp";
        }
        
        String queryString = request.getQueryString();
        String[] urlArr = url.split("/Scooter_Admin/");
        String currentFileName = "";
        if (urlArr.length == 0) {
            currentFileName = "index.jsp";
        }
        else {
            currentFileName = urlArr[urlArr.length - 1];
        }
        if (queryString != null) {
            currentFileName += "?" + queryString;
        }
        currentFileName = currentFileName.replaceAll("&", "%26");
        currentFileName = currentFileName.replaceAll("\\?", "%3F");
        response.sendRedirect("login.jsp?page=" + currentFileName + "&message=Session%20Expired%21%20Please%20relogin%21");
        return;
    }
    else{
        JsonObject userObj = (JsonObject)session.getAttribute("user");
        if(!userObj.get("role_id").getAsString().equals("999")){
           response.sendRedirect("index.jsp");
        }  
    }
%>
        