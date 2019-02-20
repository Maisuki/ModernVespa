<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI() +       // "/people"
             "?" +                           // "?"
             request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = " | Checkout";
    String titleName = "Checkout";
    String breadCrumbName = "Shop - Checkout";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=shop-checkout.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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
                        <div class="grid-col grid-col-6">
                            <!-- checkout address -->
                            <div class="block block-checkout-address">
                                <div class="block-head">Billing Address</div>
                                <div class="block-cont">
                                    <div class="select">
                                        <select>
                                            <option value="0" disabled selected>Select a Country</option>
                                            <option value="1">Australia</option>
                                            <option value="2">Belgium</option>
                                            <option value="3">Canada</option>
                                            <option value="4">Denmark</option>
                                            <option value="5">Egypt</option>
                                            <option value="6">France</option>
                                            <option value="7">Germany</option>
                                            <option value="8">Hungary</option>
                                        </select>
                                    </div>									

                                    <div class="input-small"><input type="text" placeholder="First Name"></div><!--
                                    --><div class="input-small"><input type="text" placeholder="Last Name"></div>

                                    <div class="input"><input type="text" placeholder="Company Name"></div>
                                    <div class="input"><input type="text" placeholder="Address"></div>
                                    <div class="input"><input type="text" placeholder="Town / City"></div>
                                    <div class="input"><input type="text" placeholder="State / Country"></div>

                                    <div class="input-small"><input type="text" placeholder="Postcode / ZIP"></div><!--
                                    --><div class="input-small"><input type="text" placeholder="Phone"></div>
                                </div>
                            </div>
                            <!-- checkout address -->
                        </div>

                        <div class="grid-col grid-col-6">
                            <!-- checkout address -->
                            <div class="block block-checkout-address block-checkout-coupon">
                                <div class="block-cont">
                                    <div class="textarea">
                                        <textarea cols="10" rows="15" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                                    </div>
                                </div>
                                <br>
                                <form action="#" class="clearfix">
                                    <p>Please enter any promotion code if any.</p>

                                    <input type="text" placeholder="Enter your code">
                                    <button type="submit" class="button">Apply Coupon</button>
                                </form>
                            </div>
                            <!-- checkout coupon -->
                        </div>
                    </div>

                    <div class="grid-row">
                        <div class="grid-col grid-col-6">
                            <!-- checkout order -->
                            <div class="block block-checkout-order">
                                <div class="block-head">Your Order</div>
                                <div class="block-cont">
                                    <table>
                                        <tr>
                                            <td>Your item title here x 1</td>
                                            <td>$399</td>
                                        </tr>
                                        <tr>
                                            <td>Your item title here x 1</td>
                                            <td>$399</td>
                                        </tr>
                                        <tr>
                                            <td>Your item title here x 1</td>
                                            <td>$399</td>
                                        </tr>
                                        <tr>
                                            <td>Cart Subtotal</td>
                                            <td>$399</td>
                                        </tr>
                                        <tr>
                                            <td>Shipping</td>
                                            <td>Free Shipping</td>
                                        </tr>
                                        <hr>
                                        <tr>
                                            <td>Order Total Price</td>
                                            <td class="price">$399</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!-- checkout order -->
                        </div>

                        <div class="grid-col grid-col-6">
                            <!-- payment method -->
                            <div class="block block-checkout-payment">
                                <div class="block-head">Payment Method</div>
                                <div class="block-cont">
                                    <ul>
                                        <li>
                                            <label class="radio"><input type="radio" onclick="javascript:yesnoCheck();" id="yesCheck" name="checkout-payment" value="Credit"><i></i><img src="img/payments.png" alt="payments" width="75" height="22">Credit / Debit Card</label>
                                        </li>
                                        <li>
                                            <label class="radio"><input type="radio" onclick="javascript:yesnoCheck();" id="yesCheck" name="checkout-payment" value="Paypal"><i></i><img src="img/paypal.png" alt="payments" width="38" height="25">Paypal</label>
                                        </li>
                                        <li>
                                            <label class="radio"><input type="radio" onclick="javascript:yesnoCheck();" id="yesCheck" name="checkout-payment" value="Wire Transfer"><i></i><img src="img/wiretransfer.png" alt="payments" width="42" height="25">Wire Transfer</label>
                                        </li>
                                        <div id="ifYes" style="visibility:hidden" >
                                            <br>
                                            <div class="input-small">
                                                <input type='text' id='yes' name='yes' placeholder="Credit Number">
                                            </div>
                                            <br>
                                            <div class="input-small"><input type='date' id='acc' name='acc' placeholder="MM/DD/YYYY"></div>
                                        </div>
                                    </ul>

                                    <a href="#" class="button">Place Order</a>
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
        <script src="js/shop-checkout.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>