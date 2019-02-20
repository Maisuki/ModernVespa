<%@page import="com.google.gson.JsonObject"%>
<%
    JsonObject user = (JsonObject) session.getAttribute("user");
    String username = user.get("username").getAsString();
    String role = (String) session.getAttribute("role");
%>
<header class="main-header">
    <!-- Logo -->
    <a href="index.jsp" class="logo">
        <span class="logo-mini"><b>SN</b></span>
        <span class="logo-lg">Scooter Narcotics</span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
            <img src="images/menu-icon.png" width="15" height="15" alt="">
        </a>
    </nav>
</header>

<%
    String currentUri = request.getRequestURI();
    currentUri = currentUri.substring(currentUri.lastIndexOf("/") + 1);
    String isHome = currentUri.equals("index.jsp") ? "class='active treeview menu-open'" : "";
    String isProduct = currentUri.equals("products.jsp") ? "class='active treeview menu-open'" : "";
    String isCat = currentUri.equals("cat.jsp") ? "class='active treeview menu-open'" : "";
    String isPBrand = currentUri.equals("pbrand.jsp") ? "class='active treeview menu-open'" : "";
    String isBM = currentUri.equals("BM.jsp") ? "class='active treeview menu-open'" : "";
    String isZombie = currentUri.equals("zombieManager.jsp") ? "class='active treeview menu-open'" : "";
    String isAccountApproval = currentUri.equals("accountApproval.jsp") ? "class='active treeview menu-open'" : "";
    String isBuyerAccount = currentUri.equals("viewBuyerAccount.jsp") ? "class='active treeview menu-open'" : "";
    String isDealerAccount = currentUri.equals("viewDealerAccount.jsp") ? "class='active treeview menu-open'" : "";
    String isOrders = currentUri.equals("orders.jsp") ? "class='active treeview menu-open'" : "";
%>

<!-- Left side column. contains the logo and sidebar -->
<aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
        <!-- Sidebar user panel -->
        <div class="user-panel">
            <div class="pull-left image">
                <img src="images/profile.png" class="img-circle" alt="User Image">
            </div>
            <div class="pull-left info">
                <p><%=username.equals("scooter_admin") ? "Administrator" : username %></p>
                <%  if (!role.equals("Admin")) {%>
                <p><i><%=role%></i></p>
                <%  } %>
            </div>
        </div>
        <ul class="sidebar-menu" data-widget="tree">
            <li <%=isHome%>>
                <a href="index.jsp">
                    <img src="images/dashboard.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Dashboard</span>
                </a>
            </li>
            <li <%=isProduct%>>
                <a href="products.jsp">
                    <img src="images/products.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Products</span>
                </a>
            </li>
            <li <%=isCat%>>
                <a href="cat.jsp">
                    <img src="images/orders.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Categories</span>
                </a>
            </li>
            <li <%=isPBrand%>>
                <a href="pbrand.jsp">
                    <img src="images/orders.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Product Brand</span>
                </a>
            </li>
            <li <%=isBM%>>
                <a href="BM.jsp">
                    <img src="images/orders.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Brand and Model</span>
                </a>
            </li>
            <%
                if (user.get("role_id").getAsString().equals("999")) {
            %>
            <li <%=isZombie%>>
                <a href="zombieManager.jsp">
                    <img src="images/products.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Zombie Account Manager</span>
                </a>
            </li>
            <li <%=isAccountApproval%>>
                <a href="accountApproval.jsp">
                    <img src="images/products.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Approve Account</span>
                </a>
            </li>

            <li <%=isBuyerAccount%>>
                <a href="viewBuyerAccount.jsp">
                    <img src="images/products.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>View Buyer Accounts</span>
                </a>
            </li>
            <li <%=isDealerAccount%>>
                <a href="viewDealerAccount.jsp">
                    <img src="images/products.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>View Dealer Accounts</span>
                </a>
            </li>
            <li <%=isOrders%>>
                <a href="orders.jsp">
                    <img src="images/orders.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Orders</span>
                </a>
            </li>
            <%
                }
            %>
            <li>
                <a href="logout">
                    <img src="images/login.png" width="15" height="15" style="margin-top: -5px" alt="">
                    &nbsp;&nbsp;
                    <span>Logout</span>
                </a>
            </li>
        </ul>
    </section>
</aside>