<%@page import="java.util.Enumeration"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://"
            + // "http" + "://
            request.getServerName()
            + // "myhost"
            request.getRequestURI()
            + // "/people"
            "?"
            + // "?"
            request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = " | Login";
    String titleName = "Login";
    String breadCrumbName = "Login";

    if (session.getAttribute("user") != null) {
        response.sendRedirect("index.jsp");
        return;
    }

    String registerLink = "registration.jsp";
    Enumeration<String> paramNames = request.getParameterNames();
    String params = "";
    while (paramNames.hasMoreElements()) {
        String paramName = paramNames.nextElement();
        String[] paramValues = request.getParameterValues(paramName);
        for (int i = 0; i < paramValues.length; i++) {
            String paramValue = paramValues[i];
            params += paramName + "=" + paramValue;
        }
        if (paramNames.hasMoreElements()) {
            params += "&";
        }
    }
    if (!params.equals("")) {
        registerLink += "?" + params;
    }
    String verification_msg = null;
    String verification_status = null;
    if (session.getAttribute("verification_msg") != null) {
        verification_msg = (String) session.getAttribute("verification_msg");
        session.removeAttribute("verification_msg");
    }
    if (session.getAttribute("verification_status") != null) {
        verification_status = session.getAttribute("verification_status").toString();
        session.removeAttribute("verification_status");
    }
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body>
        <%@include file="common/facebooklogin.jsp" %>
        <script>
            var msg = '<%=verification_msg == null ? "" : verification_msg %>';
            var status = '<%=verification_status == null ? "" : verification_status %>';
        </script>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>

            <!-- page content -->
            <div class="page-content margin-fixed">
                <%@include file="common/titlePanel.jsp" %>
                <div class="page-content-section">
                    <div class="grid-row">
                        <div class="grid-col grid-col-5">
                            <!-- welcome -->
                            <div class="block block-welcome">
                                <h2>Create new account</h2>
                                <p>SIGNUP TODAY AND YOU'LL BE ABLE TO</p>
                                <ul>
                                    <li><i class="fa fa-check-square-o"></i>Online Order Status</li>
                                    <li><i class="fa fa-check-square-o"></i>See Ready Hot Deals</li>
                                    <li><i class="fa fa-check-square-o"></i>Sign up to receive exclusive news and private sales</li>
                                    <li><i class="fa fa-check-square-o"></i>Quick Buy Stuffs</li>
                                </ul>
                                <br>
                                <div class="block-login">
                                    <input type="button" class="button" value="Create Now" onclick="window.location.href = '<%=registerLink%>'" />
                                </div>
                            </div>
                            <!--/ welcome -->
                        </div>
                        <div class="grid-col grid-col-6 grid-col-right">
                            <!-- login -->
                            <div class="block block-login">
                                <div class="block-head">Sign in to your account</div>
                                <div align="center" style="margin-top: 3%; width: 100%;">
                                    <a id="fbLogin" class="fb-button" onClick="checkLoginState()">LOGIN WITH FACEBOOK</a>
                                </div>
                                <div align="center" style="margin-top: 3%; width: 100%;">
                                    <div id="signin-button1">
                                        <span class="icon"></span>
                                        <span class="buttonText">LOGIN WITH GOOGLE</span>
                                    </div>
                                </div>
                                <form action="login2" method="post" class="block-cont">
                                    <br>
                                    <font color="red">${param.message}</font>
                                    <font color="red">${message}</font>
                                    <font color="black">${successMsg}</font>
                                    <input type="hidden" name="page" value="${param.page}">
                                    <br><br>
                                    <div class="input"><input type="text" id="loginUsername" name="username" placeholder="Username" value="${username}"><i id="loginUsernameIcon" class="fa fa-envelope"></i></div>
                                    <div class="input"><input type="password" id="loginPassword" name="password" placeholder="Password" value="${password}"><i id="loginPasswordIcon" class="fa fa-lock"></i></div>
                                    <label class="checkbox"><input type="checkbox"><i class="fa fa-check"></i>Remember me</label>
                                    <br>
                                    <button type="submit" class="button">Login Now</button>
                                    <p>Forgot <a href="recovery.jsp">Username / Password</a>?</p>
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
        <script src="js/login.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>