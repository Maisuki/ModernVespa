<%@page import="com.google.gson.JsonElement"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.TreeMap"%>
<%@page import="java.util.List"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
    request.getServerName() +       // "myhost"
    request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "Contact";
    String breadCrumbName = "Contact";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body onload="myFunction()" style="margin:0;">
        <div id="loader"></div>
        <div style="display:none;" id="myDiv" class="page">
            <%@include file="common/top_panel.jsp" %>

            <div class="page-content margin-fixed">	
                <div class="grid-row" style="background-color:#000">
                    <jsp:include page="common/filterSearchPanel.jsp"></jsp:include>

                    <jsp:include page="common/filterSearchPanelResponsive.jsp"></jsp:include>
                </div>
                
                <%@include file="common/titlePanel.jsp" %>

                <!-- page content -->
                <div class="page-content">
                    <div class="page-content-section">
                        <div class="grid-row">
                            <!-- contacts -->
                            <div class="block block-contacts-2">
                                <div class="block-head block-head-1">CONTACT<i class="fa fa-headphones"></i></div>
                                <div class="block-cont clearfix">
                                    <div class="grid-col grid-col-5 grid-col-left" style="margin-left: 15px;">
                                        <!-- feedback -->
                                        <form action="feedbackServlet" method="post" id="block-feedback" class="block block-feedback-2">
                                            <div class="block-head contact-title">
                                                Send us a message
                                            </div>
                                            <div class="block-cont clearfix">
                                                <font color="red">${message}</font>
                                                <div class="input">
                                                    <input type="text" name="name" placeholder="Your Name" value="${name}" required>
                                                    <i class="fa fa-user"></i>
                                                </div>
                                                <div class="input">
                                                    <input type="email" name="email" placeholder="Your Email" value="${email}" required>
                                                    <i class="fa fa-envelope"></i>
                                                </div>
                                                <div class="input">
                                                    <input type="text" name="contact" placeholder="Your Contact" value="${contact}" required>
                                                    <i class="fa fa-phone"></i>
                                                </div>
                                                <div class="select" style="background-color: #fff; margin-bottom: 10px;">
                                                    <select name="subject" required="">
                                                        <option value="">Select a Subject</option>
                                                        <option>Order</option>
                                                        <option>Complaint</option>
                                                        <option>Question about delivery</option>
                                                        <option>Technical question scootermatic</option>
                                                        <option>Technical question classic</option>
                                                        <option>Answer for backorder mail</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div class="select" style="background-color: #fff; margin-bottom: 10px;">
                                                    <select id="contactbrand" name="brand" required="">
                                                        <option value="">Select your Scooter Brand</option>
                                                        <%
                                                            JsonElement results = SNServer.sendGET(Global.BASE_URL + "/bnm");
                                                            JsonObject bnmObj = results.getAsJsonObject();
                                                            JsonArray bnmArr = bnmObj.get("bnm").getAsJsonArray();
                                                            TreeMap<String, List<String>> bnmMap = new TreeMap<>();
                                                            List<String> modelList = new ArrayList<>();
                                                            for (JsonElement bnm : bnmArr) {
                                                                String brand = ((JsonObject) bnm).get("brand").getAsString();
                                                        %>
                                                        <option <%=(request.getAttribute("brand") != null && request.getAttribute("brand").equals(brand)) ? "selected" : "" %>><%=brand%></option>
                                                        <%
                                                            }
                                                        %>
                                                    </select>
                                                </div>
                                                <div class="select" style="background-color: #fff; margin-bottom: 10px;">
                                                    <select id="contactmodel" name="model" required>
                                                        <option value="">Select your Scooter Model</option>
                                                    </select>
                                                </div>
                                                <textarea cols="30" rows="6" name="message" placeholder="Your Message" required>${emailMessage}</textarea>
                                                <input type="text" name="hidden" style="display:none">
                                                <button type="submit" class="button">Submit</button>
                                            </div>
                                            <div class="message">
                                                <i class="fa fa-check"></i>
                                                <p>Your message was successfully sent!</p>
                                            </div>
                                        </form>
                                        <!--/ feedback -->
                                    </div>
                                    <div class="grid-col grid-col-5 grid-col-right" style="margin-right: 15px;">
                                        <div class="grid-col grid-col-5">
                                            <br>
                                            <p style="font-size: 14px;">
                                                <b style="font-size: 18px; color: #a6eb14;">HOW TO FIND US:</b> 
                                                <br><br>
                                                We are located at <b>25 Kaki Bukit Road 4, #01-35 (SYNERGY), 417800.</b> 
                                            </p>
                                            <br>
                                            <p><b>Call us: </b> (+65) 8687-8551</p><br>
                                            <p><b>E-mail: </b> <a href="mailto:info@scooternarcotics.com">info@scooternarcotics.com</a></p><br>

                                            <div class="mapouter"><div class="gmap_canvas"><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15954.90715642193!2d103.910815!3d1.34026!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xccd59fbd0d6228ff!2sScooter+Narcotics!5e0!3m2!1sen!2ssg!4v1520764632823" width="600" height="280" frameborder="0" style="border:0" allowfullscreen></iframe><a href="https://www.webdesign-muenchen-pb.de">webdesign-muenchen-pb.de</a></div><style>.mapouter{overflow:hidden;height:280px;}.gmap_canvas {background:none!important;height:300px;width:600px;}</style></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--/ contacts -->
                        </div>
                    </div>
                </div>
                <!--/ page content -->

                <jsp:include page="common/footer.jsp"/>
            </div>
        </div>
            
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/contact.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>