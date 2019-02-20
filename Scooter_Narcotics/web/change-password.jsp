<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "Update Password";
    String breadCrumbName = "Update Password";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=change-password.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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
                                    <a href="#block-product-tabs-1" class="active">Update Password</a>
                                </div>
                                <div id="block-product-tabs-1" class="cont active">
                                    <form id="updateForm" class="block-cont">
                                        <div class="input">
                                            <font id="message" color="red">${message}</font>
                                        </div>
                                        <br>
                                        <div class="input">
                                            <input type="password" class="updatePass" id="currentPassword" name="currentPassword" placeholder="Current Password" required>
                                            <i class="fa fa-lock"></i>
                                        </div>
                                        <br>
                                        <div class="input">
                                            <input type="password" id="password" class="updatePass" name="newpassword" placeholder="New Password" required>
                                            <i class="fa fa-lock"></i>
                                        </div>
                                        <div id="pswd_info" class="sub">
                                            <strong>Password must meet the following requirements:</strong>
                                            <br><br>
                                            <ul>
                                                <li id="letter" class="invalid">At least <strong>one letter</strong></li>
                                                <li id="capital" class="invalid">At least <strong>one capital letter</strong></li>
                                                <li id="number" class="invalid">At least <strong>one number 0-9</strong></li>
                                                <li id="number" class="invalid">At least <strong>one "@#$%"</strong></li>
                                                <li id="length" class="invalid">Be at least <strong>6 characters with maximum 20characters</strong></li>
                                            </ul>
                                        </div>
                                        <br>
                                        <div class="input">
                                            <input type="password" class="updatePass" id="cfmPassword" name="cfmpassword" placeholder="Confirm password" required>
                                            <i class="fa fa-lock"></i>
                                        </div>
                                        <br/>
                                        <div class="g-recaptcha" data-callback="captchaCallback" data-sitekey="6LdoxT0UAAAAAGvYyTNGbEZ5Ai4E3SGG89EpK72s" style="transform:scale(0.88);-webkit-transform:scale(0.88);transform-origin:0 0;-webkit-transform-origin:0 0;"></div>
                                        <br/>
                                        <div class="nonMobileDisplayOption grid-col" style="margin-left: 0px;">
                                            <button type="submit" class="button">Update Password</button>
                                            <button id="cancelDesktop" type="cancel" class="button">Cancel</button>
                                        </div>
                                        <div align="center" class="grid-col-right mobileDisplayOption">
                                            <button style="padding: 0 15px;" type="submit" class="button">Update Password</button>
                                            <button style="padding: 0 15px;" id="cancelMobile" type="cancel" class="button">Cancel</button>
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
        <script src="js/change-password.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>