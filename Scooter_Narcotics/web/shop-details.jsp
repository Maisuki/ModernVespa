<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI() +       // "/people"
             "?" +                           // "?"
             request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = " | Product Details";
    String titleName = "Shop";
    String breadCrumbName = "Details";
    
    if (request.getParameter("productId") == null) {
        response.sendRedirect("products.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body onload="myFunction()" style="margin:0;">
        <div id="loader"></div>
        <div style="display:none;" id="myDiv" class="page">
            <%@include file="common/top_panel.jsp" %>
            
            <%@include file="common/titlePanel.jsp" %>
            
            <!-- page content -->
            <div class="page-content ">						
                <div class="page-content-section margin-fixed">
                    <div class="grid-row" id="productDetail">
                        <div class="grid-col grid-col-left grid-col-2" style="margin-top: -50px">
                            <!-- categories filter -->
                            <form>
                                <div class="widget widget-categories-filter" style="margin-top: 40px;">
                                    <div class="select mobileDisplayOption" style="margin-bottom: -40px;">
                                        <select style="color:white; border-radius:7px; background-color:rgba(58,58,58,0.7)" id="categories">
                                            <jsp:include page="common/categories.jsp"></jsp:include>
                                        </select>
                                    </div>  
                                    <div class="widget-head-2 nonMobileDisplayOption">Categories</div>
                                    <ul class="nonMobileDisplayOption" id="cat">
                                        <jsp:include page="common/categoriesSide.jsp"></jsp:include>
                                    </ul>
                                    <br>
                                </div>
                            </form>
                            <!--/ categories filter -->
                        </div>
                        <div style="margin-top: -50px" class="grid-col grid-col-right grid-col-9">
                            <!-- product details -->
                            <div class="block block-product-details-2 clearfix" id="info">
                                <div class="pics" id="productImagesPanel"></div>
                                <div class="info">
                                    <br><br>
                                    <div id="productBasicInformationPanel"></div>
                                </div>
                            </div>
                            <!-- product tabs -->
                            <div class="block block-product-tabs">
                                <div class="head">
                                    <a href="#block-product-tabs-1" class="active">Description</a>
                                    <a href="#block-product-tabs-2">Details</a>
                                    <a href="#block-product-tabs-3">Reviews</a>
                                    <a href="#block-product-tabs-4">Fitment List</a>
                                </div>
                                    <div id="block-product-tabs-1" class="cont active">
                                        <p id="descriptionPanel"></p>
                                    </div>
                                    <div id="block-product-tabs-2" class="cont">
                                        <p id="productDetailsPanel"></p>
                                    </div>
                                    <div id="block-product-tabs-3" class="cont">
                                        <div id="reviewsPanel"></div>
                                    <%
                                        if (session.getAttribute("user") != null) {
                                    %>
                                        <br>
                                        <h3><u>Submit New Review</u></h3>
                                        <br>
                                        <input type="text" id="userComments" placeholder="Enter new review"/>
                                        <div class="mobile-nav-display-full" style="margin-top: 15px;">
                                            <label style="margin-top: 10px;">Ratings (out of 5):</label>
                                            <br>
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="1"><i></i>1
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="2"><i></i>2
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="3"><i></i>3
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="4"><i></i>4
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="5"><i></i>5
                                            </label>
                                        </div>
                                        
                                        <div class="mobile-nav-display-none" style="margin-top: 15px;">
                                            Ratings (out of 5):
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="1"><i></i>1
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="2"><i></i>2
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="3"><i></i>3
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="4"><i></i>4
                                            </label>
                                            &emsp;
                                            <label class="radio">
                                                <input class="ratings" type="radio" name="userRatings" value="5"><i></i>5
                                            </label>
                                        </div>
                                        <br>
                                        <a class="button"  id="submitComment"  onclick="submitReview()">Submit Review</a>
                                    <%
                                        }
                                    %>
                                </div>
                                <div id="block-product-tabs-4" class="cont">
                                    <p id="fitmentListPanel"></p>
                                </div>
                            </div>
                            <!--/ product tabs -->
                            <div class="block-head contact-title">
                                You may also like...
                            </div>
                            <div class="nonMobileDisplayOption grid-col grid-col-right grid-col-9" style="margin-top: -10px">
                                <div class="block block-catalog-grid">
                                    <ul style="margin-left: 0px;" id="productGridDesktop"></ul>
                                </div>
                            </div>
                            <div class="mobileDisplayOption grid-col grid-col-right grid-col-9" style="margin-top: -10px">
                                <div class="block block-catalog-grid">
                                    <ul id="productGridMobile"></ul>
                                </div>
                            </div>
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
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/shop-details.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>


