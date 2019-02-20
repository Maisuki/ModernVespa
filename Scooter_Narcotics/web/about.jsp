<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "About us";
    String breadCrumbName = "About us";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>

            <div class="page-content margin-fixed">	
                <div class="grid-row" style="background-color:#000">
                    <jsp:include page="common/filterSearchPanel.jsp"></jsp:include>

                    <jsp:include page="common/filterSearchPanelResponsive.jsp"></jsp:include>
                </div>

                <%@include file="common/titlePanel.jsp" %>

                <!-- page content -->
                <div class="page-content">				
                    <!-- page content section -->
                    <div class="page-content-section">
                        <div class="grid-row">
                            <!-- about -->
                            <div class="block block-about-5">
                                <div class="block-cont clearfix">
                                    <div align="center" class="grid-col">
                                        <h3 style="color:#fff">Scooter Narcotics</h3>
                                        <p style='width: 80%;'>Originally established in 2009, Scooter Narcotics fumbled off as a humble workshop offering basic repairs for scooters. Throughout the years of various ups and downs, the one fact that kept the team going was our passion and love for scooters. Leveraging on our hard-earned knowledge and experience, we have now expanded our business lines from a small repair shop to sourcing and distribution of high-quality parts online to satisfy our performance-hungry customers.</p>
                                        <%--
                                        <p>Scooter Narcotics expertise are in modifications, repairs and service solutions for all makes and models of scooters, including Piaggio, Yamaha, Honda, Kymco, Aprilia, SYM, Daelim, Peugeot and many more. A place where enthusiast gather to learn scooter tuning. Our skills in tuning scooters today were meticulously imparted from professionals in Europe, providing you the best workmanship.</p>

                                        <p>Our chain of supplies are mainly from Malossi, OEM original parts from factory, Polini, PM tuning, Stage6 and many more! </p>

                                        <p>Should you have any enquiries or if you are a spare part dealer and wish to create an account with us please send us an email to <a href="mailto:mark@scooternarcotics.com">mark@scooternarcotics.com</a></p>
                                        --%>
                                    </div>

                                </div>
                            </div>
                            <!--/ about -->
                            <div class="block block-clients">   
                                <div class="block-head block-head-1">STORE AND WORKSHOP<i class="fa fa-headphones"></i></div>
                                <div class="block-cont">
                                    <div class="carousel">
                                        <div>
                                            <img src="img/workshop/IMG_0014.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_0021.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_0022.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_9992.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_9994.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_9995.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_9996.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_9997.JPG" width="350" height="250" alt="">
                                        </div>
                                        <div>
                                            <img src="img/workshop/IMG_9998.JPG" width="350" height="250" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--/ page content section -->
                </div>
                <!--/ page content -->

                <jsp:include page="common/footer.jsp"/>
            </div>
        </div>
            
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/about.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>