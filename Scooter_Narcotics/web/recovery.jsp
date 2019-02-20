<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "Recovery";
    String breadCrumbName = "Login - Recovery";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body>

        <div class="page">
            <%@include file="common/top_panel.jsp" %>

            <!-- page content -->
            <div class="page-content margin-fixed">
                <%@include file="common/titlePanel.jsp" %>
                <div class="page-content-sectiont">
                    <div class="grid-row">
                        <div class="grid-col grid-col-5 nonMobileDisplayOption">
                            <!-- welcome -->
                            <div class="block block-welcome">
                                <h2>Create new account</h2>
                                <p>SIGNUP TODAY AND YOU'LL BE ABLE TO</p>
                                <ul>
                                    <li><i class="fa fa-check-square-o"></i>Online Order Status</li>
                                    <li><i class="fa fa-check-square-o"></i>See Ready Hot Deals</li>
                                    <li><i class="fa fa-check-square-o"></i>Love List</li>
                                    <li><i class="fa fa-check-square-o"></i>Sign up to receive exclusive news and private sales</li>
                                    <li><i class="fa fa-check-square-o"></i>Quick Buy Stuffs</li>
                                </ul>
                                <br>
                                <div class="block-login">
                                    <a href="registration.jsp">
                                        <input type="button" class="button" value="Create Now" />
                                    </a>
                                </div>
                            </div>
                            <!--/ welcome -->
                        </div>
                        <div class="grid-col grid-col-6 grid-col-right">
                            <!-- login -->
                            <div class="block block-login">
                                <div class="block-head">Forgot your password?</div>
                                <p>Enter your e-mail and we will send Account Details.</p>
                                <form id="forgetForm" class="block-cont">
                                    <font id="message" color="red">${message}</font>
                                    <font id="success" color="green"></font>
                                    <br><br>
                                    <div class="input"><input name="email" id="email" type="text" placeholder="Your Email" value="${email}"><i class="fa fa-envelope"></i></div>
                                    <div class="g-recaptcha" data-callback="captchaCallback" data-sitekey="6LdoxT0UAAAAAGvYyTNGbEZ5Ai4E3SGG89EpK72s"></div><br/>
                                    <button type="submit" class="button">Send Me Now</button>
                                    <%--<p><a href="#">Contact Online Support</a></p>--%>
                                </form>
                            </div>
                            <!--/ login -->
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->

            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/recovery.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>