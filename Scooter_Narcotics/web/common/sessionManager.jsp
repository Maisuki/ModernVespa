<%
    Object userSession = session.getAttribute("user");
    if (userSession == null) {
%>
<script>
    var role = "";
    var tier = "";
    var userObject = "";
</script>
<%
    }
    else {
%>
<script>
    var role = "${sessionScope.role}";
    var tier = "${sessionScope.tier}";
    var userObject = <%=session.getAttribute("user").toString()%>;
</script>
<%
    }
%>
