<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "Cancellation";
    String breadCrumbName = "My Profile";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=cancellation.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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
                        <div class="grid-col grid-col-left grid-col-3">
                            <!-- categories filter -->
                            <div class="widget widget-categories-filter">
                                <div class="widget-head-2">Welcome, <b>Mark</b></div>
                                <ul>
                                    <li>
                                        <a href="account.jsp">
                                            <i class="fa fa-plus-square-o"></i>Account Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a href="orders.jsp">
                                            <i class="fa fa-plus-square-o"></i>Orders
                                        </a>
                                    </li>
                                    <li>
                                        <a href="personalinfo.jsp">
                                            <i class="fa fa-plus-square-o"></i>Personal Information
                                        </a>
                                    </li>
                                    <li>
                                        <a href="returns.jsp">
                                            <i class="fa fa-plus-square-o"></i>Return
                                        </a>
                                    </li>
                                    <li>
                                        <a href="cancellation.jsp" class="active">
                                            <i class="fa fa-plus-square-o"></i>Cancellation
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <!--/ categories filter -->
                        </div>

                        <div class="grid-col grid-col-right grid-col-8">
                            <!-- orders tabs -->	
                            <div class="widget-head-2">My Cancellation</div>
                            <div class="block block-shopping-cart">
                                <table>
                                    <tr>
                                        <th colspan="2">
                                            <b>Order #11223344</b><br>
                                        </th>
                                        <th colspan="4"></th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="#" class="pic">
                                                <img src="img/product_1.jpg" width="100" height="100" alt="">
                                            </a>
                                        </td>
                                        <td>
                                            Cylinder head Naraku 50cc
                                        </td>
                                        <td>
                                            $25.90
                                        </td>
                                        <td colspan="3">
                                            <span style="float: right">Delivered</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="#" class="pic">
                                                <img src="img/product_3.jpg" width="100" height="100" alt="">
                                            </a>
                                        </td>
                                        <td>
                                            Cylinder head Naraku 50cc
                                        </td>
                                        <td>
                                            $25.90
                                        </td>
                                        <td colspan="3">
                                            <span style="float: right">Delivered</span>
                                        </td>
                                    </tr>
                                </table>
                                <br>
                                <table>
                                    <tr>
                                        <th colspan="2">
                                            <b>Order #223388</b><br>
                                        </th>
                                        <th colspan="4"></th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="#" class="pic"><img src="img/product_2.jpg" width="100" height="100" alt=""></a>
                                        </td>
                                        <td>
                                            Cylinder head Naraku 50cc
                                        </td>
                                        <td>
                                            $25.90
                                        </td>
                                        <td colspan="3">
                                            <span style="float: right">Delivered</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="#" class="pic"><img src="img/product_4.jpg" width="100" height="100" alt=""></a>
                                        </td>
                                        <td>
                                            Cylinder head Naraku 50cc
                                        </td>
                                        <td>
                                            $25.90
                                        </td>
                                        <td colspan="3">
                                            <span style="float: right">Delivered</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
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