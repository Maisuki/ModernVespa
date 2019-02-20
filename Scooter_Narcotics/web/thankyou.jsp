<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI() +       // "/people"
             "?" +                           // "?"
             request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = " | Checkout Complete";
    String titleName = "Checkout";
    String breadCrumbName = "Shop - Checkout";
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
                        <div class="thankyoumargin grid-col nonMobileDisplayOption">
                            <!-- welcome -->
                            <center>
                                <div class="block block-welcome " >
                                    <p>
                                        <u>Thank you for shopping with us</u><br>
                                        A confirmation email has been sent to you!
                                    </p>
                                </div>
                            </center><br>
                            <!--/ welcome -->
                        </div>
                        <div class="grid-col mobileDisplayOption">
                            <!-- welcome -->
                            <center>
                                <div class="block block-welcome " >
                                    <p>
                                        <u>Thank you for shopping with us</u><br>
                                        A confirmation email has been sent to you!
                                    </p>
                                </div>
                            </center><br>
                            <!--/ welcome -->
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->
            
            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer></script>
        <script>
            window.renderOptIn = function() {
                window.gapi.load('surveyoptin', function() {
                    var currentDate = new Date();
                    var fourDaysLater = new Date(currentDate.setDate(currentDate.getDate() + 4));
                    
                    var month = '' + (fourDaysLater.getMonth() + 1),
                    day = '' + fourDaysLater.getDate(),
                    year = fourDaysLater.getFullYear();
                    
                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;
                    
                    var finalDate = [year, month, day].join('-');
                    
                    window.gapi.surveyoptin.render({
                        // REQUIRED FIELDS
                        "merchant_id": 124644031,
                        "order_id": "<%=session.getAttribute("transactionId")%>",
                        "email": "<%=session.getAttribute("email")%>",
                        "delivery_country": "<%=geoplugin_countryCode%>",
                        "estimated_delivery_date": finalDate
                    });
                });
            }
        </script>
        <script>
            $(document).ready(function () {
//                window.setTimeout(function () {
//                    location.replace("index.jsp");
//                }, 2000);
            });
            
        </script>
        <%@include file="common/footerScript.jsp" %>
        <!--/ scripts -->
    </body>
</html>