<%
    if (session.getAttribute("user") == null) {
        String request_uri = request.getRequestURI();
        String url = "";
        if (request_uri == null) {
            url = "index.jsp";
        }
        else {
            url = request_uri.toString();
        }
        
        String params = request.getQueryString();
        String[] urlArr = url.split("/Scooter_Admin/");
        String currentFileName = "";
        if (urlArr.length == 0) {
            currentFileName = "index.jsp";
        }
        else {
            currentFileName = urlArr[urlArr.length - 1];
        }
        
        if (params != null) {
            currentFileName += "?" + params;
        }
        currentFileName = currentFileName.replaceAll("&", "%26");
        currentFileName = currentFileName.replaceAll("\\?", "%3F");
        response.sendRedirect("login.jsp?page=" + currentFileName + "&message=Session%20Expired%21%20Please%20relogin%21");
        return;
    }
%>
