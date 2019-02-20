<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "My Orders";
    String breadCrumbName = "My Orders";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=orders.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
    %>

    <body onload="myFunction()" style="margin:0;">
        <div id="loader"></div>
        <div style="display:none;" id="myDiv" class="page">
            <%@include file="common/top_panel.jsp" %>
            
            <%@include file="common/titlePanel.jsp" %>

            <!-- page content -->
            <div class="page-content ">						
                <div class="page-content-section margin-fixed-account">
                    <div class="grid-row">
                        <%@include file="common/authorizedUserSidebar.jsp" %>
                        <div class="grid-col grid-col-right grid-col-8">
                            <!-- orders tabs -->	
                            <div class="widget-head-2" style="color: #a6eb14">Recent Orders </div>

                            <div class="select">
                                <select id="sortByDate" onchange="GetSelectedDate(this)" style="color: #fff; border-radius: 5px"> 
                                    <option value="0" style="color:black"> SORT BY: </option>
                                </select>
                            </div>
                            <br>
                            <br>
                            <div class="block block-shopping-cart" id="transactionHistory"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->

            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/orders.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>