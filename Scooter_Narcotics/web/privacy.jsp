<%@page import="com.google.gson.JsonObject"%>
<%@page import="common.Global"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = " | Privacy";
    String titleName = "Privacy Policy";
    String breadCrumbName = "Privacy Policy";
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
                        <div class="grid-col">
                            <!-- welcome -->

                            <div class="block block-welcome" style="margin-left: 15px; margin-right: 15px;">
                                <p>
                                    <u>What information do we collect? </u><br>
                                    We collect information from you when you register on our site, place an order, subscribe to our mailing list, respond to a survey or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number or credit card information. You may, however, visit our site anonymously.

                                    <br><br><u> What do we use your information for? </u><br>
                                    Any of the information we collect from you may be used in one of the following ways: 
                                    <br><br><u>1. To process transactions</u><br>
                                    Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service requested.


                                    <br><br><u>2. To send periodic emails and offers</u><br>
                                    The email address you provide for order processing, may be used to send you information and updates pertaining to your order, in addition to receiving occasional company news, updates, related product or service information, etc.

                                    <br> <br><u>To How do we protect your information?</u><br>
                                    We use SSL during the transfer of information. This encrypts any informaion that you send. Credit card details are process by Paypal, we do not store your credit cards information on our site.

                                    <br><br><u>Do we disclose any information to outside parties?</u><br>
                                    We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.

                                    <br><br><u>Online Privacy Policy Only </u><br>
                                    This online privacy policy applies only to information collected through our website and not to information collected offline.

                                    <br><br><u>Your Consent </u><br>
                                    By using our site, you consent to our website's privacy policy.

                                    <br><br><u>Changes to our Privacy Policy </u><br>
                                    If we decide to change our privacy policy, we will update the Privacy Policy modification date below
                                </p> 
                            </div>
                            <!--/ welcome -->
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->
            
            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>