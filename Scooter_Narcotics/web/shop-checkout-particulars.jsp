<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI() +       // "/people"
             "?" +                           // "?"
             request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = "";
    String titleName = "Checkout";
    String breadCrumbName = "Shop - Checkout";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=shop-checkout-particulars.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
    %>
    <body>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>
            
            <%@include file="common/titlePanel.jsp" %>

            <!-- page content -->
            <div class="page-content">						
                <div class="page-content-section margin-fixed-account" id="shipDetails">
                    <h3 align="center" class="block-head-4" style="padding: 0px 10px 30px 0px;">Shipping Particulars</h3>

                    <div class="grid-row">
                        <p style='color:red;' id="shipError"></p>
                        <div style="margin-top: 20px;" class="grid-col grid-col-5 grid-col-left">
                            <!-- checkout address -->
                            <div class="block block-checkout-address">
                                <div class="block-head">Billing Address</div>
                                <div class="block-cont">
                                    <div class="select" id="BillingCountry" >
                                        <select id="country" style="color:#fff">
                                            <jsp:include page="common/countries.jsp"></jsp:include>
                                        </select>
                                    </div>									

                                    <div class="input-small">
                                        <input id="bFname" type="text" placeholder="First Name">
                                    </div><!--
                                    --><div class="input-small">
                                        <input id="bLname" type="text" placeholder="Last Name">
                                    </div>
                                    <div class="input">
                                        <input id="bCname"type="text" placeholder="Company Name">
                                    </div>
                                    <div class="input">
                                        <input id="bAdd"type="text" placeholder="Address">
                                    </div>
                                    <div class="input">
                                        <input id="bCity"type="text" placeholder="Town / City">
                                    </div>
                                    <div class="input">
                                        <input id="bState" type="text" placeholder="State ">
                                    </div>

                                    <div class="input-small">
                                        <input id="bZip" type="text" placeholder="Postcode / ZIP">
                                    </div><!--
                                    --><div class="input-small">
                                        <input id="bPhone" type="text" placeholder="Phone">
                                    </div>
                                </div>
                            </div>
                            <!-- checkout address -->
                        </div>

                        <div style="margin-top: 20px;" class="grid-col grid-col-6 grid-col-right">
                            <!-- checkout address -->
                            <div class="block block-checkout-address">
                                <div class="block-head">Shipping Address</div>
                                <label class="checkbox mobile-billing-address"><input type="checkbox" id="sameAdd"><i class="fa fa-check"></i>Ship to Billing Address</label>
                                <div class="block-cont">
                                    <div class="select">
                                        <select id="sCountry" style="color:#fff">
                                            <jsp:include page="common/countries.jsp"></jsp:include>
                                        </select>
                                    </div>									

                                    <div class="input-small">
                                        <input type="text" placeholder="First Name" id="fname">
                                    </div><!--
                                    --><div class="input-small">
                                        <input id="lname" type="text" placeholder="Last Name">
                                    </div>

                                    <div class="input">
                                        <input type="text" placeholder="Company Name" id="cname">
                                    </div>
                                    <div class="input">
                                        <input type="text" placeholder="Address"id="add">
                                    </div>
                                    <div class="input">
                                        <input type="text" placeholder="Town / City" id="city">
                                    </div>
                                    <div class="input">
                                        <input type="text" placeholder="State" id="state">
                                    </div>

                                    <div class="input-small">
                                        <input type="text" placeholder="Postcode / ZIP" id="zip">
                                    </div><!--
                                    --><div class="input-small">
                                        <input type="text" placeholder="Phone" id="phone">
                                    </div>
                                </div>
                        </div>
                            <!-- checkout address -->						
                        </div>
                        <div class="block block-shopping-cart-totals">
                            <a style="width: 95%; margin-left: -3px;" class="button" onclick="proceed()">Choose Shipping Method</a>
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->
            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/shop-checkout-particulars.js"></script>
        <%
            if (request.getParameter("option") != null) {
                if (request.getParameter("option").toString().equals("SL")) {
                    session.setAttribute("shipNow", false);
                } else if (request.getParameter("option").toString().equals("SH")) {
                    session.setAttribute("SH", true);
                    session.setAttribute("shipNow", true);
                }
            } else {
                session.setAttribute("shipNow", true);
            }
        %>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>