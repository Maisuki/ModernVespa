<%@page import="com.google.gson.JsonObject"%>
<%@include file="sessionManager.jsp" %>
<%    String uri = request.getRequestURI();
    if (!uri.contains("about.jsp") && !uri.contains("login.jsp") && !uri.contains("services.jsp")
            && !uri.contains("contact.jsp") && !uri.contains("registration.jsp")
            && !uri.contains("shop-details.jsp") && !uri.contains("shop-cart.jsp")
            && !uri.contains("account.jsp") && !uri.contains("view-notepad.jsp")
            && !uri.contains("terms.jsp") && !uri.contains("thankyou.jsp")
            && !uri.contains("cancellation.jsp") && !uri.contains("forget-password.jsp")
            && !uri.contains("shipment.jsp") && !uri.contains("orders.jsp")
            && !uri.contains("personalinfo.jsp") && !uri.contains("privacy.jsp")
            && !uri.contains("change-password.jsp") && !uri.contains("recovery.jsp")
            && !uri.contains("shop-checkout.jsp") && !uri.contains("shop-checkout-particulars.jsp")
            && !uri.contains("shop-checkout-shipping.jsp") && !uri.contains("test.jsp")) {
%>
<div id="loader"></div>
<%
    }
%>
<img src="img/logo_minified.png" style="display:none" alt>
<!-- page header top -->
<div id="page-header-top" class="page-header-top">
    <div class="grid-row">					
        <!-- top header details -->
        <ul class="quick-contacts">
            <li><i class="fa fa-envelope-o"></i><a href="mailto:info@scooternarcotics.com">info@scooternarcotics.com</a></li>
            <li><i class="fa fa-clock-o"></i>10:00AM - 7:00PM</li>
            <li><i class="fa fa-globe"></i>
                <%@include file="countryDetector.jsp" %>
            </li>
            <li><i class="fa fa-money"></i> 
                <%@include file="currencyDetector.jsp" %>
            </li>
        </ul>
        <ul class="account-details grid-col">
            <!-- account details -->
            <%
                String marginTop = "";
                if (userSession == null) {
                    marginTop = "margin-top: 5px;";
            %>
            <li class="mobile-nav-display-none">
                <a style="margin-right: 10px;" onclick="showLogin();" class="cart-summary">
                    <i class="fa fa-sign-in"></i>
                    Login
                </a>
            </li>
            <li>
                <a style="margin-right: 10px;" href="registration.jsp" class="cart-summary">
                    <i class="fa fa-sign-in"></i>
                    Register
                </a>
            </li>

            <div id="myModal" class="remodal1" data-remodal-id="modal1" role="dialog" aria-labelledby="modal2Title" aria-describedby="modal2Desc" data-remodal-options="closeOnConfirm: true, closeOnCancel: true, closeOnEscape: false, closeOnOutsideClick: true">
                <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                <div>
                    <h2 id="modal2Title" style="font-size: 30px; font-weight: bold;">Log In</h2>
                    <br>
                    <form id="loginForm" class="block-cont">
                        <div class="modalElem" align="center">
                            <font id="errMsg" color="red"></font>
                        </div>
                        <div class="modalElem" align="center">
                            <input type="text" class="form-control" id="modalusername" name="username" placeholder="Username">
                        </div>
                        <div class="modalElem" align="center">
                            <input type="password" class="form-control" id="modalpassword" name="password" placeholder="Password">
                        </div>
                        <div style="width: 62%;margin: 10px auto;" class="modalElem" align="center">
                            <a style="text-decoration: underline;color: #000;width: 70%;" href="forget-password.jsp">Forgot your Password?</a>
                        </div>
                        <div  class="modalElem" align="center">
                            <button id="snLogin" style="padding: 10px; color: #fff; background-color: #FF6347; border-color: #FF6347;font-weight: bold;border: thin solid #888;box-shadow: 1px 1px 1px grey;" type="submit" class="button">LOG IN TO MY ACCOUNT</button>
                        </div>
                    </form>
                    <div class="modalElem" align="center">
                        <a class="fb-button" onClick="checkLoginState()">LOGIN WITH FACEBOOK</a>
                    </div>
                    <div class="modalElem" align="center">
                        <div id="signin-button">
                            <span class="icon"></span>
                            <span class="buttonText">LOGIN WITH GOOGLE</span>
                        </div>
                    </div>
                    <hr>

                    <h4 id="modal2Title" style="font-size: 15px; font-weight: bold;">If you are not a customer/dealer.</h4>
                    <br/>
                    <a href="registration.jsp">
                        <button id="snRegister" style="padding: 10px; color: #fff; background-color: #FF6347; border-color: #FF6347; font-weight: bold;border: thin solid #888;box-shadow: 1px 1px 1px grey;" type="button" class="button">REGISTER NOW</button>
                    </a>
                    <%--
                    <div class="modalElem" align="center">
                        <span>or</span>
                    </div>
                    
                    <div class="modalElem" align="center">
                        <div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false" data-scope="public_profile,email" data-onlogin="checkLoginState();" data-width="336px"></div>
                    </div>
                    --%>
                </div>
                <%--
                <br>
                <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
                <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
                --%>
            </div>
            <%
            } else {
                JsonObject user = (JsonObject) userSession;
            %>
            <li>
                <a style="margin-right: 10px;" href="account.jsp" class="user-summary">
                    <i class="fa fa-user"></i>
                    <%=user.get("fname").getAsString()%>
                </a>
            </li>
            <li>
                <a style="margin-right: 10px;" href="logout" class="user-summary">
                    <i class="fa fa-sign-out"></i>
                    Logout
                </a>
            </li>
            <%
                }
            %>
            <li><a href="shop-cart.jsp" class="cart-summary"><i class="fa fa-shopping-cart"></i>View Cart</a></li>
            <!--/ account details -->
        </ul>
        <!--/ top header details -->
    </div>
    <%-- if (userSession == null) {%>
    <div class="grid-row">
        <ul class="account-details grid-col">
            <li><a style="<%=marginTop%>margin-right: 20px;text-decoration: underline;" href="registration.jsp" class="cart-summary"><i class="fa fa-sign-in"></i>Register Now</a></li>
            <li><a style="<%=marginTop%>margin-right: 20px;text-decoration: underline;" href="forget-password.jsp" class="cart-summary"><i class="fa fa-key"></i>Forget Password</a></li>
            <li><a style="<%=marginTop%>text-decoration: underline;" href="shop-cart.jsp" class="cart-summary"><i class="fa fa-shopping-cart"></i>View Cart</a></li>
        </ul>
    </div>
    <% } --%>
