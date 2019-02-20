<%@page import="common.Global"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.text.DecimalFormat"%>
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
            response.sendRedirect("login.jsp?page=shop-checkout-shipping.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
    %>
    <body>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>
            
            <%@include file="common/titlePanel.jsp" %>

            <!-- page content -->
            <div class="page-content" id="paymentDetails">						
                <div class="page-content-section margin-fixed-account">
                    <h3 align="center" class="block-head-4" style="padding: 0px 10px 30px 0px;">Choose Shipping Type & Payment</h3>   					
                    <div style="margin-top: 20px;" class="grid-row">
                        <div class="grid-col grid-col-5 grid-col-left">
                            <!-- shipping calc -->
                            <div class="block block-shipping-calc">
                                <div class="mobileDisplayOption block-head" style="padding-left: 3px">View Shipping Rates</div>
                                <div class="nonMobileDisplayOption block-head">View Shipping Rates</div>
                                <form action="#" class="clearfix" style="height: 210px;">
                                    <div class="block-cont">
                                        <dl>
                                            <dt style="padding-top: 20px">Shipping method</dt>
                                            <dd></dd>
                                            <dt></dt>
                                            <dd style="padding-top: 20px">
                                                <label class="radio">
                                                    <input class="shippingmethod" type="Radio" name="ShippingMethod" value="FEDEX" />
                                                    <i></i>Fedex
                                                </label>
                                                &nbsp;&nbsp;
                                                <label class="radio">
                                                    <input class="shippingmethod" type="Radio" name="ShippingMethod" value="UPS" unchecked />
                                                    <i></i>UPS
                                                </label>
                                                &nbsp;&nbsp;
                                                <label class="radio">
                                                    <input class="shippingmethod" type="Radio" name="ShippingMethod" value="DHL" unchecked />
                                                    <i></i>DHL
                                                </label>
                                            </dd>
                                        </dl>
                                    </div>

                                    <div class="block-cont">
                                        <dl>
                                            <dt style="padding-top: 20px">Shipping services</dt>
                                            <dd></dd>
                                            <dt></dt>
                                            <dd style="padding-top: 20px" id="shippingServices" name ="service"></dd>
                                        </dl>
                                    </div>
                                </form>
                            </div>
                            <!-- shipping calc -->
                        </div>
                        <div class="grid-col grid-col-6 grid-col-right">
                            <!-- shopping cart totals -->
                            <div class="block block-shopping-cart-totals">
                                <div class="block-head">Cart Totals</div>
                                <div class="block-cont" style="height: 170px;">
                                    <dl>
                                        <dt>Cart Subtotal</dt>
                                        <dd>
                                            <%@include file="common/currencyDetector.jsp" %>
                                            &nbsp;
                                            <%=String.format("%.2f", session.getAttribute("price"))%>
                                        </dd>
                                        <dt>Shipping Fee</dt>
                                        <div id="one" style="display:visible;">
                                            <dd id="fee">-</dd>
                                        </div>
                                        <dt>Order Total Price</dt>
                                        <dd id="totalPrice"></dd>
                                        <dt>Order Total Weight</dt>
                                        <dd><%=String.format("%.2f", session.getAttribute("weight"))%>&nbsp;Kg</dd>
                                    </dl>
                                </div>
                            </div>
                            <!-- shopping cart totals -->							
                        </div>
                        <div class="nonMobileDisplayOption specialAdjustment grid-col grid-col-5" style="margin-left: 30%; width: 400px;">
                            <!-- payment method -->
                            <div class="block block-checkout-payment">
                                <div align="center" class="block-head">Payment Method</div>
                                <div class="block-cont">
                                    <ul>
                                        <li>
                                            <label class="radio">
                                                <input class="paymentmethod" type="radio" name="checkout-payment" value="Credit">
                                                <i></i>
                                                <img src="img/payments.png" alt="payments" width="150" height="22">Credit / Debit Card
                                            </label>
                                            <div class="stripePanel">
                                                <br>
                                                <div class="block block-shopping-cart-totals">
                                                    <div class="block-head">Credit Card Payment</div>

                                                    <form class="form">
                                                        <label>
                                                            <input name="cardholder-name" class="field is-empty" placeholder="Jane Doe"/>
                                                            <br>
                                                            <span><span>Name</span></span>
                                                        </label>

                                                        <label>
                                                            <div id="card-element" class="field is-empty" style="color:white"></div>
                                                            <span><span>Credit or debit card</span></span>
                                                        </label>
                                                        <button type="submit" class="button" id="placeOrder">Place Order</button>
                                                        <div class="outcome">
                                                            <div class="error" role="alert"></div>
                                                            <div class="success">
                                                                <span class="token"></span>
                                                            </div>
                                                            <div class="error" id="errorMsg">
                                                                <span class="errorMsg"></span>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <label class="radio">
                                                <input class="paymentmethod" type="radio" name="checkout-payment" value="Paypal">
                                                <i></i>
                                                <img src="img/paypal.png" alt="payments" width="35" height="25">Paypal
                                            </label>
                                            <div class="paypalPanel">
                                                <br><br>
                                                <div id="paypal-button"></div>
                                            </div>
                                        </li>
                                        <li>
                                            <label class="radio">
                                                <input class="paymentmethod" type="radio" name="checkout-payment" value="Wire Transfer">
                                                <i></i>
                                                <img src="img/wiretransfer.png" alt="payments" width="42" height="25">Wire Transfer
                                            </label>
                                            <div class="WTPayment">
                                                <br><br>
                                                <p> Please transfer to the following bank account
                                                    <br><b><u>Overseas-Chinese Banking Corporation limited Singapore</u></b>
                                                    <br>Swift-Code: <b><u>OCBCSGSG</u></b>
                                                    <br>Bank account number: <b><u>588134247001</u></b>,
                                                    <br> Email to <b><u>info@scooternarcotics.com</u></b> once payment is made
                                                </p>
                                                <div align="right">
                                                <a class="button WTplaceOrder">Place Order</a>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>          
                            </div>
                            <!-- payment method -->
                        </div>
                        <div class="mobileDisplayOption grid-col grid-col-6">
                            <!-- payment method -->
                            <div class="block block-checkout-payment">
                                <div class="block-head">Payment Method</div>
                                <div class="block-cont">
                                    <ul>
                                        <li>
                                            <label class="radio">
                                                <input class="paymentmethod" type="radio" name="checkout-payment1" value="Credit">
                                                <i></i>
                                                <img src="img/payments.png" alt="payments" width="150" height="22">Credit / Debit Card
                                            </label>
                                            <div class="stripePanel">
                                                <br>
                                                <div class="block block-shopping-cart-totals">
                                                    <div class="block-head">Credit Card Payment</div>

                                                    <form class="form1">
                                                        <label>
                                                            <input name="cardholder-name1" class="field1 is-empty" placeholder="Jane Doe"/>
                                                            <br>
                                                            <span><span>Name</span></span>
                                                        </label>

                                                        <label>
                                                            <div id="card-element1" class="field1 is-empty" style="color:white"></div>
                                                            <span><span>Credit or debit card</span></span>
                                                        </label>
                                                        <button type="submit" class="button" id="placeOrder1">Place Order</button>
                                                        <div class="outcome1">
                                                            <div class="error1" role="alert"></div>
                                                            <div class="success1">
                                                                <span class="token1"></span>
                                                            </div>
                                                            <div class="error1" id="errorMsg1">
                                                                <span class="errorMsg1"></span>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <label class="radio">
                                                <input class="paymentmethod" type="radio" name="checkout-payment1" value="Paypal">
                                                <i></i>
                                                <img src="img/paypal.png" alt="payments" width="35" height="25">Paypal
                                            </label>
                                            <div class="paypalPanel">
                                                <br><br>
                                                <div id="paypal-button1"></div>
                                            </div>
                                        </li>
                                        <li>
                                            <label class="radio">
                                                <input class="paymentmethod" type="radio" name="checkout-payment1" value="Wire Transfer">
                                                <i></i>
                                                <img src="img/wiretransfer.png" alt="payments" width="42" height="25">Wire Transfer
                                            </label>
                                            <div class="WTPayment">
                                                <br><br>
                                                <p style="padding-left: 0;"> Please transfer to the following bank account
                                                    <br><b><u>Overseas-Chinese Banking Corporation limited Singapore</u></b>
                                                    <br>Swift-Code: <b><u>OCBCSGSG</u></b>
                                                    <br>Bank account number: <b><u>588134247001</u></b>,
                                                    <br> Email to <b><u>info@scooternarcotics.com</u></b> once payment is made
                                                </p>
                                                <a class="button WTplaceOrder" style="width: 77%;">Place Order</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>   
                            </div>
                            <!-- payment method -->
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->
            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script>
            var dhl = JSON.stringify(<%=session.getAttribute("DHL")%>);
            var fedex = JSON.stringify(<%=session.getAttribute("FEDEX")%>);
            var ups = JSON.stringify(<%=session.getAttribute("UPS")%>);
            
            var cartPrice = parseFloat('<%=session.getAttribute("price")%>').toFixed(2);
        </script>
        <script src="js/shop-checkout-shipping.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>