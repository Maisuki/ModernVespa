<%@page import="common.Global"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = " | Edit Personal Particulars";
    String titleName = "Personal Particulars";
    String breadCrumbName = "My Profile";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=personalinfo.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
    %>
    <body>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>
            
            <%@include file="common/titlePanel.jsp" %>
            
            <!-- page content -->
            <div class="page-content">						
                <div class="page-content-section margin-fixed-account">
                    <div class="grid-row">
                        <%@include file="common/authorizedUserSidebar.jsp" %>
                        
                        <div class="grid-col grid-col-right grid-col-8">
                            <!-- account dashboard tabs -->	
                            <div class="block block-product-tabs block-login">
                                <div class="head">
                                    <a href="#block-product-tabs-1" class="active">Edit Personal Information</a>
                                </div>
                                <div id="block-product-tabs-1" class="cont active">
                                    <form id="userDetailForm" class="block-cont">
                                        <div class="input">
                                            <font id="message" color="red">${message}</font>
                                        </div>
                                        <br>
                                        <div class="input">
                                            <input type="text" id="fname" class="formElements" name="fname" placeholder="First Name" required>
                                            <i class="fa fa-user"></i>
                                        </div>
                                        <div class="input">
                                            <input type="text" id="lname" class="formElements" name="lname" placeholder="Last Name" required>
                                            <i class="fa fa-user"></i>
                                        </div>
                                        <%
                                            JsonObject user = (JsonObject) session.getAttribute("user");
                                            String account_created_via = user.get("account_created_via").getAsString();
                                            if (!account_created_via.equals("fb")) {
                                        %>
                                        <div style="<%=(account_created_via.equals("fb") ? "visibility: hidden;" : "")%>" class="input">
                                            <input type="text" id="username" class="formElements" name="username" placeholder="Your Username" required>
                                            <i class="fa fa-user"></i>
                                        </div>
                                        <%
                                            }
                                        %>
                                        <div class="input">
                                            <input type="email" id ="email" class="formElements" name="email" placeholder="Your Email" required>
                                            <i class="fa fa-envelope"></i>
                                        </div>
                                        <div class="input">
                                            <input type="tel" id="phone" class="formElements" name="contact" placeholder="Phone Number" required>
                                            <i class="fa fa-phone"></i>
                                        </div>
                                        <div class="input">
                                            <input type="text" id="street" class="formElements" name ="street" placeholder="Street" required>
                                            <i class="fa fa-globe"></i>
                                        </div>
                                        <div class="input">
                                            <input type="text" id="city" class="formElements" name ="city" placeholder="City" required>
                                            <i class="fa fa-globe"></i>
                                        </div>
                                        <div class="input">
                                            <input type="text" id="zip" class="formElements" name ="zip" placeholder="Zip" required>
                                            <i class="fa fa-globe"></i>
                                        </div>
                                        <div class="input">
                                            <input type="text" id="state" class="formElements" name ="state" placeholder="State" required>
                                            <i class="fa fa-globe"></i>
                                        </div>
                                        <div class="input">
                                            <select id="country" class="formElements" name="country" required style="color:#fff">
                                                <jsp:include page="common/countries.jsp"></jsp:include>
                                            </select>
                                            <i class="fa fa-globe"></i>
                                        </div>
                                        <br/>
                                        <div class="g-recaptcha" data-callback="captchaCallback" data-sitekey="6LdoxT0UAAAAAGvYyTNGbEZ5Ai4E3SGG89EpK72s"></div>
                                        <br/>
                                        <div class="grid-col nonMobileDisplayOption" style="margin-left: 0px;">
                                            <button type="submit" class="button">Save</button>
                                            <button id="cancelDesktop" type="cancel" class="button">Cancel</button>
                                        </div>
                                        <div align="center" class="mobileDisplayOption">
                                            <button type="submit" class="button">Save</button>
                                            <button id="cancelMobile" type="cancel" class="button">Cancel</button>
                                        </div>
                                        <br>
                                    </form>
                                    <br>
                                    <br>
                                </div>
                            </div>
                            <!--/ account dashboard tabs -->
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->
            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/personalinfo.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>