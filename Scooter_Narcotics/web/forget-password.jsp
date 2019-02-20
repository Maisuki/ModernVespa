<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI() +       // "/people"
             "?" +                           // "?"
             request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = "";
    String titleName = "Forget Password";
    String breadCrumbName = "Forget PWD";
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
                <div class="page-content-section">
                    <div class="grid-row">
                        <div class="grid-col grid-col-custom-5 nonMobileDisplayOption" style="margin-left: 15px;">
                            <!-- welcome -->
                            <div class="block block-welcome">
                                <h2>Welcome to Scooter Narcotics</h2>
                                <p>Scooter Narcotics expertise are in modifications, repairs and service solutions for all makes and models of scooters, including Piaggio, Yamaha, Honda, Kymco, Aprilia, SYM, Daelim, Peugeot and many more. A place where enthusiast gather to learn scooter tuning. Our skills in tuning scooters today were meticulously imparted from professionals in Europe, providing you the best workmanship.</p>
                                <br>
                                <p>Our chain of supplies are mainly from Malossi, OEM original parts from factory, Polini, PM tuning, Stage6 and many more! </p>
                                <br>
                                <br>
                                <p>Should you have any enquiries or if you are a spare part dealer and wish to create an account with us please send us an email to <u>info@scooternarcotics.com</u></p>

                            </div>
                            <!--/ welcome -->
                        </div>
                        <div class="grid-col grid-col-custom-6 grid-col-right" style="margin-right: 15px;">
                            <!-- login -->
                            <div class="block block-login">
                                <div class="block-head">Reset Password</div>
                                <br><br>
                                <form id="forgetForm" class="block-cont">
                                    <input type="hidden" id="username" name="username" value="${username}" >
                                    <div class="input">
                                        <input type="password" id="password" name ="password" placeholder="Password" value="${password}" required>
                                        <i class="fa fa-lock"></i>
                                    </div>
                                    <div id="pswd_info" class="sub">
                                        <strong>Password must meet the following requirements:</strong>
                                        <ul>
                                            <li id="letter" class="invalid">At least <strong>one letter</strong></li>
                                            <li id="capital" class="invalid">At least <strong>one capital letter</strong></li>
                                            <li id="number" class="invalid">At least <strong>one number 0-9</strong></li>
                                            <li id="number" class="invalid">At least <strong>one "@#$%"</strong></li>
                                            <li id="length" class="invalid">Be at least <strong>6 characters with maximum 20characters</strong></li>
                                        </ul>
                                    </div>
                                    <div class="input">
                                        <input type="password" id="cfmpassword" name="cfmpassword" placeholder="Confirm password" value="${cfmpassword}" required>
                                        <i class="fa fa-lock"></i>
                                    </div>									
                                    <div class="g-recaptcha" data-callback="captchaCallback" data-sitekey="6LdoxT0UAAAAAGvYyTNGbEZ5Ai4E3SGG89EpK72s"></div><br/>

                                    <br>
                                    <button type="submit" class="button">Reset</button>
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
        <script src="js/forget-password.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>