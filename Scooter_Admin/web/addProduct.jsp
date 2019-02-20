<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="loginCheck.jsp" %>
<%
    String pageName = " | Add Products";
    String titleName = "Add Product - Product Information";
    String reqUri = request.getRequestURI();
    String path = reqUri.substring(reqUri.lastIndexOf("/") + 1);
    String hyperlink = path;
    String breadCrumbName = "Add Products";
%>
<!DOCTYPE html>
<html>
    <%@include file="common/header-imports.jsp" %>
    <body class="hold-transition skin-maroon sidebar-mini">
        <div class="wrapper">
            <%@include file="common/header-nav.jsp" %>
            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper">
                <%@include file="common/titlePanel.jsp" %>
                <!-- Main content -->
                <section class="content">
                    <div class="row">
                        <!-- left column -->
                        <div class="col-md-12">
                            <form role="form" action="addProduct" enctype='multipart/form-data' method="POST">
                                <h3>
                                    Basic Information
                                </h3>
                                <div class="box box-primary">
                                    <div class="box-body">
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="productName">Product Name</label>
                                                <input type="text" class="form-control" name="productName" id="productName" placeholder="Enter product name">
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="partNumber">Part Number</label>
                                                <input type="text" class="form-control" name="partNumber" id="partNumber" placeholder="Enter part number">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="productCat">Product Category</label>

                                                <select class="form-control select2" id="productCat" name="category" style="width: 100%;" required>
                                                    <option value=""><b>Please choose your category</b></option>
                                                    <option value="addnew" style="font-weight:bold;">New Category?</option>
                                                    <%@include file="categories.jsp" %>
                                                </select>
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="productQty">Quantity</label>
                                                <input type="text" class="form-control" id="productQty" name="quantity" placeholder="Enter quantity">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="kilo">Weight(KG)</label>
                                                <input id="kilo" type="number" step="0.01" class="form-control" name="weight" placeholder="Enter Weight (in Kilograms)">
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12 ">
                                                <label for="gram">Weight(G)</label>
                                                <input id="gram" type="number" step="0.01" class="form-control" placeholder="Enter Weight (in Grams)">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="sos">Source of Supply</label>
                                                <input type="text" class="form-control" name="sos" placeholder="Enter Source of Supply">
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="ssos">Secondary Source of Supply</label>
                                                <input type="text" class="form-control" name="ssos" placeholder="Enter Secondary Source of Supply">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="pBrand">Product Brand</label>
                                                <select class="form-control select2" id="pBrand" name="pBrand" style="width: 100%;" required>
                                                    <option value="">Please select Product Brand</option>
                                                    <option value="addnew" style="font-weight:bold;">New Product Brand?</option>
                                                    <%@include file="productBrand.jsp" %>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group  col-xs-12">
                                                <label>Product Description</label>
                                                <textarea class="form-control" rows="5" placeholder="Enter product description" name="desc"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3>
                                    Pricing Information
                                </h3>
                                <div class="box box-primary">
                                    <div class="box-body">
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="copsgd">Costs Of product (SGD)</label>
                                                <input id="copsgd" type="text" name="cop" class="form-control" placeholder="Enter Costs after landing (SGD)" value="0.00">
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="scsgd">Shipping Cost (SGD)</label>
                                                <input id="scsgd" name="shippingcosts" type="text" class="form-control" placeholder="Enter Shipping Cost (SGD)" value="0.00">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="copusd">Costs Of product (USD)</label>
                                                <input id="copusd" type="text" class="form-control" placeholder="Enter Costs after landing (USD)">
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="scusd">Shipping Cost (USD)</label>
                                                <input id="scusd" type="text" class="form-control" placeholder="Enter Shipping Cost (USD)">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="copeur">Costs Of product (EURO)</label>
                                                <input id="copeur" type="text" class="form-control" placeholder="Enter Costs after landing (EURO)">
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="sceur">Shipping Cost (EURO)</label>
                                                <input id="sceur" type="text" class="form-control" placeholder="Enter Shipping Cost (EURO)">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="gst">GST (%)</label>
                                                <input id="gst" name="gst" type="text" class="form-control" placeholder="Enter GST (%)" value="7">
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="costwGstSgd">Cost of product inclusive GST & Shipping (SGD) </label>
                                                <input id="costwGstSgd" type="text" class="form-control" value="0" disabled>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="costwGstUsd">Cost of product inclusive GST & Shipping (USD) </label>
                                                <input id="costwGstUsd" type="text" class="form-control" value="0" disabled>
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="costwGstEur">Cost of product inclusive GST & Shipping (EURO) </label>
                                                <input id="costwGstEur" type="text" class="form-control" value="0" disabled>
                                            </div>
                                        </div>
                                        <div class="row showme">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="localsgd">Price(SGD) (Local Market)</label>
                                                <input id="localsgd" type="text" class="form-control" name="localprice" placeholder="Enter local Market Price (SGD)">
                                                <b><font color="red">Profit (Local SGD Market): SGD $<label id="profitlocalsgd">0</label></font></b>
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="foreignsgd">Price(SGD) (Foreign Market)</label>
                                                <input id="foreignsgd" type="text" class="form-control" name="foreignprice" placeholder="Enter Foreign Market Price (SGD)">
                                                <b><font color="red">Profit (Foreign SGD Market): SGD $<label id="profitforeignsgd">0</label></font></b>
                                            </div>
                                        </div>
                                        <div class="row showme">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="localusd">Price(USD) (Local Market)</label>
                                                <input id="localusd" type="text" class="form-control" placeholder="Enter Local Market Price (USD)">
                                                <b><font color="red">Profit (Local USD Market): USD $<label id="profitlocalusd">0</label></font></b>
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="foreignusd">Price(USD) (Foreign Market)</label>
                                                <input id="foreignusd" type="text" class="form-control" placeholder="Enter Foreign Market Price (USD)">
                                                <b><font color="red">Profit (Foreign USD Market): USD $<label id="profitforeignusd">0</label></font></b>
                                            </div>
                                        </div>
                                        <div class="row showme">
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="localeur">Price(EURO) (Local Market)</label>
                                                <input id="localeur" type="text" class="form-control" placeholder="Enter Local Market Price (EUR)">
                                                <b><font color="red">Profit (Local EURO Market): EUR €<label id="profitlocaleuro">0</label></font></b>
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12">
                                                <label for="foreigneur">Price(EURO) (Foreign Market)</label>
                                                <input id="foreigneur" type="text" class="form-control" placeholder="Enter Foreign Market Price (EUR)">
                                                <b><font color="red">Profit (Foreign EURO Market): EUR €<label id="profitforeigneuro">0</label></font></b>
                                            </div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="markuptier1">Tier 1 Markup (%)</label>
                                                <select class="form-control" name="tier1markup" id="markuptier1">
                                                    <option value="">Select Value</option>
                                                    <%
                                                        for (int i = 1; i <= 100; i++) {
                                                    %>
                                                    <option value="<%=i%>"><%=i%></option>
                                                    <%
                                                        }
                                                    %>
                                                </select>
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12 showme" >
                                                <label for="markuptier2">Tier 2 Markup (%)</label>
                                                <select class="form-control" name="tier2markup" id="markuptier2">
                                                    <option value="">Select Value</option>
                                                    <%
                                                        for (int i = 1; i <= 100; i++) {
                                                    %>
                                                    <option value="<%=i%>"><%=i%></option>
                                                    <%
                                                        }
                                                    %>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier1markupprice">Tier 1 Markup Price</label>
                                                <input type="text" name="tier1markupprice"  id="tier1markupprice" class="form-control" placeholder="Enter Tier 1 Markup Price($)" />
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier2markupprice">Tier 2 Markup Price</label>
                                                <input type="text" name="tier2markupprice" id="tier2markupprice" class="form-control" placeholder="Enter Tier 2 Markup Price($)" />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier1markupprice">Tier 1 Discount(%)</label>
                                                <input type="text" name="tier1discount" id="tier1discount" class="form-control" placeholder="Enter Tier 1 Discount(%)" />
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier2markupprice">Tier 2 Discount(%)</label>
                                                <input type="text" name="tier2discount" id="tier2discount" class="form-control" placeholder="Enter Tier 2 Discount(%)" />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="markuptier3">Tier 3 Markup (%)</label>
                                                <select class="form-control" name="tier3markup" id="markuptier3">
                                                    <option value="">Select Value</option>
                                                    <%
                                                        for (int i = 1; i <= 100; i++) {
                                                    %>
                                                    <option value="<%=i%>"><%=i%></option>
                                                    <%
                                                        }
                                                    %>
                                                </select>
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="markuptier4">Tier 4 Markup (%)</label>
                                                <select class="form-control" name="tier4markup" id="markuptier4">
                                                    <option value="">Select Value</option>
                                                    <%
                                                        for (int i = 1; i <= 100; i++) {
                                                    %>
                                                    <option value="<%=i%>"><%=i%></option>
                                                    <%
                                                        }
                                                    %>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier3markupprice">Tier 3 Markup Price</label>
                                                <input type="text" name="tier3markupprice"  id="tier3markupprice" class="form-control" placeholder="Enter Tier 3 Markup Price($)" />
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier4markupprice">Tier 4 Markup Price</label>
                                                <input type="text" name="tier4markupprice"  id="tier4markupprice" class="form-control" placeholder="Enter Tier 4 Markup Price($)" />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier3markupprice">Tier 3 Discount(%)</label>
                                                <input type="text" name="tier3discount" id="tier3discount" class="form-control" placeholder="Enter Tier 3 Discount(%)" />
                                            </div>
                                            <div class="form-group col-sm-6 col-xs-12 showme">
                                                <label for="tier4markupprice">Tier 4 Discount(%)</label>
                                                <input type="text" name="tier4discount" id="tier4discount" class="form-control" placeholder="Enter Tier 4 Discount(%)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3>
                                    Other Information
                                </h3>
                                <div class="box box-primary">
                                    <div class="box-body">
                                        <div class="form-group col-sm-6 col-xs-12">
                                            <label for="fileUploader">Product Image</label>
                                            <input type="file" name="file" id="fileUploader" multiple>
                                            <p class="help-block">Please ensure that all images are within the same folder.</p>
                                        </div>
                                        <div class="form-group  col-xs-12">
                                            <label>Featured Product</label>
                                            <input type ="checkbox" name="fProduct" value ="true">
                                        </div>
                                        <div class="box-footer">
                                            <button type="submit"  class="btn btn-primary" style="float:right">Proceed to Select Brand and Model</button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div class="remodal" data-remodal-id="modal" role="dialog" aria-labelledby="modal1Title" aria-describedby="modal1Desc" data-remodal-options="closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false">
                                <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                                <div>
                                    <h2 id="modal1Title">Add New Category</h2>
                                    <br>
                                    <p id="modal1Desc">
                                        <input type="text" class="form-control" id="category" name="category" placeholder="Enter new Category Name">
                                    </p>
                                </div>
                                <br>
                                <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
                                <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
                            </div>

                            <div class="remodal1" data-remodal-id="modal1" role="dialog" aria-labelledby="modal1Title1" aria-describedby="modal1Desc1">
                                <button data-remodal-action="cancel" class="remodal-close" aria-label="Close"></button>
                                <div>
                                    <h2 id="modal1Title1">Add New Product Brand</h2>
                                    <br>
                                    <p id="modal1Desc1">
                                        <div class="table-responsive">
                                            <table class="table no-margin">
                                                <tbody id="brandContent">
                                                    <tr>
                                                        <td colspan="2"><input type="text" class="form-control" id="productBrand" name="productBrand" placeholder="Enter new Product Brand"></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="text" class="form-control" id="tier1Dis" name="tier1Dis" placeholder="Enter Tier 1 Brand Discount"></td>
                                                        <td><input type="text" class="form-control" id="tier2Dis" name="tier2Dis" placeholder="Enter Tier 2 Brand Discount"></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="text" class="form-control" id="tier3Dis" name="tier3Dis" placeholder="Enter Tier 3 Brand Discount"></td>
                                                        <td><input type="text" class="form-control" id="tier4Dis" name="tier4Dis" placeholder="Enter Tier 4 Brand Discount"></td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2">
                                                            <label style="float: left;" for="pbrandImage">Product Brand Image</label>
                                                            <input type="file" class="form-control" id="pbrandImage" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </p>
                                </div>
                                <br>
                                <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
                                <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
                            </div>
                        </div>
                        <!--/.col (left) -->
                    </div>
                    <!-- /.row -->
                </section>
                <!-- /.content -->
            </div>
            <!-- /.content-wrapper -->
            <footer class="main-footer">
                <strong>Copyright &copy; 2018 Scooter Narcotics.</strong> All rights reserved.
            </footer>

            <div class="control-sidebar-bg"></div>
        </div>
        <!-- ./wrapper -->
        <%@include file="common/footer-imports.jsp" %>
        <script src="js/addProduct.js"></script>
    </body>
</html>