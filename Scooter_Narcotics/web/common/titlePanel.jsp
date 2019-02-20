<!-- page intro -->
<div id="title-section" class="page-intro">
    <div class="grid-row clearfix">
        <div class="page-title"><%=titleName%></div>
        <div class="page-subtitle">Scooter Narcotics</div>
        <%
            if (!request.getRequestURI().contains("index.jsp")) {
                if (request.getRequestURI().contains("shop-details.jsp")) {
        %>
        <div class="bread-crumbs nonMobileDisplayOption"><a href="index.jsp">Home</a> - <a href="products.jsp"><%=titleName%></a> - <%=breadCrumbName%></div>
        <%
                }
                else {
        %>
        <div class="bread-crumbs nonMobileDisplayOption"><a href="index.jsp">Home</a> - <%=breadCrumbName%></div>
        <%
                }
            }
        %>
    </div>
</div>
<!--/ page intro -->