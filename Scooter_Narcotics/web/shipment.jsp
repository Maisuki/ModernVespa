<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "Order Details";
    String breadCrumbName = "My Profile";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=shipment.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
    %>
    <body>
        <% if (session.getAttribute("user") == null) {
                response.sendRedirect("login.jsp");
            }
        %>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>
            
            <%@include file="common/titlePanel.jsp" %>

            <!-- page content -->
            <div class="page-content">						
                <div class="page-content-section">
                    <div class="grid-row">
                        <div class="grid-col grid-col-left grid-col-3">
                            <!-- categories filter -->
                            <div class="widget widget-categories-filter">
                                <div class="widget-head-2">Welcome, <b>Mark</b></div>
                                <ul>
                                    <li><a href="account.jsp"><i class="fa fa-plus-square-o"></i>Account Dashboard</a>
                                    </li>
                                    <li><a href="orders.jsp" class="active"><i class="fa fa-plus-square-o"></i>Orders</a></li>
                                    <li><a href="personalinfo.jsp"><i class="fa fa-plus-square-o"></i>Personal Information</a></li>
                                    <li><a href="returns.jsp"><i class="fa fa-plus-square-o"></i>Return</a></li>
                                    <li><a href="cancellation.jsp"><i class="fa fa-plus-square-o"></i>Cancellation</a></li>
                                </ul>
                            </div>
                            <!--/ categories filter -->
                        </div>
                        <div class="grid-col grid-col-right grid-col-8">
                            <!-- orders tabs -->	
                            <div class="widget-head-2">Order Details</div>
                            <div class="block block-shopping-cart">
                                <table>
                                    <tr>
                                        <th colspan="2"><b>Order #11223344</b></th>
                                        <th colspan="2">Placed on <u>11/12/2017</u></th>
                                        <th colspan="2">Total: SGD 298.00</th>
                                    </tr>
                                </table>
                                <br>
                                <table>
                                    <tr>
                                        <th colspan="7">
                                            Standard Shipping
                                            <br><br>
                                            <i class="fa fa-clock-o"></i> Delivered on 09/12/2017
                                        </th>
                                    </tr>
                                    <tr>
                                        <td colspan="7">
                                            <div class="mobile-nav-display-none block block-about-2 block-blog-details">
                                                <div class="grid-col grid-col-7" style="margin-left: 20px; margin-bottom: 20px">
                                                    <h2>Status</h2>
                                                    <blockqoute>
                                                        <p><b>10/12/2017</b></p>
                                                        <br>
                                                        <p>Your product(s) are in the progress.</p>
                                                        <p>Thanks for shopping at Scooter Narcotics and see you on your next purchase.</p>
                                                    </blockqoute>
                                                </div>
                                            </div>
                                            <div class="mobile-nav-display-full block block-about-2 block-blog-details">
                                                <div class="grid-col grid-col-7" style="margin-bottom: 20px">
                                                    <h2>Status</h2>
                                                    <blockqoute>
                                                        <p><b>10/12/2017</b></p>
                                                        <br>
                                                        <p>Your product(s) are in the progress.</p>
                                                        <p>Thanks for shopping at Scooter Narcotics and see you on your next purchase.</p>
                                                    </blockqoute>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="#" class="pic"><img src="img/product_4.jpg" width="100" height="100" alt=""></a>
                                        </td>
                                        <td colspan="2">
                                            Cylinder head Naraku 50cc
                                        </td>
                                        <td>
                                            SGD 25.90
                                        </td>
                                        <td>
                                            x1
                                        </td>
                                        <td></td>
                                    </tr>
                                </table>
                                <div class="block-benefits-3">
                                    <ul>
                                        <li>
                                            <div class="inner">
                                                <h3>Delivery Address</h3>
                                                <p>Mark
                                                    <br><br>
                                                    210 UPPER SERANGOON ROAD, #01-230
                                                    <br>SINGAPORE - 11392</p>
                                            </div>
                                        </li><!--
                                        --><li>
                                            <div class="inner">
                                                <h3>Billing Address</h3>
                                                <p>Mark
                                                    <br><br>
                                                    210 UPPER SERANGOON ROAD, #01-230
                                                    <br>SINGAPORE - 11392</p>
                                            </div>
                                        </li><!--
                                        --><li>
                                            <div class="inner">
                                                <h3>Total Summary</h3>
                                                <br>
                                                <h3>SGD 298.00</h3>
                                            </div>
                                        </li><!--
                                        -->
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/ page content -->

            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/shipment.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>