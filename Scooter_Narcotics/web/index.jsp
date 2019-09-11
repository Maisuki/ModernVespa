<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
    request.getServerName() +       // "myhost"
    request.getRequestURI();       // "/people"
    String pageName = "";
    String titleName = "Main";
    String breadCrumbName = "Main";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body>
        <%@include file="common/facebooklogin.jsp" %>
        <div style="display:none;" id="myDiv" class="page">
            <%@include file="common/top_panel.jsp" %>
            <div class="page-content margin-fixed">	
                <div id="banner_filter-section" class="grid-row" style="background-color:#000">
                    <jsp:include page="common/filterSearchPanel.jsp"></jsp:include>
                    
                    <jsp:include page="common/filterSearchPanelResponsive.jsp"></jsp:include>
                    
                    <%@include file="common/bannerPanel.jsp" %>
                </div>
                <!-- page content -->
                <div id="featured-products-section" class="page-content">				
                    <!-- page content section -->
                    <div class="page-content-section" id="featuredProduct">
                        <div class="featured-product grid-row">
                            <div class="nonMobileDisplayOption grid-col grid-col-left grid-col-2" style="margin-left: 15px;">
                                <h2>Featured Products</h2>
                                <!-- categories filter -->
                                <form>
                                    <div class="widget widget-categories-filter">
                                        <div class="widget-head-2 nonMobileDisplayOption">Categories</div>
                                        <ul class="nonMobileDisplayOption" id="cat">
                                            <jsp:include page="common/categoriesSide.jsp"></jsp:include>
                                        </ul>
                                        <br>
                                    </div>
                                </form>
                                <!--/ categories filter -->
                            </div>
                            <div class="nonMobileDisplayOption grid-col grid-col-right grid-col-9">
                                <!-- catalog grid -->
                                <div style="margin-top: 0px" class="block block-catalog-grid">
                                    <ul id="productGridDesktop"></ul>
                                    <br>
                                </div>
                                <div style="margin-top: 0px" class="block block-catalog-grid">
                                    <h2>Newly Added Products</h2>
                                    <ul id="top10productGridDesktop"></ul>
                                    <br>
                                </div>
                                <!--/ catalog grid -->
                            </div>
                        </div>
                        <div class="mobileDisplayOption featured-product grid-row">
                            <div class="grid-col grid-col-12">
                                <div id="productGridMobile" class="block block-catalog-grid"></div>
                            </div>
                            <div class="grid-col grid-col-12">
                                <div id="Top10productGridMobile" class="block block-catalog-grid"></div>
                            </div>
                        </div>
                    </div>
                                        
                    <div class="remodal" data-remodal-id="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDesc" data-remodal-options="closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false">
                        <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                        <div>
                            <h2 id="modalTitle"><b>Choose Quantity</b></h2>
                            <br>
                            <h3 style="width: 150px; text-align: left; display: inline-block; float: left; margin-bottom: 10px;" id="productName"></h3>
                            <h3 style="display: inline-block; float: right;" id="productPrice"></h3>
                            <p id="modalDesc">
                                <input id="productId" type="hidden" />
                                <br>
                                
                                <select style="-webkit-appearance: menulist-button; border: 1px solid #81c784;" id="productQuantity">
                                    <%  for (int i = 1; i <= 50; i++) { %>
                                    <option value="<%=i%>"><%=i%></option>
                                    <%  } %>
                                </select>
                            </p>
                        </div>
                        <br>
                        <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
                        <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
                    </div>
                </div>
                <!--/ page content -->
                <jsp:include page="common/footer.jsp"/>
            </div>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/index.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>