<%
    String currentUri = request.getRequestURI();
    String fileName = currentUri.substring(currentUri.lastIndexOf("/") + 1);
    fileName = fileName.split("#")[0];
%>
<div class="grid-col grid-col-left grid-col-2">
    <!-- categories filter -->
    <div class="widget widget-categories-filter">
        <div class="widget-head-2">Welcome, <b><%=session.getAttribute("name")%></b></div>
        <ul>
            <li>
                <a href="account.jsp" <%=(fileName.equals("account.jsp") || fileName.equals("personalinfo.jsp") || fileName.equals("change_password.jsp") ? "class='active'" : "") %>>
                    <img src='img/plus.jpg' width='15' height='15' alt />&nbsp;&nbsp;
                    <label style="display: inline-flex; width: 89%;">Account Dashboard</label>
                </a>
            </li>
            <li>
                <a href="orders.jsp" <%=(fileName.equals("orders.jsp") ? "class='active'" : "") %>>
                    <img src='img/plus.jpg' width='15' height='15' alt />&nbsp;&nbsp;
                    <label style="display: inline-flex; width: 89%;">Orders</label>
                </a>
            </li>
            <li>
                <a href="view-notepad.jsp" <%=(fileName.equals("view-notepad.jsp") ? "class='active'" : "") %>>
                    <img src='img/plus.jpg' width='15' height='15' alt />&nbsp;&nbsp;
                    <label style="display: inline-flex; width: 89%;">View Notepad</label>
                </a>
            </li>
        </ul>
    </div>
    <!--/ categories filter -->
</div>