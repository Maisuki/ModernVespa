<%@page import="common.Global"%>
<head>
    <title>Scooter Narcotics<%=pageName%></title>

    <!-- metas -->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <meta property="og:url"           content="<%=curUrl%>" />
    <meta property="og:type"          content="website" />
    <meta property="og:title"         content="Scooter Narcotics" />
    <meta property="og:description"   content="Scooter Narcotics offers high quality replacement parts from reputable brands all over the world ranging from Polini, Malossi, Stage6, PM tuning, Naraku etc. " />
    <meta property="og:image"         content="https://www.scooter-narcotics.com/img/Emblem.png" />
    <meta property="og:image:type"    content="image/png" />
    <meta property="og:image:width"    content="130px" />
    <meta property="og:image:height"    content="130px" />
    <meta name="google-signin-client_id" content="292673991281-kk8hekpfi5p6smf8eeoi6f6gm2u540rn.apps.googleusercontent.com">
    <!--/ metas -->

    <!-- favicon -->
    <link rel="shortcut icon" type="image/x-icon" href="img/Emblem.png">
    <!--/ favicon -->
    
    <%  if (!request.getRequestURI().contains("invoice-print.jsp")) { %>
    <!-- styles -->
    <link rel="stylesheet" href="css/font-awesome.css">
    <link rel="stylesheet" href="css/jquery.fancybox.css">
    <link rel="stylesheet" href="css/jquery.owl.carousel.css">
    <link rel="stylesheet" href="js/rs-plugin/css/settings.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/color.css">
    <link rel="stylesheet" href="css/loading.css">
    <link rel="stylesheet" href="css/jquery.toast.min.css">
    <link rel="stylesheet" href="css/jquery.toast.css">
    <link rel="stylesheet" href="css/remodal.css">
    <link rel="stylesheet" href="css/remodal-default-theme.css">
    <%  }
        else {
    %>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="fonts/font-awesome.min.css">
    <link rel="stylesheet" href="ionicons/ionicons.min.css">
    <link rel="stylesheet" href="css/admin.css">
    <link rel="stylesheet" href="css/skins.min.css">

    <!-- Google Font -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
    <%
        }
    %>
    <script src="js/facebookapi.js"></script>
    <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
    <script src="js/googleapi.js"></script>
    <%
        if (request.getRequestURI().contains("registration.jsp") || request.getRequestURI().contains("forget-password.jsp") ||
                request.getRequestURI().contains("personalinfo.jsp") || request.getRequestURI().contains("change-password.jsp") ||
                request.getRequestURI().contains("recovery.jsp")) {
    %>
    <script src='https://www.google.com/recaptcha/api.js'></script>
    <%
        }
    %>
    <!--/ styles -->
    <script>        
        var base = '<%=Global.BASE_URL%>';
        var buyer = '<%=Global.BUYER%>';
        var dealer = '<%=Global.DEALER%>';
        var cur = '<%=curUrl%>';
        
        var stripeKey = '<%=Global.STRIPE_PK%>';
    <%
        if (request.getRequestURI().contains("products.jsp")) {
            if (request.getParameter("page") != null) {
                out.println("var page = '" + Integer.parseInt(request.getParameter("page")) + "';");
            }
            else {
                out.println("var page = '1';");
            }
            if (request.getParameter("cat") != null) {
                out.println("var filtercategory = '" + request.getParameter("cat") + "';");
            }
            if (request.getParameter("brand") != null) {
                out.println("var filterbrand = '" + request.getParameter("brand") + "';");
            }
            if (request.getParameter("model") != null) {
                out.println("var filtermodel = '" + request.getParameter("model") + "';");
            }
            if (request.getParameter("search") != null) {
                out.println("var filtersearch = '" + request.getParameter("search") + "';");
            }
        }
        else if (request.getRequestURI().contains("index.jsp")) {
            if (request.getParameter("page") != null) {
                out.println("var page = '" + Integer.parseInt(request.getParameter("page")) + "';");
            }
            else {
                out.println("var page = '1';");
            }
        }
    %>
    </script>
</head>
<%@include file="geoplugin.jsp" %>