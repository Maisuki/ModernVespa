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
    String pageName = " | Registration";
    String titleName = "Registration";
    String breadCrumbName = "Registration";

    String loginLink = "login.jsp";
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
        loginLink += "?" + params;
    }
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body>
        <%@include file="common/facebooklogin.jsp" %>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>

            <!-- page content -->
            <div class="page-content margin-fixed">	
                <%@include file="common/titlePanel.jsp" %>					
                <div class="page-content-section">
                    <div class="grid-row">                        
                        <div class="nonMobileDisplayOption grid-col grid-col-5" style="margin-left: 15px;">
                            <!-- welcome -->
                            <div class="block block-welcome">
                                <h2>Already have an account with us?</h2>
                                <p>LOGIN NOW AND YOU'LL BE ABLE TO</p>
                                <ul>
                                    <li><i class="fa fa-check-square-o"></i>Online Order Status</li>
                                    <li><i class="fa fa-check-square-o"></i>See Ready Hot Deals</li>
                                    <li><i class="fa fa-check-square-o"></i>Sign up to receive exclusive news and private sales</li>
                                    <li><i class="fa fa-check-square-o"></i>Quick Buy Stuffs</li>
                                </ul>
                                <br>
                                <div class="block-login">
                                    <input type="button" class="button" value="Login Now" onclick="window.location.href = '<%=loginLink%>'" />
                                </div>
                            </div>
                            <!--/ welcome -->
                        </div>
                        <div class="mobileDisplayOption grid-col grid-col-5">
                            <!-- welcome -->
                            <div class="block block-welcome">
                                <h2>Already have an account with us?</h2>
                                <p>LOGIN NOW AND YOU'LL BE ABLE TO</p>
                                <ul>
                                    <li><i class="fa fa-check-square-o"></i>Online Order Status</li>
                                    <li><i class="fa fa-check-square-o"></i>See Ready Hot Deals</li>
                                    <li><i class="fa fa-check-square-o"></i>Sign up to receive exclusive news and private sales</li>
                                    <li><i class="fa fa-check-square-o"></i>Quick Buy Stuffs</li>
                                </ul>
                                <br>
                                <div class="block-login">
                                    <input type="button" class="button" value="Login Now" onclick="window.location.href = '<%=loginLink%>'" />
                                </div>
                            </div>
                            <!--/ welcome -->
                        </div>
                        <div class="grid-col grid-col-5 grid-col-right" style="margin-right: 15px;">
                            <!-- login -->
                            <div class="block block-login">
                                <div class="block-head">Create an Account</div>
                                <font color='red'>${message}</font>
                                <br><br>
                                <div id="fbBtn" align="center" style="width: 100%;">
                                    <a id="fbReg" class="fb-button" onClick="FBRegister()">ALLOW FACEBOOK LOGIN</a>
                                </div>
                                <div id="fbAcknowledgement" style=";display: none;">
                                    <font color="green">Facebook Login Enabled...Please fill in the rest of the details...</font>
                                </div>
                                <div id="googleBtn" align="center" style="width: 100%;margin-left: -16%;margin-top: 20px;">
                                    <div id="signin-button2">
                                        <span class="icon"></span>
                                        <span class="buttonText">ALLOW GOOGLE LOGIN</span>
                                    </div>
                                </div>
                                <div id="googleAcknowledgement" style="display: none;">
                                    <font color="green">Google Login Enabled...Please fill in the rest of the details...</font>
                                </div>
                                <br/>
                                <label class="checkbox fborgoogle">
                                    <input id="fbCheck" class="regFields" type="checkbox">
                                    <i class="fa fa-check" style="color: #a6eb14"></i>
                                    Use Facebook Email for this account?
                                </label>
                                <br/>
                                <label class="checkbox fborgoogle">
                                    <input id="googleCheck" class="regFields" type="checkbox">
                                    <i class="fa fa-check" style="color: #a6eb14"></i>
                                    Use Google Email for this account?
                                </label>

                                <form id="registrationForm" class="block-cont">
                                    <div class="input">
                                        <font id="message" color="red">${message}</font>
                                    </div>
                                    <br>
                                    <div class="input" style="display: none;">
                                        <input type="text" class="regFields" id="idFB" value='${fbID}'>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <div class="input" style="display: none;">
                                        <input type="text" class="regFields" id="idGoogle" value='${googleID}'>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <div class="input">
                                        <input type="email" class="regFields" id="email" name="email" placeholder="Your Email" value='${email}' required>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <%--
                                    <div>
                                        The (Optional) Username and Password fields below are for non facebook and google login:
                                    </div>
                                    --%>
                                    <div>
                                        The (Optional) Password fields below are for non facebook and google login:
                                    </div>
                                    <br/>
                                    <%--
                                    <div class="input">
                                        <input type="text" class="regFields" id="username" name="username" placeholder="Your Username (Optional)" value='${username}'>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    --%>
                                    <div class="input">
                                        <input type="password" class="regFields" id="password" name="password" placeholder="Password (Optional)">
                                        <i class="fa fa-lock"></i>
                                    </div>
                                    <div id="pswd_info" class="sub">
                                        <strong>Password must meet the following requirements:</strong>
                                        <br><br>
                                        <ul>
                                            <li id="letter" class="invalid">At least <strong>one letter</strong></li>
                                            <li id="capital" class="invalid">At least <strong>one capital letter</strong></li>
                                            <li id="number" class="invalid">At least <strong>one numeric character [0-9]</strong></li>
                                            <li id="number" class="invalid">At least <strong>one "$!&@#%*+_"</strong></li>
                                            <li id="length" class="invalid">Be at least <strong>6 characters with maximum 20 characters</strong></li>
                                        </ul>
                                    </div>
                                    <br>
                                    <div class="input">
                                        <input type="password" class="regFields" id="cfmpassword" name="cfmpassword" placeholder="Confirm password (Optional)">
                                        <i class="fa fa-lock"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="fname" name="fname" placeholder="First Name" value='${fname}' required>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="lname" name="lname" placeholder="Last Name" value='${lname}' required>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <div class="input">
                                        <input type="tel" class="regFields" id="contact" name="contact" placeholder="Phone Number" value='${contact}' required>
                                        <i class="fa fa-phone"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="street" name="street" placeholder="Street" value='${street}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="city" name="city" placeholder="City" value='${city}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="zip" name="zip" placeholder="Zip" value='${zip}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="state" name="state" placeholder="State" value='${state}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input " id="BillingCountry" >
                                        <select id="country" class="regFields" name="country" style="color: gray;" required>
                                            <jsp:include page="common/countries.jsp"></jsp:include>
                                        </select>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <br/>
                                    <div class="input">
                                        <select id="role" class="regFields" name="role" style="color: gray;" required>
                                            <option value=""> Please select your role</option>
                                        </select>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <label class="checkbox"><input class="regFields" type="checkbox" id="verify">
                                        <i class="fa fa-check" style="color: #a6eb14"></i>
                                        I agree to the <a href="terms.jsp">Terms of Use</a>
                                    </label>
                                    <br>
                                    <div class="g-recaptcha" data-callback="captchaCallback" data-sitekey="6LdoxT0UAAAAAGvYyTNGbEZ5Ai4E3SGG89EpK72s"></div>
                                    <br/>
                                    <button type="submit" class="button">Sign Up Now</button>
                                    <button type="cancel" class="button">Cancel</button>
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
        <script src="js/registration.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>