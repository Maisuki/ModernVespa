<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI();       // "/people"
    String pageName = " | Cart";
    String titleName = "Shopping Cart";
    String breadCrumbName = "Shop - Cart";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
//         if (session.getAttribute("user") == null) {
//            session.invalidate();
//            response.sendRedirect("login.jsp?page=shop-cart.jsp&message=Session%20Expired%21%20Please%20relogin%21");
//            return;
//        }
    %>
    <body onload="myFunction()" style="margin:0;">
        <div id="loader"></div>
        <div style="display:none;" id="myDiv" class="page">
            <%@include file="common/top_panel.jsp" %>

            <!-- page content -->
            <div class="page-content margin-fixed">
                <%@include file="common/titlePanel.jsp" %>					
                <div class="page-content-section">
                    <div class="grid-row mobile-nav-cart">
                        <div class="grid-row" id="emptyCartDetails">
                            <div align='center' style='margin-bottom: 20px;'>
                                <span>There are no items in your cart! <br>Click 
                                    <a style='text-decoration: underline;' href='products.jsp'>here</a> to browse for your desired products
                                </span>
                            </div>
                        </div>
                        <!-- shopping cart -->
                        <div class="block block-shopping-cart" id="cart"></div>
                        <!--/ shopping cart -->
                    </div>

                    <div class="grid-row" id="additional1" style="margin-bottom: 30px;">
                        <div id="noStock" class="grid-col grid-col-6 grid-col-left" style="margin-bottom: 30px">
                            <p style="color:red;margin-bottom: 10px; " id="errorMsg"></p>
                            Please select an option:
                            <select style="color: white" id="outStockOption">
                                <option style="color: black" value="SL">Ship when all the stocks are available</option>
                                <option style="color: black" value="SH">Ship those items that are available now and ship the rest when is available</option>
                            </select>
                        </div> 
                        <br>
                        <div class="grid-col grid-col-6 grid-col-left">
                            <div id="saveNotepad"class="input">
                                <textarea type="text" class="note-pad" id="notepadName" placeholder="Notepad Name" required></textarea> <span class="save-notepad"><a onclick="save()" class="button">Save to notepad</a></span>
                            </div>
                        </div>
                        <div class="grid-col-4 grid-col-right">
                            <a onclick="next()" class="mobile-checkout button">Proceed To Checkout</a>
                        </div>
                    </div>							
                </div>
                <div class="remodal" data-remodal-id="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDesc" data-remodal-options="closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false">
                    <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                    <div>
                        <h2 id="modalTitle"></h2>
                        <br>
                        <p id="modalDesc">
                            <a id="prodImageLink" class='pic'>
                                <img id="prodImage" width='150' height='150' alt=''>
                            </a>
                        </p>
                        <div id="pnopanel">
                            <h3 style="display: inline-block; float: left; width: 20%; text-align: left;"><b>Part No:</b></h3>
                            <h3 id="prodpNo" style="display: inline-block; float: right; width: 65%; text-align: left;"></h3>
                        </div>
                        <div id="pdescpanel">
                            <h3 style="display: inline-block; float: left; width: 20%; text-align: left;"><b>Description:</b></h3>
                            <h3 id="prodDesc" style="display: inline-block; float: right; width: 65%; text-align: left;"></h3>
                        </div>
                        <div id="ppricepanel">
                            <h3 style="display: inline-block; float: left; width: 20%; text-align: left;"><b>Price:</b></h3>
                            <h3 id="prodPrice" style="display: inline-block; float: right; width: 65%; text-align: left;"></h3>
                        </div>
                        <div id="pweightpanel">
                            <h3 style="display: inline-block; float: left; width: 20%; text-align: left;"><b>Weight</b></h3>
                            <h3 id="prodWeight" style="display: inline-block; float: right; width: 65%; text-align: left;"></h3>
                        </div>
                    </div>
                    <br>
                    <button data-remodal-action="cancel" class="remodal-cancel">Close</button>
                </div>
            </div>
            <!--/ page content -->

            <jsp:include page="common/footer.jsp"/>
        </div>
        
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/shop-cart.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>