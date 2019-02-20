<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://"
            + // "http" + "://
            request.getServerName()
            + // "myhost"
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
        <div class="page">
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
                                <div class="nonMobileDisplayOption grid-col grid-col-9">
                                    <!-- catalog grid -->
                                    <div style="margin-top: 0px" class="block block-catalog-grid">
                                        <ul id="productGridDesktop">
                                            <li>
                                                <div class="inner">
                                                    <a href="shop-details.jsp?productId=5bbf164b37c15f42c34d59f4" class="pic"></a>
                                                    <div class="product-image-fixed-size">
                                                        <a href="shop-details.jsp?productId=5bbf164b37c15f42c34d59f4" class="pic">
                                                            <img src="temp_images/W4RYky95NL3ya9yLcVOP.jpeg" alt="">
                                                        </a>
                                                    </div>
                                                    <h3 style="height: 40px;">
                                                        <a href="shop-details.jsp?productId=5bbf164b37c15f42c34d59f4">
                                                            <p title="183cc Racing Cylinder - Aerox , N-Max125-155" class="limited-text">183cc Racing Cylinder - Aerox ,...</p>
                                                        </a>
                                                    </h3>
                                                    <p style="height:35px">Big Bore Kits &amp; Aftermarket Engine Parts</p>
                                                    <div class="price">SGD 401.25</div>
                                                    <div class="actions" style="background: rgb(166, 235, 20);">
                                                        <a class="fa fa-plus" onclick="increaseQty( & quot; 5bbf164b37c15f42c34d59f4 & quot; );" style="float: right; padding-left: 8px; padding-top: 2px; color: rgb(0, 0, 0);"></a>
                                                        <input type="text" style="color:black" min="1" value="1" class="qty-style" id="5bbf164b37c15f42c34d59f4Qty" disabled="">
                                                        <a class="fa fa-minus" onclick="reduceQty( & quot; 5bbf164b37c15f42c34d59f4 & quot; );" style="float: right; padding-right: 8px; padding-top: 2px; color: rgb(0, 0, 0);"></a>
                                                        <a id="5bbf164b37c15f42c34d59f4Btn" onclick="addToCart( & quot; 5bbf164b37c15f42c34d59f4 & quot; , 401.25)" style="color: rgb(0, 0, 0);">
                                                            <i class="fa fa-shopping-cart"></i>Add to cart
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="inner">
                                                    <a href="shop-details.jsp?productId=5c0788c485b16f4c50eb71e6" class="pic"></a>
                                                    <div class="product-image-fixed-size">
                                                        <a href="shop-details.jsp?productId=5c0788c485b16f4c50eb71e6" class="pic">
                                                            <img src="temp_images/y5o4OnjfmYM8W7UawdG8.png" alt="">
                                                        </a>
                                                    </div>
                                                    <h3 style="height: 40px;">
                                                        <a href="shop-details.jsp?productId=5c0788c485b16f4c50eb71e6">
                                                            <p title="Overlift Motorcycle/Scooter Hoist" class="limited-text">Overlift Motorcycle/Scooter Hoi...</p>
                                                        </a>
                                                    </h3>
                                                    <p style="height:35px">Workshop Equipment</p>
                                                    <div class="price">SGD 4816.17</div>
                                                    <div class="actions" style="background: rgb(166, 235, 20);">
                                                        <a class="fa fa-plus" onclick="increaseQty(&quot;5c0788c485b16f4c50eb71e6&quot;);" style="float: right; padding-left: 8px; padding-top: 2px; color: rgb(0, 0, 0);"></a>
                                                        <input type="text" style="color:black" min="1" value="1" class="qty-style" id="5c0788c485b16f4c50eb71e6Qty" disabled="">
                                                        <a class="fa fa-minus" onclick="reduceQty(&quot;5c0788c485b16f4c50eb71e6&quot;);" style="float: right; padding-right: 8px; padding-top: 2px; color: rgb(0, 0, 0);"></a>
                                                        <a id="5c0788c485b16f4c50eb71e6Btn" onclick="addToCart(&quot;5c0788c485b16f4c50eb71e6&quot;, 4816.17)" style="color: rgb(0, 0, 0);">
                                                            <i class="fa fa-shopping-cart"></i>Add to cart
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="inner">
                                                    <a href="shop-details.jsp?productId=5c1cb8335cc19f0b15d7c751" class="pic"></a>
                                                    <div class="product-image-fixed-size">
                                                        <a href="shop-details.jsp?productId=5c1cb8335cc19f0b15d7c751" class="pic">
                                                            <img src="temp_images/gZ4ORSibXEW01Yee9toj.jpeg" alt="">
                                                        </a>
                                                    </div>
                                                    <h3 style="height: 40px;">
                                                        <a href="shop-details.jsp?productId=5c1cb8335cc19f0b15d7c751">
                                                            <p title="MOMO Design Fighter Classic White Gloss Black (S) Size" class="limited-text">MOMO Design Fighter Classic Whi...</p>
                                                        </a>
                                                    </h3>
                                                    <p style="height:35px">Helmets</p>
                                                    <div class="price">SGD 299.60</div>
                                                    <div class="actions" style="background: rgb(166, 235, 20);">
                                                        <a class="fa fa-plus" onclick="increaseQty(&quot;5c1cb8335cc19f0b15d7c751&quot;);" style="float: right; padding-left: 8px; padding-top: 2px; color: rgb(0, 0, 0);"></a>
                                                        <input type="text" style="color:black" min="1" value="1" class="qty-style" id="5c1cb8335cc19f0b15d7c751Qty" disabled="">
                                                        <a class="fa fa-minus" onclick="reduceQty(&quot;5c1cb8335cc19f0b15d7c751&quot;);" style="float: right; padding-right: 8px; padding-top: 2px; color: rgb(0, 0, 0);"></a>
                                                        <a id="5c1cb8335cc19f0b15d7c751Btn" onclick="addToCart(&quot;5c1cb8335cc19f0b15d7c751&quot;, 299.60)" style="color: rgb(0, 0, 0);">
                                                            <i class="fa fa-shopping-cart"></i>Add to cart
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <br>
                                    </div>
                                    <!--/ catalog grid -->
                                </div>
                            </div>
                            <div class="mobileDisplayOption featured-product grid-row">
                                <div class="grid-col grid-col-12">
                                    <div id="productGridMobile" class="block block-catalog-grid"></div>
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
                                    <%  for (int i = 1; i <= 50; i++) {%>
                                    <option value="<%=i%>"><%=i%></option>
                                    <%  }
                                      %>
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
        <!--<script src="js/index.js"></script>-->
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>