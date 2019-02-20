<!-- Content Header (Page header) -->
<section class="content-header">
    <% 
        String uri = request.getRequestURI();
        if (uri.contains("transaction.jsp")) {
    %>
    <h1>
        Order & Tracking > 
        <select id="orderIds" onchange="getSelectedOrderStatus(this)"></select>
    </h1>
    <%
        }
        else if (uri.contains("invoice.jsp")) {
    %>
    <h1>
        Invoice
        <small><span id="inum"></span></small>
    </h1>
    <%
        }
        else {
    %>
    <h1><%=titleName%></h1>
    <%
        }
    %>
    <ol class="breadcrumb">
        <li><a href="index.jsp">Home</a></li>
        <%
            if (uri.contains("addProduct.jsp") || uri.contains("updateMenu.jsp") ||
                    uri.contains("updateProduct.jsp") || uri.contains("updateProductBNM.jsp") ||
                    uri.contains("updateProductImage.jsp") || uri.contains("selectBNM.jsp") ||
                    uri.contains("selectRelatedProducts.jsp")) {
        %>
        <li><a href="products.jsp">All Products </a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (uri.contains("addCat.jsp")) {
        %>
        <li><a href="cat.jsp">All Categories</a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (uri.contains("addPbrand.jsp") || uri.contains("updatePbrand.jsp")) {
        %>
        <li><a href="pbrand.jsp">All Product Brands</a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (uri.contains("addBM.jsp") || uri.contains("updateBM.jsp")) {
        %>
        <li><a href="BM.jsp">All Brand and Model</a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (uri.contains("addZombie.jsp") || uri.contains("updateZombie.jsp")) {
        %>
        <li><a href="zombieManager.jsp">All Zombie Accounts </a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (uri.contains("buyerAccount.jsp")) {
        %>
        <li><a href="viewBuyerAccount.jsp">All Buyer Accounts </a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (uri.contains("transaction.jsp")) {
        %>
        <li><a href="orders.jsp">All Orders</a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (uri.contains("invoice.jsp")) {
        %>
        <li><a href="orders.jsp">All Orders</a></li>
        <li><a href="transaction.jsp?<%=request.getQueryString()%>">Order & Tracking</a></li>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
            else if (!uri.contains("index.jsp")){
        %>
        <li class="active"><a href="<%=hyperlink%>"><%=breadCrumbName%></a></li>
        <%
            }
        %>
    </ol>
</section>