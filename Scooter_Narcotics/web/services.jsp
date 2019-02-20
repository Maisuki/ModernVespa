<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://"
            + // "http" + "://
            request.getServerName()
            + // "myhost"
            request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "Services";
    String breadCrumbName = "Services";
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
                    <!-- page content section -->
                    <div class="page-content-section">
                        <div class="grid-row">
                            <!-- services -->
                            <div class='block' id='hideService' style='padding-left: 15px; padding-right: 15px;'>
                                <div class="block-head block-head-4 grid-col" style="line-height: 180%; font-size: 16px; margin-bottom: 30px; margin-top: 20px">
                                    <div align='center'>
                                        <p>
                                            Apart from distributing high quality parts, the Scooter Narcotics repair workshop offers a full range of services 
                                            to ensure that your beloved motorcycle is ready to rock the roads. Our list of know-how-to-fix scooters includes 
                                            models from Aprilia, Daelim, Gilera, Honda, Kymco, Peugeot, Piaggio, S.Y.M, Vespa and many more. <br/>
                                            Our team of experienced mechanics on-site are equipped with necessary knowledge to help you clarify any doubts to 
                                            ensure that your ride is up and running well. <br/>
                                            Our workshop team takes pride in our work and aims to provide customers with the following guarantees for a smooth repair journey.
                                        </p>
                                        <br/>
                                        <p>The Scooter Narcotics team aims to:</p>
                                        <ol>
                                            <li class='myCustomListItem'>Follow proper guidelines and procedures of vehicle maintenance</li>
                                            <li class='myCustomListItem'>Show customers their used parts before next steps</li>
                                            <li class='myCustomListItem'>Prioritize safety over performance for all repairs</li>
                                            <li class='myCustomListItem'>Advising our customers on key repair works in the event of a tight-budget repair</li>
                                            <li class='myCustomListItem'>Quote as closely as possible before carrying out repairs</li>
                                        
                                        </ol>
                                    </div>
                                    <%--
                                    <p align="center">
                                        Scooter Narcotics provide a quality and personalised range of bike servicing package for your scooter.<br>
                                        We offer a range of minor to major services to ensure your motorcycles are in excellent condition. Be it changing your engine oil, blown bulbs, renewing your brakes, a brand new pair of tires to more complex issues, without compromising your safety, we are here for you.
                                        We assure you we only use quality genuine parts for your scooter, so you need not worry for your next inspection.
                                        Our mechanics are trained with many years of experience, they are equipped with plenty of knowledge to help you with your queries and doubts to make sure your scooters are up and running well.
                                    </p>
                                    --%>
                                    <h2 style="text-align: center; text-transform: uppercase; color: #a6eb14; font-weight: bold; margin-top: 50px; font-size: 24px;">Our Services</h2>
                                </div>
                            </div>
                            <div class="block block-services block-services-2" id="hideService" style="padding-left: 15px; padding-right: 15px;">
                                <div class="sDesktopDisplayOption block-cont">
                                    <ul>
                                        <li>
                                            <a href="img/Services/Adiva_125cc.jpg" class="fancybox"><img src="img/Services/Adiva_125cc.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Adiva 125cc</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Adiva_200cc.jpg" class="fancybox"><img src="img/Services/Adiva_200cc.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Adiva 200cc</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Aprilia_Scarabeo_200.jpg" class="fancybox"><img src="img/Services/Aprilia_Scarabeo_200.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Aprilia Scarabeo 200</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Aprilia_Sr_Max_300.jpg" class="fancybox"><img src="img/Services/Aprilia_Sr_Max_300.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Aprilia Sr Max 300</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/BMW_650_SPORT.jpg" class="fancybox"><img src="img/Services/BMW_650_SPORT.jpg" height="180px"></a>
                                            <h3 style="color:#fff">BMW 650 SPORT</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Gilera_ST_200.jpg" class="fancybox"><img src="img/Services/Gilera_ST_200.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Gilera ST 200</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Honda_PCX_150.jpg" class="fancybox"><img src="img/Services/Honda_PCX_150.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Honda PCX 150</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Peugeot_Vivacity_125.jpg" class="fancybox"><img src="img/Services/Peugeot_Vivacity_125.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Peugeot Vivacity 125</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Piaggio_Aprillia_125_150.jpg" class="fancybox"><img src="img/Services/Piaggio_Aprillia_125_150.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Piaggio Aprillia 125 150</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/SYM_GTS_Joyride_200.jpg" class="fancybox"><img src="img/Services/SYM_GTS_Joyride_200.jpg" height="180px"></a>
                                            <h3 style="color:#fff">SYM GTS 200/SYM Joyride 200</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/SYM_Maxsym_400i.jpg" class="fancybox"><img src="img/Services/SYM_Maxsym_400i.jpg" height="180px"></a>
                                            <h3 style="color:#fff">SYM Maxsym 400i</h3>
                                        </li>
                                        <li>                                      
                                            <a href="img/Services/Suzuki_burgman_200.jpg" class="fancybox"><img src="img/Services/Suzuki_burgman_200.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Suzuki Burgman 200</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Suzuki_burgman_400.jpg" class="fancybox"><img src="img/Services/Suzuki_burgman_400.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Suzuki Burgman 400</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Suzuki_burgman_AN650.jpg" class="fancybox"><img src="img/Services/Suzuki_burgman_AN650.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Suzuki Burgman AN650</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Vespa_GTS300.jpg" class="fancybox"><img src="img/Services/Vespa_GTS300.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Vespa GTS300</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Vespa_LX150.jpg" class="fancybox"><img src="img/Services/Vespa_LX150.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Vespa LX150</h3>
                                        </li>
                                        <%--
                                        <li>
                                            <a href="img/Services/Yamaha_nmax_155.jpg" class="fancybox"><img src="img/Services/Yamaha_nmax_155.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Yamaha Nmax 155/Yamaha Aerox 155</h3>
                                        </li>
                                        --%>
                                        <li>
                                            <a href="img/Services/Yamaha_xmax_300.jpg" class="fancybox"><img src="img/Services/Yamaha_xmax_300.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Yamaha Xmax 300</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Yamaha_Tmax_530.jpg" class="fancybox"><img src="img/Services/Yamaha_Tmax_530.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Yamaha Tmax 530</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Honda_Forza_300.jpg" class="fancybox"><img src="img/Services/Honda_Forza_300.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Honda Forza 300</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Kymco_Xciting_400i.jpg" class="fancybox"><img src="img/Services/Kymco_Xciting_400i.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Kymco Xciting 400i</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Yamaha_aerox_155.jpg" class="fancybox"><img src="img/Services/Yamaha_aerox_155.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Yamaha Aerox 155</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Yamaha_nmax_155.jpg" class="fancybox"><img src="img/Services/Yamaha_nmax_155.jpg" height="180px"></a>
                                            <h3 style="color:#fff">Yamaha Nmax 155</h3>
                                        </li>
                                    </ul>
                                </div>

                                <div class="sTabletDisplayOption block-cont">
                                    <ul>
                                        <li style="width: 33%">
                                            <a href="img/Services/Adiva_125cc.jpg" class="fancybox">
                                                <img src="img/Services/Adiva_125cc.jpg" height="140">
                                            </a>
                                            <h3 style="color:#fff">Adiva 125cc</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Adiva_200cc.jpg" class="fancybox">
                                                <img src="img/Services/Adiva_200cc.jpg" height="140">
                                            </a>
                                            <h3 style="color:#fff">Adiva 200cc</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Aprilia_Scarabeo_200.jpg" class="fancybox">
                                                <img src="img/Services/Aprilia_Scarabeo_200.jpg" height="140">
                                            </a>
                                            <h3 style="color:#fff">Aprilia Scarabeo 200</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Aprilia_Sr_Max_300.jpg" class="fancybox">
                                                <img src="img/Services/Aprilia_Sr_Max_300.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Aprilia Sr Max 300</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/BMW_650_SPORT.jpg" class="fancybox">
                                                <img src="img/Services/BMW_650_SPORT.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">BMW 650 SPORT</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Gilera_ST_200.jpg" class="fancybox">
                                                <img src="img/Services/Gilera_ST_200.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Gilera ST 200</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Honda_PCX_150.jpg" class="fancybox">
                                                <img src="img/Services/Honda_PCX_150.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Honda PCX 150</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Peugeot_Vivacity_125.jpg" class="fancybox">
                                                <img src="img/Services/Peugeot_Vivacity_125.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Peugeot Vivacity 125</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Piaggio_Aprillia_125_150.jpg" class="fancybox">
                                                <img src="img/Services/Piaggio_Aprillia_125_150.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Piaggio Aprillia 125 150</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/SYM_GTS_Joyride_200.jpg" class="fancybox">
                                                <img src="img/Services/SYM_GTS_Joyride_200.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">SYM GTS 200/SYM Joyride 200</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/SYM_Maxsym_400i.jpg" class="fancybox">
                                                <img src="img/Services/SYM_Maxsym_400i.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">SYM Maxsym 400i</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Suzuki_burgman_200.jpg" class="fancybox">
                                                <img src="img/Services/Suzuki_burgman_200.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Suzuki Burgman 200</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Suzuki_burgman_400.jpg" class="fancybox">
                                                <img src="img/Services/Suzuki_burgman_400.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Suzuki Burgman 400</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Suzuki_burgman_AN650.jpg" class="fancybox">
                                                <img src="img/Services/Suzuki_burgman_AN650.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Suzuki Burgman AN650</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Vespa_GTS300.jpg" class="fancybox">
                                                <img src="img/Services/Vespa_GTS300.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Vespa GTS300</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Vespa_LX150.jpg" class="fancybox">
                                                <img src="img/Services/Vespa_LX150.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Vespa LX150</h3>
                                        </li>
                                        <%--
                                        <li style="width: 33%">
                                            <a href="img/Services/Yamaha_nmax_155.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_nmax_155.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Yamaha Nmax 155/Yamaha Aerox 155</h3>
                                        </li>
                                        --%>
                                        <li style="width: 33%">
                                            <a href="img/Services/Yamaha_xmax_300.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_xmax_300.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Yamaha Xmax 300</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Yamaha_Tmax_530.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_Tmax_530.jpg" height="140px">
                                            </a>
                                            <h3 style="color:#fff">Yamaha Tmax 530</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Honda_Forza_300.jpg" class="fancybox">
                                                <img src="img/Services/Honda_Forza_300.jpg" height="140px"></a>
                                            <h3 style="color:#fff">Honda Forza 300</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Kymco_Xciting_400i.jpg" class="fancybox">
                                                <img src="img/Services/Kymco_Xciting_400i.jpg" height="140px"></a>
                                            <h3 style="color:#fff">Kymco Xciting 400i</h3>
                                        </li>
                                        <li style="width: 33%">
                                            <a href="img/Services/Yamaha_aerox_155.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_aerox_155.jpg" height="140px"></a>
                                            <h3 style="color:#fff">Yamaha Aerox 155</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Yamaha_nmax_155.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_nmax_155.jpg" height="140px"></a>
                                            <h3 style="color:#fff">Yamaha Nmax 155</h3>
                                        </li>
                                    </ul>
                                </div>

                                <div class="sMobileDisplayOption block-cont">
                                    <ul>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Adiva_125cc.jpg" class="fancybox">
                                                <img src="img/Services/Adiva_125cc.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Adiva 125cc</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/Adiva_200cc.jpg" class="fancybox">
                                                <img src="img/Services/Adiva_200cc.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Adiva 200cc</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Aprilia_Scarabeo_200.jpg" class="fancybox">
                                                <img src="img/Services/Aprilia_Scarabeo_200.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Aprilia Scarabeo 200</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/Aprilia_Sr_Max_300.jpg" class="fancybox">
                                                <img src="img/Services/Aprilia_Sr_Max_300.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Aprilia Sr Max 300</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/BMW_650_SPORT.jpg" class="fancybox">
                                                <img src="img/Services/BMW_650_SPORT.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">BMW 650 SPORT</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/Gilera_ST_200.jpg" class="fancybox">
                                                <img src="img/Services/Gilera_ST_200.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Gilera ST 200</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Honda_PCX_150.jpg" class="fancybox">
                                                <img src="img/Services/Honda_PCX_150.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Honda PCX 150</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/Peugeot_Vivacity_125.jpg" class="fancybox">
                                                <img src="img/Services/Peugeot_Vivacity_125.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Peugeot Vivacity 125</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Piaggio_Aprillia_125_150.jpg" class="fancybox">
                                                <img src="img/Services/Piaggio_Aprillia_125_150.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Piaggio Aprillia 125 150</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/SYM_GTS_Joyride_200.jpg" class="fancybox">
                                                <img src="img/Services/SYM_GTS_Joyride_200.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">SYM GTS 200/SYM Joyride 200</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/SYM_Maxsym_400i.jpg" class="fancybox">
                                                <img src="img/Services/SYM_Maxsym_400i.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">SYM Maxsym 400i</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">                                   
                                            <a href="img/Services/Suzuki_burgman_200.jpg" class="fancybox">
                                                <img src="img/Services/Suzuki_burgman_200.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Suzuki Burgman 200</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Suzuki_burgman_400.jpg" class="fancybox">
                                                <img src="img/Services/Suzuki_burgman_400.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Suzuki Burgman 400</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/Suzuki_burgman_AN650.jpg" class="fancybox">
                                                <img src="img/Services/Suzuki_burgman_AN650.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Suzuki Burgman AN650</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Vespa_GTS300.jpg" class="fancybox">
                                                <img src="img/Services/Vespa_GTS300.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Vespa GTS300</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/Vespa_LX150.jpg" class="fancybox">
                                                <img src="img/Services/Vespa_LX150.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Vespa LX150</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Yamaha_nmax_155.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_nmax_155.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Yamaha Nmax 155/Yamaha Aerox 155</h3>
                                        </li>
                                        <li class="half-right service-panel-height-mobile">
                                            <a href="img/Services/Yamaha_xmax_300.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_xmax_300.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Yamaha Xmax 300</h3>
                                        </li>
                                        <li class="half-left service-panel-height-mobile">
                                            <a href="img/Services/Yamaha_Tmax_530.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_Tmax_530.jpg" height="100px">
                                            </a>
                                            <h3 style="color:#fff">Yamaha Tmax 530</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Honda_Forza_300.jpg" class="fancybox">
                                                <img src="img/Services/Honda_Forza_300.jpg" height="100px"></a>
                                            <h3 style="color:#fff">Honda Forza 300</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Kymco_Xciting_400i.jpg" class="fancybox">
                                                <img src="img/Services/Kymco_Xciting_400i.jpg" height="100px"></a>
                                            <h3 style="color:#fff">Kymco Xciting 400i</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Yamaha_aerox_155.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_aerox_155.jpg" height="100px"></a>
                                            <h3 style="color:#fff">Yamaha Aerox 155</h3>
                                        </li>
                                        <li>
                                            <a href="img/Services/Yamaha_nmax_155.jpg" class="fancybox">
                                                <img src="img/Services/Yamaha_nmax_155.jpg" height="100px"></a>
                                            <h3 style="color:#fff">Yamaha Nmax 155</h3>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!--/ services -->
                        </div>
                    </div>
                    <!--/ page content section -->
                </div>
                <!--/ page content -->

                <jsp:include page="common/footer.jsp"/>
            </div>
        </div>

        <%@include file="common/footer-imports.jsp" %>
        <script src="js/services.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>