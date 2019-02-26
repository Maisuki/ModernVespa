<%@page import="java.text.DecimalFormat"%>
<%@page import="common.DoubleFactory"%>
<%@page import="common.StringEntityTranslator"%>
<%@page import="com.google.gson.JsonElement"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="com.google.gson.JsonParser"%>
<%@page import="controller.SNServer"%>
<%@page import="common.Global"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String curUrl = request.getScheme() + "://" +   // "http" + "://
             request.getServerName() +       // "myhost"
             request.getRequestURI() +       // "/people"
             "?" +                           // "?"
             request.getQueryString();       // "lastname=Fox&age=30"
    String pageName = "";
    String titleName = "Account Dashboard";
    String breadCrumbName = "My Profile - Notepad";
    String requestUrl = request.getRequestURL().toString();
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <%
        if (session.getAttribute("user") == null) {
            session.invalidate();
            response.sendRedirect("login.jsp?page=view-notepad.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
    %>
    <body>
        <div class="page">
            <%@include file="common/top_panel.jsp" %>

            <!-- page content -->
            <div class="page-content margin-fixed">
                <%@include file="common/titlePanel.jsp" %>
                <div class="page-content-section">
                    
                    <div class="grid-row">
                        <%@include file="common/authorizedUserSidebar.jsp" %>
                        
                        <div class="grid-col grid-col-right grid-col-9">
                            <div class="grid-row" style="margin-left: 0px; margin-right: 0px;">
                                <div class="mobileDisplayOption block-head block-head-4 grid-col-9 grid-col"  style="line-height: 0; font-size: 16px;">
                                    <h2 style="text-transform: uppercase; color: #a6eb14; font-weight: bold; font-size: 24px; float: left;">My Notepad List</h2>
                                </div>
                                <div class="mobileDisplayOption" style="margin-bottom: 30px;">
                                    <a style='float: right;' id="newnotepad" class="underline-link">New Notepad</a>
                                </div>
                                <div class="nonMobileDisplayOption block-head block-head-4 grid-col-9 grid-col" style="line-height: 180%; font-size: 16px; margin-bottom: 30px;">
                                    <h2 style="text-transform: uppercase; color: #a6eb14; font-weight: bold; font-size: 24px; float: left;">My Notepad List</h2>
                                    <div style="display: inline-block; float: right; margin-left: 30px;">
                                        <a id="newnotepad1" class="underline-link">New Notepad</a>
                                    </div>
                                </div>

                                <%
                                    String[] splittedUri = requestUrl.split("/");
                                    if (application.getAttribute("activenps") == null) {
                                        out.println("<script>");
                                        out.println("location.href='retrieveNp';");
                                        out.println("</script>");
                                        return;
                                    }
                                    JsonArray activenps = (JsonArray) application.getAttribute("activenps");
                                    JsonArray inactivenps = (JsonArray) application.getAttribute("inactivenps");
                                    application.removeAttribute("activenps");
                                    application.removeAttribute("inactivenps");
                                %>

                                <%-- ACTIVE NOTEPAD --%>
                                <div class="activenp grid-col-9 grid-col">
                                    <%
                                        for (JsonElement elem : activenps) {
                                            JsonObject activenp = elem.getAsJsonObject();
                                            String npName = activenp.get("npName").getAsString();
                                            String npId = activenp.get("_id").getAsString();
                                            JsonArray items = null;
                                            if (activenp.get("selected").getAsBoolean()) {
                                                items = activenp.get("items").getAsJsonArray();
                                            }
                                    %>
                                    <div class="block-head block-head-4 grid-col-9 grid-col" style="line-height: 180%; font-size: 16px; margin-bottom: 30px;">
                                        <h4 id="<%=npId%>npName" style="text-transform: uppercase; color: #a6eb14; font-weight: bold; font-size: 17px;display: inline-block;">
                                            <%=npName%>
                                        </h4>
                                        <div style="display: inline-block; float: right; margin-left: 30px;">
                                            <label style="margin-top: 7px;" class="checkbox mobile-billing-address">
                                                <input class="activenpcheckhandler" type="checkbox" value="<%=npId%>" <%=activenp.get("active").getAsBoolean() ? "checked" : ""%>>
                                                <i class="fa fa-check"></i>Active
                                            </label>
                                        </div>
                                        <%
                                            if (activenp.get("selected").getAsBoolean()) {
                                        %>
                                        <div class="nonMobileDisplayOption" style="float: right;">
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="copyToCart('<%=npId%>')">Copy to Cart</a>
                                            </div>
                                            <div style="float: right;">
                                                <a class="underline-link" onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                            </div>
                                        </div>
                                        
                                        <div class="dropdown specialDisplay">
                                            <button class="dropbtn specialDisplay">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-content">
                                                <a onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                                <a onclick="copyToCart('<%=npId%>')">Copy to Cart</a>
                                                <a onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                        </div>
                                        <%
                                            }
                                            else {
                                        %>
                                        <div class="nonMobileDisplayOption" style="float: right;">
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                            </div>
                                            <div style="float: right;">
                                                <a class="underline-link" onclick="viewNotepad('<%=npId%>')">View Notepad</a>
                                            </div>
                                        </div>
                                        
                                        <div class="dropdown specialDisplay">
                                            <button class="dropbtn specialDisplay">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-content">
                                                <a onclick="viewNotepad('<%=npId%>')">View Notepad</a>
                                                <a onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                                <a onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                        </div>
                                        <%
                                            }
                                        %>
                                    </div>

                                        <%
                                            if (activenp.get("selected").getAsBoolean()) {
                                        %>
                                    <div class="block block-shopping-cart">
                                        <%
                                            int j = 0;
                                            double subTotal = 0.0, weight = 0.0;
                                            String clientId = (String) session.getAttribute("clientId");
                                            if (items.size() == 0) {
                                        %>
                                        <div align='center' style='margin-bottom: 20px;'>
                                            <span>There are no items in this notepad! <br>Click 
                                                <a style='text-decoration: underline;' href='products.jsp'>here</a> to browse for your desired products
                                            </span>
                                        </div>
                                        <%
                                            }
                                            else {
                                                for (JsonElement itemElem : items) {
                                                    JsonObject item = itemElem.getAsJsonObject();

                                                    String itemId = item.get("item").getAsString();
                                                    String itemName = item.get("name").getAsString();
                                                    double itemPrice = item.get("price").getAsDouble();
                                                    int itemQty = item.get("qty").getAsInt();
                                                    double itemWeight = item.get("weight").getAsDouble();
                                                    JsonArray itemImages = item.get("img").getAsJsonArray();

                                                    double totalPrice = itemPrice * itemQty;
                                                    subTotal += totalPrice;
                                                    weight += itemWeight * itemQty;

                                                    String image = "";
                                                    if (itemImages.size() > 1) {
                                                        image = itemImages.get(0).getAsString();
                                                    } else {
                                                        image = itemImages.getAsString();
                                                    }

                                                    String GET_URL = Global.BASE_URL + "/additionalInfo?id=" + itemId;
                                                    JsonElement results = SNServer.sendGET(GET_URL);
                                                    JsonObject additionalInfo = results.getAsJsonObject();

                                                    String id = additionalInfo.get("id").getAsString();
                                                    String desc = additionalInfo.get("desc").getAsString();
                                                    String pBrand = additionalInfo.get("productBrand").getAsString();
                                                    String pNo = additionalInfo.get("partNo").getAsString();
                                                    
                                                    pBrand = (pBrand.equals("") ? "-" : pBrand);

                                                    String updatedOutput = StringEntityTranslator.translate(desc);
                                                    String alt = updatedOutput;
                                                    if (updatedOutput.length() > 150) {
                                                        updatedOutput = updatedOutput.substring(0, 150) + "...";
                                                    }
                                                    String tempAlt = alt.replaceAll("\"", "&#34;");
                                                    tempAlt = tempAlt.replaceAll(",", "&#44;");
                                                    JsonObject storage = new JsonObject();
                                                    storage.addProperty("itemId", itemId);
                                                    storage.addProperty("itemName", itemName);
                                                    storage.addProperty("itemPrice", itemPrice);
                                                    storage.addProperty("itemWeight", itemWeight);
                                                    storage.addProperty("itemPartNo", pNo);
                                                    storage.addProperty("itemDescFull", tempAlt);
                                                    storage.addProperty("itemImg", image);
                                        %>
                                        <script>
                                            localStorage.setItem("<%=itemId%>", '<%=new Gson().toJson(storage)%>');
                                        </script>
                                        <table class="sMobileDisplayOption npitemrow<%=j%>" style="margin-bottom: 20px">
                                            <tr>
                                                <th colspan='2'>Item</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                            </tr>
                                            <tr>
                                                <td colspan='2'>
                                                    <a href='shop-details.jsp?productId=<%=itemId%>' class='pic' style='display: block; margin-left: -15px;'>
                                                        <img src='<%=Global.BASE_URL%>/<%=image%>' width='50' height='50' alt=''>
                                                    </a>
                                                    <h3>
                                                        <a href='shop-details.jsp?productId=<%=itemId%>'><%=itemName%></a>
                                                    </h3>
                                                    <br>
                                                    <b><a style='text-decoration: underline;' onclick="viewProductDetails('<%=itemId%>')">View Product Details</a></b>
                                                </td>
                                                <td class='price'>
                                                    <script>document.write(ccode);</script> <%=itemPrice%>
                                                </td>
                                                <td>
                                                    <div class='quantity'>
                                                        <a class='fa fa-minus' onclick='reduceQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                        <input type='text' disabled class='qty<%=j%>' id='qty<%=j%>' value='<%=itemQty%>'>
                                                        <a class='fa fa-plus' onclick='addQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                    </div>
                                                </td>

                                                <td class='price price<%=j%>' id='price<%=j%>'>
                                                    <script>document.write(ccode);</script> <%=totalPrice%>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </table>
                                        <table class="sTabletDisplayOption npitemrow<%=j%>" style="margin-bottom: 20px">
                                            <tr>
                                                <th colspan='2' style="width: 30%;">Item</th>
                                                <th style="width: 10%;">Price</th>
                                                <th style="width: 10%;">Quantity</th>
                                                <th style="width: 10%;">Total</th>
                                            </tr>
                                            <tr>
                                                <td colspan='2' style="width: 30%;">
                                                    <a href='shop-details.jsp?productId=<%=itemId%>' class='pic' style='display: block; margin-left: -15px;'>
                                                        <img src='<%=Global.BASE_URL%>/<%=image%>' width='150' height='150' alt=''>
                                                    </a>
                                                    <h3>
                                                        <a href='shop-details.jsp?productId=<%=itemId%>'><%=itemName%></a>
                                                    </h3>
                                                    <br>
                                                    <b><a style='text-decoration: underline;' onclick="viewProductDetails('<%=itemId%>')">View Product Details</a></b>
                                                </td>
                                                <td class='price' style="width: 10%;">
                                                    <script>document.write(ccode);</script> <%=itemPrice%>
                                                </td>
                                                <td style="width: 10%;">
                                                    <div class='quantity'>
                                                        <a class='fa fa-minus' onclick='reduceQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                        <input type='text' disabled class='qty<%=j%>' id='qty<%=j%>' value='<%=itemQty%>'>
                                                        <a class='fa fa-plus' onclick='addQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                    </div>
                                                </td>

                                                <td class='price price<%=j%>' id='price<%=j%>' style="width: 10%;">
                                                    <script>document.write(ccode);</script> <%=totalPrice%>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </table>
                                        <table class="sDesktopDisplayOption npitemrow<%=j%>" style="margin-bottom: 20px">
                                            <tr>
                                                <th colspan='2'>Item</th>
                                                <th>Brand</th>
                                                <th>Description</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href='shop-details.jsp?productId=<%=itemId%>' class='pic'>
                                                        <img src='<%=Global.BASE_URL%>/<%=image%>' width='100' height='100' alt=''>
                                                    </a>
                                                </td>
                                                <td>
                                                    <h3>
                                                        <a href='shop-details.jsp?productId=<%=itemId%>'><%=itemName%></a>
                                                    </h3>
                                                    <br>
                                                    <span><%=pNo%></span>
                                                </td>
                                                <td style="text-align: center;"><%=pBrand%></td>
                                                <td style='width: 300px;' alt="<%=alt%>"><%=updatedOutput%></td>
                                                <td class='price'>
                                                    <script>document.write(ccode);</script> <%=itemPrice%>
                                                </td>
                                                <td>
                                                    <div class='quantity'>
                                                        <a class='fa fa-minus' onclick='reduceQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                        <input type='text' disabled class='qty<%=j%>' id='qty<%=j%>' value='<%=itemQty%>'>
                                                        <a class='fa fa-plus' onclick='addQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                    </div>
                                                </td>

                                                <td class='price price<%=j%>' id='price<%=j%>'>
                                                    <script>document.write(ccode);</script> <%=totalPrice%>
                                                </td>

                                                <td>
                                                    <a class='fa fa-times remove' onclick='removeAllQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>")'></a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </table>
                                        <%
                                                    j++;
                                                }
                                            }
                                            DecimalFormat fmt = new DecimalFormat("0.00");
                                            String subTotalVal = fmt.format(subTotal);
                                        %>
                                        <table>
                                            <tr>
                                                <td style="padding: 15px"></td>
                                                <td style="padding: 15px">
                                                    <h3>Subtotal</h3>
                                                </td>
                                                <td style="padding: 15px"></td>
                                                <td style="padding: 15px"></td>
                                                <td style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-2 mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-2 mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="price" id="subtotal"><script>document.write(ccode);</script> <%=subTotalVal%></td>
                                                <td style="padding: 15px"></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <%
                                            break;
                                            }
                                            else {
                                    %>
                                    <div class="block block-shopping-cart">
                                        <table id="cart"></table>
                                    </div>
                                    <%
                                            }
                                        }
                                    %>
                                </div>

                                <%-- INACTIVE NOTEPAD --%>
                                <div class="inactivenp grid-col-9 grid-col">
                                    <%
                                        for (JsonElement elem : inactivenps) {
                                            JsonObject inactivenp = elem.getAsJsonObject();
                                            String npName = inactivenp.get("npName").getAsString();
                                            String npId = inactivenp.get("_id").getAsString();
                                            JsonArray items = null;
                                            if (inactivenp.get("selected").getAsBoolean()) {
                                                items = inactivenp.get("items").getAsJsonArray();
                                            }
                                    %>
                                    <div class="block-head block-head-4 grid-col-9 grid-col" style="line-height: 180%; font-size: 16px; margin-bottom: 30px;">
                                        <h4 id="<%=npId%>npName" style="text-transform: uppercase; color: #a6eb14; font-weight: bold; font-size: 17px;display: inline-block;">
                                            <%=npName%>
                                        </h4>
                                        <div style="display: inline-block; float: right; margin-left: 30px;">
                                            <label style="margin-top: 7px;" class="checkbox mobile-billing-address">
                                                <input class="inactivenpcheckhandler" type="checkbox" value="<%=npId%>" <%=inactivenp.get("active").getAsBoolean() ? "checked" : ""%>>
                                                <i class="fa fa-check"></i>Active
                                            </label>
                                        </div>
                                        <%
                                            if (inactivenp.get("selected").getAsBoolean()) {
                                        %>
                                        <div class="nonMobileDisplayOption" style="float: right;">
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="copyToCart('<%=npId%>')">Copy to Cart</a>
                                            </div>
                                            <div style="float: right;">
                                                <a class="underline-link" onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                            </div>
                                        </div>
                                        
                                        <div class="dropdown specialDisplay">
                                            <button class="dropbtn specialDisplay">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-content">
                                                <a onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                                <a onclick="copyToCart('<%=npId%>')">Copy to Cart</a>
                                                <a onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                        </div>
                                        <%
                                            }
                                            else {
                                        %>
                                        <div class="nonMobileDisplayOption" style="float: right;">
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                            <div style="float: right; margin-left: 30px;">
                                                <a class="underline-link" onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                            </div>
                                            <div style="float: right;">
                                                <a class="underline-link" onclick="viewNotepad('<%=npId%>')">View Notepad</a>
                                            </div>
                                        </div>
                                        
                                        <div class="dropdown specialDisplay">
                                            <button class="dropbtn specialDisplay">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-content">
                                                <a onclick="viewNotepad('<%=npId%>')">View Notepad</a>
                                                <a onclick="rename('<%=npName%>', '<%=npId%>')">Rename Notepad</a>
                                                <a onclick="removeNotepad('<%=npId%>')">Remove Notepad</a>
                                            </div>
                                        </div>
                                        <%
                                            }
                                        %>
                                    </div>

                                        <%
                                            if (inactivenp.get("selected").getAsBoolean()) {
                                        %>
                                    <div class="block block-shopping-cart">
                                        <%
                                            int j = 0;
                                            double subTotal = 0.0, weight = 0.0;
                                            String clientId = (String) session.getAttribute("clientId");
                                            if (items.size() == 0) {
                                        %>
                                        <div align='center' style='margin-bottom: 20px;'>
                                            <span>There are no items in this notepad! <br>Click 
                                                <a style='text-decoration: underline;' href='products.jsp'>here</a> to browse for your desired products
                                            </span>
                                        </div>
                                        <%
                                            }
                                            else {
                                                for (JsonElement itemElem : items) {
                                                    JsonObject item = itemElem.getAsJsonObject();

                                                    String itemId = item.get("item").getAsString();
                                                    String itemName = item.get("name").getAsString();
                                                    double itemPrice = item.get("price").getAsDouble();
                                                    int itemQty = item.get("qty").getAsInt();
                                                    double itemWeight = item.get("weight").getAsDouble();
                                                    JsonArray itemImages = item.get("img").getAsJsonArray();

                                                    double totalPrice = itemPrice * itemQty;
                                                    subTotal += totalPrice;
                                                    weight += itemWeight * itemQty;

                                                    String image = "";
                                                    if (itemImages.size() > 1) {
                                                        image = itemImages.get(0).getAsString();
                                                    } else {
                                                        image = itemImages.getAsString();
                                                    }

                                                    String GET_URL = Global.BASE_URL + "/additionalInfo?id=" + itemId;
                                                    JsonElement results = SNServer.sendGET(GET_URL);
                                                    JsonObject additionalInfo = results.getAsJsonObject();

                                                    String id = additionalInfo.get("id").getAsString();
                                                    String desc = additionalInfo.get("desc").getAsString();
                                                    String pBrand = additionalInfo.get("productBrand").getAsString();
                                                    String pNo = additionalInfo.get("partNo").getAsString();

                                                    String updatedOutput = StringEntityTranslator.translate(desc);
                                                    String alt = updatedOutput;
                                                    if (updatedOutput.length() > 150) {
                                                        updatedOutput = updatedOutput.substring(0, 150) + "...";
                                                    }
                                                    
                                                    String tempOutput = updatedOutput.replaceAll("\"", "&#34;");
                                                    tempOutput = tempOutput.replaceAll(",", "&#44;");
                                                    String tempAlt = alt.replaceAll("\"", "&#34;");
                                                    tempAlt = tempAlt.replaceAll(",", "&#44;");
                                                    JsonObject storage = new JsonObject();
                                                    storage.addProperty("itemId", itemId);
                                                    storage.addProperty("itemName", itemName);
                                                    storage.addProperty("itemPrice", itemPrice);
                                                    storage.addProperty("itemWeight", itemWeight);
                                                    storage.addProperty("itemPartNo", pNo);
                                                    storage.addProperty("itemDesc", tempOutput);
                                                    storage.addProperty("itemDescFull", tempAlt);
                                                    storage.addProperty("itemImg", image);
                                        %>
                                        <script>
                                            localStorage.setItem("<%=itemId%>", '<%=new Gson().toJson(storage)%>');
                                        </script>
                                        <table class="sMobileDisplayOption npitemrow<%=j%>" id='npitemrow<%=j%>' style="margin-bottom: 20px">
                                            <tr>
                                                <th colspan='2'>Item</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                            </tr>
                                            <tr>
                                                <td colspan='2'>
                                                    <a href='shop-details.jsp?productId=<%=itemId%>' class='pic' style='display: block; margin-left: -15px;'>
                                                        <img src='<%=Global.BASE_URL%>/<%=image%>' width='50' height='50' alt=''>
                                                    </a>
                                                    <h3>
                                                        <a href='shop-details.jsp?productId=<%=itemId%>'><%=itemName%></a>
                                                    </h3>
                                                    <br>
                                                    <b><a style='text-decoration: underline;' onclick="viewProductDetails('<%=itemId%>')">View Product Details</a></b>
                                                </td>
                                                <td class='price'>
                                                    <script>document.write(ccode);</script> <%=itemPrice%>
                                                </td>
                                                <td>
                                                    <div class='quantity'>
                                                        <a class='fa fa-minus' onclick='reduceQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                        <input type='text' disabled class='qty<%=j%>' id='qty<%=j%>' value='<%=itemQty%>'>
                                                        <a class='fa fa-plus' onclick='addQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                    </div>
                                                </td>

                                                <td class='price price<%=j%>' id='price<%=j%>'>
                                                    <script>document.write(ccode);</script> <%=totalPrice%>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </table>
                                        <table class="sTabletDisplayOption npitemrow<%=j%>" id='npitemrow<%=j%>' style="margin-bottom: 20px">
                                            <tr>
                                                <th colspan='2' style="width: 30%;">Item</th>
                                                <th style="width: 10%;">Price</th>
                                                <th style="width: 10%;">Quantity</th>
                                                <th style="width: 10%;">Total</th>
                                            </tr>
                                            <tr>
                                                <td colspan='2' style="width: 30%;">
                                                    <a href='shop-details.jsp?productId=<%=itemId%>' class='pic' style='display: block; margin-left: -15px;'>
                                                        <img src='<%=Global.BASE_URL%>/<%=image%>' width='150' height='150' alt=''>
                                                    </a>
                                                    <h3>
                                                        <a href='shop-details.jsp?productId=<%=itemId%>'><%=itemName%></a>
                                                    </h3>
                                                    <br>
                                                    <b><a style='text-decoration: underline;' onclick="viewProductDetails('<%=itemId%>')">View Product Details</a></b>
                                                </td>
                                                <td class='price' style="width: 10%;">
                                                    <script>document.write(ccode);</script> <%=itemPrice%>
                                                </td>
                                                <td style="width: 10%;">
                                                    <div class='quantity'>
                                                        <a class='fa fa-minus' onclick='reduceQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                        <input type='text' disabled class='qty<%=j%>' id='qty<%=j%>' value='<%=itemQty%>'>
                                                        <a class='fa fa-plus' onclick='addQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                    </div>
                                                </td>

                                                <td class='price price<%=j%>' id='price<%=j%>' style="width: 10%;">
                                                    <script>document.write(ccode);</script> <%=totalPrice%>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </table>
                                        <table class="sDesktopDisplayOption npitemrow<%=j%>" id='npitemrow<%=j%>' style="margin-bottom: 20px">
                                            <tr>
                                                <th colspan='2'>Item</th>
                                                <th>Brand</th>
                                                <th>Description</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href='shop-details.jsp?productId=<%=itemId%>' class='pic'>
                                                        <img src='<%=Global.BASE_URL%>/<%=image%>' width='100' height='100' alt=''>
                                                    </a>
                                                </td>
                                                <td>
                                                    <h3>
                                                        <a href='shop-details.jsp?productId=<%=itemId%>'><%=itemName%></a>
                                                    </h3>
                                                    <br>
                                                    <span><%=pNo%></span>
                                                </td>
                                                <td style="text-align: center;"><%=pBrand%></td>
                                                <td style='width: 300px;' alt="<%=alt%>"><%=updatedOutput%></td>
                                                <td class='price'>
                                                    <script>document.write(ccode);</script> <%=itemPrice%>
                                                </td>
                                                <td>
                                                    <div class='quantity'>
                                                        <a class='fa fa-minus' onclick='reduceQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                        <input type='text' disabled class='qty<%=j%>' id='qty<%=j%>' value='<%=itemQty%>'>
                                                        <a class='fa fa-plus' onclick='addQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>");'></a>
                                                    </div>
                                                </td>

                                                <td class='price price<%=j%>' id='price<%=j%>'>
                                                    <script>document.write(ccode);</script> <%=totalPrice%>
                                                </td>

                                                <td>
                                                    <a class='fa fa-times remove' onclick='removeAllQty(<%=j%>, "<%=npId%>", "<%=itemId%>", "<%=itemPrice%>")'></a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </table>
                                        <%
                                                    j++;
                                                }
                                            }
                                            DecimalFormat fmt = new DecimalFormat("0.00");
                                            String subTotalVal = fmt.format(subTotal);
                                        %>
                                        <table>
                                            <tr>
                                                <td style="padding: 15px"></td>
                                                <td style="padding: 15px">
                                                    <h3>Subtotal</h3>
                                                </td>
                                                <td style="padding: 15px"></td>
                                                <td style="padding: 15px"></td>
                                                <td style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-2 mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="mobile-nav-display-none-2 mobile-nav-display-none-3" style="padding: 15px"></td>
                                                <td class="price" id="subtotal"><script>document.write(ccode);</script> <%=subTotalVal%></td>
                                                <td style="padding: 15px"></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <%
                                            }
                                            else {
                                    %>
                                    <div class="block block-shopping-cart">
                                        <table id="cart">

                                        </table>
                                    </div>
                                    <%
                                            }
                                        }
                                    %>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid-row">
                        <div class="block block-shopping-cart-totals">
                            <a id="newnotepad2" class="button">New notepad</a>
                        </div>
                    </div>
                </div>

                    

                    
                    
                <div class="remodal" data-remodal-id="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDesc" data-remodal-options="closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false">
                    <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                    <div>
                        <h2 id="modalTitle">Add New Notepad</h2>
                        <br>
                        <p id="modalDesc">
                            <input type="text" class="form-control" id="notepad" placeholder="Enter new Notepad Name">
                        </p>
                    </div>
                    <br>
                    <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
                    <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
                </div>
                <div class="remodal1" data-remodal-id="modal1" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc" data-remodal-options="closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false">
                    <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                    <div>
                        <h2 id="modal1Title">Rename Notepad</h2>
                        <br>
                        <p id="modal1Desc">
                            <input type="text" class="form-control" id="notepadName" placeholder="Enter new Notepad Name">
                        </p>
                    </div>
                    <br>
                    <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
                    <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
                </div>
                <div class="remodal2" data-remodal-id="modal2" role="dialog" aria-labelledby="modal2Title" aria-describedby="modal2Desc" data-remodal-options="closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false">
                    <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                    <div>
                        <h2 id="modal2Title"></h2>
                        <br>
                        <p id="modal2Desc">
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
        <script src="js/view-notepad.js"></script>
        <%@include file="common/footerScript.jsp" %>
    </body>
</html>