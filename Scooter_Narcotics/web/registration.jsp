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
                                    <a id="fbReg" class="fb-button" onClick="FBRegister()">REGISTER WITH FACEBOOK</a>
                                </div>
                                <div id="googleBtn" align="center" style="width: 100%;margin-left: -16%;margin-top: 20px;">
                                    <div id="signin-button2">
                                        <span class="icon"></span>
                                        <span class="buttonText">REGISTER WITH GOOGLE</span>
                                    </div>
                                </div>
                                <div id="fbAcknowledgement" align="center" style="width: 100%;margin-left: -16%;display: none;">
                                    <font color="green">Connected to Facebook...Please fill in the rest of the details...</font>
                                </div>
                                <div id="googleAcknowledgement" align="center" style="width: 100%;margin-left: -16%;display: none;">
                                    <font color="green">Connected to Google...Please fill in the rest of the details...</font>
                                </div>
                                <form id="googleRegistrationForm" style="display: none;" class="block-cont">
                                    <div class="input">
                                        <font id="message" color="red">${message}</font>
                                    </div>
                                    <br>
                                    <div class="input" style="display: none;">
                                        <input type="text" class="regFields" id="idGoogle" name="id" value='${googleID}' required>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <div class="input">
                                        <input type="email" class="regFields" id="emailGoogle" name="email" placeholder="Your Email" value='${email}' required>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="fnameGoogle" name="fname" placeholder="First Name" value='${fname}' required>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="lnameGoogle" name="lname" placeholder="Last Name" value='${lname}' required>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <div class="input">
                                        <input type="tel" class="regFields" id="contactGoogle" name="contact" placeholder="Phone Number" value='${contact}' required>
                                        <i class="fa fa-phone"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="streetGoogle" name="street" placeholder="Street" value='${street}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="cityGoogle" name="city" placeholder="City" value='${city}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="zipGoogle" name="zip" placeholder="Zip" value='${zip}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="stateGoogle" name="state" placeholder="State" value='${state}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input" id="BillingCountryGoogle" >
                                        <select id="countryGoogle" class="regFields" name ="country" style="color: gray;" required>
                                            <jsp:include page="common/countries.jsp"></jsp:include>
                                        </select>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <br/>
                                    <div class="input">
                                        <select id="roleGoogle" class="regFields" name="role" style="color: gray;" required>
                                            <option value=""> Please select your role</option>
                                        </select>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <label class="checkbox"><input class="regFields" type="checkbox" required>
                                        <i class="fa fa-check" style="color: #a6eb14"></i>
                                        I agree to the <a href="terms.jsp">Terms of Use</a>
                                    </label>
                                    <br>
                                    <div class="g-recaptcha" data-callback="captchaCallback" data-sitekey="6LdoxT0UAAAAAGvYyTNGbEZ5Ai4E3SGG89EpK72s"></div>
                                    <br/>
                                    <button type="submit" class="button">Sign Up Now</button>
                                    <button type="cancel" class="button">Cancel</button>
                                </form>
                                <form id="fbRegistrationForm" style="display: none;" class="block-cont">
                                    <div class="input">
                                        <font id="message" color="red">${message}</font>
                                    </div>
                                    <br>
                                    <div class="input" style="display: none;">
                                        <input type="text" class="regFields" id="idFB" name="id" value='${fbID}' required>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <div class="input">
                                        <input type="email" class="regFields" id="emailFB" name="email" placeholder="Your Email" value='${email}' required>
                                        <i class="fa fa-envelope"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="fnameFB" name="fname" placeholder="First Name" value='${fname}' required>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="lnameFB" name="lname" placeholder="Last Name" value='${lname}' required>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <div class="input">
                                        <input type="tel" class="regFields" id="contactFB" name="contact" placeholder="Phone Number" value='${contact}' required>
                                        <i class="fa fa-phone"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="streetFB" name="street" placeholder="Street" value='${street}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="cityFB" name="city" placeholder="City" value='${city}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="zipFB" name="zip" placeholder="Zip" value='${zip}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input">
                                        <input type="text" class="regFields" id="stateFB" name="state" placeholder="State" value='${state}' required>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <div class="input" id="BillingCountryFB" >
                                        <select id="countryFB" class="regFields" name ="country" style="color: gray;" required>
                                            <jsp:include page="common/countries.jsp"></jsp:include>
                                        </select>
                                        <i class="fa fa-globe"></i>
                                    </div>
                                    <br/>
                                    <div class="input">
                                        <select id="roleFB" class="regFields" name="role" style="color: gray;" required>
                                            <option value=""> Please select your role</option>
                                        </select>
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <label class="checkbox"><input class="regFields" type="checkbox" required>
                                        <i class="fa fa-check" style="color: #a6eb14"></i>
                                        I agree to the <a href="terms.jsp">Terms of Use</a>
                                    </label>
                                    <br>
                                    <div class="g-recaptcha" data-callback="captchaCallback" data-sitekey="6LdoxT0UAAAAAGvYyTNGbEZ5Ai4E3SGG89EpK72s"></div>
                                    <br/>
                                    <button type="submit" class="button">Sign Up Now</button>
                                    <button type="cancel" class="button">Cancel</button>
                                </form>
                                <form id="registrationForm" class="block-cont">
                                    <div class="input">
                                        <font id="message" color="red">${message}</font>
                                </div>
                                <br>
                                <div class="input">
                                    <input type="text" class="regFields" id="username" name="username" placeholder="Your Username" value='${username}' required>
                                    <i class="fa fa-envelope"></i>
                                </div>
                                <div class="input">
                                    <input type="email" class="regFields" id="email" name="email" placeholder="Your Email" value='${email}' required>
                                    <i class="fa fa-envelope"></i>
                                </div>
                                <div class="input">
                                    <input type="password" class="regFields" id="password" name="password" placeholder="Password" required>
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
                                    <input type="password" class="regFields" id="cfmpassword" name="cfmpassword" placeholder="Confirm password" required>
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
                                    <select id="country" class="regFields" name ="country" style="color: gray;" required>
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
                                    <label class="checkbox"><input class="regFields" type="checkbox" required>
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