</div>
<!--/ page header top -->

<!-- page header bottom -->
<header id="page-header-bottom" class="page-header-bottom">
    <div class="grid-row">
        <br><br>
        <!-- logo -->
        <div class="grid-col grid-col-3 grid-col-new" style="margin-left: 15px;">
            <span><a href="index.jsp"><img src="img/logo.png" class="nav-logo" alt=""></a></span>
        </div>
        <!--/ logo -->
        <!-- search -->
        <%@include file="search.jsp" %>
        <!--/ search -->
        <!--/cart -->
        <a href="shop-cart.jsp" class="mobile-cart"><i class="fa fa-shopping-cart"></i></a>
        <!--/cart -->
    </div>
    <div class="grid-row">
        <div class="grid-col-12">
            <!-- main nav -->
            <nav id="main-nav" class="main-nav">
                <a href="#" class="switcher"><i class="fa fa-bars"></i></a>
                <ul id="nav-items">
                    <%
                        if (titleName.equals("Main")) {
                    %>
                    <li class="active">
                        <%
                        } else {
                        %>
                    <li>
                        <%
                            }
                        %>
                        <a href="index.jsp">Home</a>
                    </li>
                    <%
                        if (titleName.equals("About us")) {
                    %>
                    <li class="active">
                        <%
                        } else {
                        %>
                    <li>
                        <%
                            }
                        %>
                        <a href="about.jsp">About Us</a>	
                    </li>
                    <%
                        if (titleName.equals("Services")) {
                    %>
                    <li class="active">
                        <%
                        } else {
                        %>
                    <li>
                        <%
                            }
                        %>
                        <a href="services.jsp" id="hideService">Services</a>
                    </li>
                    <%
                        if (titleName.equals("Shop")) {
                    %>
                    <li class="mega mega-alt active">
                        <%
                        } else {
                        %>
                    <li class="mega mega-alt">
                        <%
                            }
                        %>
                        <a href="products.jsp">All Products</a>
                    </li>
                    <%
                        if (titleName.equals("Contact")) {
                    %>
                    <li class="active">
                        <%
                        } else {
                        %>
                    <li>
                        <%
                            }
                        %>
                        <a href="contact.jsp">Contact</a>
                    </li>
                    <li class="mobile-nav-login">
                        <!-- account details -->
                        <%
                            if (userSession == null) {
                        %>
                        <a href="login.jsp" class="user-summary"><i class="fa fa-user"></i>Login</a>
                        <%
                        } else {
                            JsonObject user = (JsonObject) userSession;
                        %>
                        <a href="account.jsp" class="user-summary"><i class="fa fa-user"></i><%=user.get("fname").getAsString()%></a>
                        <a href="logout" class="user-summary"><i class="fa fa-sign-out"></i>Logout</a>
                        <%
                            }
                        %>
                        <!--/ account details -->
                    </li>
                    <li class="mobileDisplayOption">
                        <b><label style="padding: 0 15px;">Categories</label></b>
                        <jsp:include page="common/categoriesNavBar.jsp"></jsp:include>
                    </li>
                </ul>
            </nav>
            <!--/ main nav -->
        </div>
    </div>
    <p style="background:#a6eb14; color:black;text-align:center; padding-top:10px; padding-bottom:5px">
        We ship worldwide
    </p>
</header>
<div></div>
<!--/ page header bottom -->