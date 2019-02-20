<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = " | T&C";
    String titleName = "Term of Use";
    String breadCrumbName = "T&C";
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
                                    <u>1. Order and Pricing</u><br>
                                    All orders are subject to our approval and product availability. Scooter Narcotics Online's acceptance of an order begins when the goods are despatched, and you will be charged at this time. The prices of products are correct at the time of publication on our website. We reserve the right to change prices on our website without prior notification. We will always try to ensure that all prices on our website are accurate. Occasionally, errors may occur. If there has been an error in the price of goods that you have ordered we will inform you as soon as possible. On these occasions, you can choose to either cancel your order or reorder it at the correct price. If we are unable to contact you about an incorrect price we will cancel your order. Any payments which have already been made will be refunded. All goods advertised on this site are simply an invitation to the customer to either make further enquiries to us or to make an offer to purchase goods from us. Acceptance of offers to purchase goods only takes place when the relevant goods orders are despatched by Scooter Narcotics and not before.

                                    <br><br><u> 2. Order Acknowledgement</u><br>
                                    When you have submitted an order you will be sent an e-mail confirming your order. It will confirm our contact details, the products requested, the final cost (including delivery expenses), delivery and invoice details.

                                    <br><br><u>3. Stock Availability</u><br>
                                    At the Scooter Narcotics Online store we will do our utmost to ensure that we have stock of all products in our online shop. It is possible however that we will on occasion be unable to fulfil your order immediately. If this is the case we will inform you immediately with details of any delays or issues there may be. Scooter Narcotics reserves the right to cancel your order if the order cannot be fulfilled. 

                                    <br><br><u>4. Responsibilities of the Customer</u><br>
                                    It is the responsibility of the customer to ensure that all information given on your order form is complete and accurate. Where information given by the customer is incomplete, misleading or incorrect the customer will be liable for any costs involved in resolving the matter.

                                    <br><br><u>5. Deliveries</u><br>
                                    Deliveries will be made at our risk by a carrier nominated by us.
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