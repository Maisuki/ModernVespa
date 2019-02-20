<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = " | Account Dashboard";
    String titleName = "Account Dashboard";
    String breadCrumbName = "My Profile";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        System.out.println(session.getAttribute("user"));
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=account.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
    %>
    <body onload="myFunction()" style="margin:0;">
        <div id="loader"></div>
        <div style="display:none;" id="myDiv" class="page">
            <%@include file="common/top_panel.jsp" %>
            
            <%@include file="common/titlePanel.jsp" %>

            <!-- page content -->
            <div class="page-content">						
                <div class="page-content-section margin-fixed-account">
                    <div class="grid-row">
                        <%@include file="common/authorizedUserSidebar.jsp" %>
                        
                        <div class="grid-col grid-col-right grid-col-8">
                            <!-- account dashboard tabs -->	
                            <div class="widget-head-2">Account Dashboard</div>
                            <div class="block block-product-tabs">
                                <div class="head">
                                    <a href="#block-product-tabs-1" class="active">Personal Information</a>
                                    <a href="#block-product-tabs-3">Billing Address</a>
                                </div>
                                <div id="block-product-tabs-1" class="cont active">
                                    <p style="font-size: 16px">
                                        <a href="personalinfo.jsp" style="float: right; font-size: 16px;"><i class="fa fa-edit"></i> &nbsp; Edit</a>
                                        <b style="text-transform: uppercase; font-size: 18px"><%=session.getAttribute("name")%></b>
                                        <br><br>
                                        <i class="fa fa-envelope"></i> &nbsp; <%=session.getAttribute("email")%>
                                        <br>
                                    </p>
                                    <% 
                                        JsonObject user = (JsonObject) session.getAttribute("user");
                                        String account_created_via = user.get("account_created_via").getAsString();
                                        if (!account_created_via.equals("fb")) {
                                    %>
                                    <p><a href="change-password.jsp">CHANGE PASSWORD</a></p>
                                    <%
                                        }
                                    %>
                                </div>

                                <div id="block-product-tabs-3" class="cont">
                                    <p>
                                        <a href="personalinfo.jsp" style="float: right; font-size: 16px;"><i class="fa fa-edit"></i> &nbsp; Edit</a>
                                        <span id="billAdd"></span>
                                        <br>
                                    </p>
                                </div>

                            </div>
                            <!--/ account dashboard tabs -->

                            <!-- orders tabs -->	
                            <div class="widget-head-2">Recent Orders  <span style="margin-left:45%;" id="amountSpent"></span></div>
                            <div class="block block-shopping-cart">
                                <table id ="transactionHistory">
                                    <tr>
                                        <th colspan="2">Transaction ID</th>
                                        <th class="mobile-nav-display-none" align="center">Placed On</th>
                                        <th class="mobile-nav-display-none-1" align="center">Total</th>
                                        <th class="mobile-nav-display-none" align="center">Shipping Cost</th>
                                        <th></th>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->

            <jsp:include page="common/footer.jsp"/>\
        </div>

        <%@include file="common/footer-imports.jsp" %>
        <script src="js/account.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>