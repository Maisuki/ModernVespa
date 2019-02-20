<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String pageName = " | Log in";
    if (session.getAttribute("user") != null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body class="hold-transition login-page">
        <div class="login-box">
            <div class="login-logo">
                <b>Scooter Narcotics</b>
            </div>
            <!-- /.login-logo -->
            <div class="login-box-body">
                <p class="login-box-msg">Login</p>
                <form id="loginForm" action="loginA" method="post">
                    <input type="hidden" name="page">
                    <font id="message" color="red"></font>
                    <div class="form-group has-feedback">
                        <input type="text" id="username" class="form-control" placeholder="Username">
                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="password" id="password" class="form-control" placeholder="Password">
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                    </div>
                    <div class="row">
                        <!-- /.col -->
                        <div class="col-sm-8">
                            <input type="checkbox" id="zombie" style="float:left"> Zombie Login
                        </div>
                         
                        <div class="col-sm-4 col-xs-12">
                            <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
                        </div>
                        <!-- /.col -->
                    </div>
                </form>
            </div>
            <!-- /.login-box-body -->
        </div>
        <!-- /.login-box -->
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/login.js"></script>
    </body>
</html>