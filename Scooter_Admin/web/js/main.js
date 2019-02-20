/* global parseFloat */

var sn = {
    
    rate: "",
    
    /***** GENERAL METHODS *****/
    wsCall: function(type, url, data) {
        return $.ajax({
            type: type,
            url: url,
            data: data
        });
    },
    
    retrieveWsData: async function(type, url, data) {
        var self = this;
        var result = await self.wsCall(type, url, data);
        if (result === "Unauthorized access!") {
            $.toast({
                heading: 'Error',
                text: result,
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        return ($.parseJSON(result));
    },
    
    multiWsCall: function(type, url, data) {
        return $.ajax({
            type: type,
            enctype: 'multipart/form-data',
            url: url,
            data: data,
            processData: false,
            contentType: false
        });
    },
    
    retrieveMultiWsData: async function(type, url, data) {
        var self = this;
        var result = await self.multiWsCall(type, url, data);
        if (result === "Unauthorized access!") {
            $.toast({
                heading: 'Error',
                text: result,
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        return ($.parseJSON(result));
    },
    
    /***** METHODS FOR products.jsp *****/
    login: async function(username, password, zombie, page) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'login', {username: username, password: password, isZombie: zombie});
        if (result.status) {
            if (result.role !== "Admin" && result.role !== "Zombie") {
                $("#message").text("Unauthorized access!");
            } else if (page === '') {
                location.replace("index.jsp");
            } else {
                var decodedUri = decodeURIComponent(page);
                location.replace(decodedUri);
            }
        }
        else {
            $("#message").text(result.message);
        }
    },
    
    /***** METHODS FOR products.jsp *****/
    retrieveAllProducts: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveProducts', {});
        if (result.status) {
            var products = result.products;
            if (products !== undefined) {
                for (var i = 0; i < products.length; i++) {
                    var product = products[i];
                    var desc = product.desc;

                    if (desc.indexOf("%20") > -1) {
                        desc = desc.replace(/%20/g, " ");
                    }
                    desc = desc.replace(/\?/g, "");
                    if (desc.length !== 0) {
                        desc = translate(desc).substring(0, 150) + "...";
                    }

                    var productPanel = "<tr id='" + i + "'>";
                    productPanel += " <td>" + product._id + "</td>";
                    productPanel += "<td>" + translate(product.name) + "</td>";
                    productPanel += "<td><div>" + desc + "</div></td>";
                    productPanel += "<td>" + product.qty + "</td>";
                    productPanel += "<td>SGD " + parseFloat(product.foreignprice).toFixed(2) + "</td>";
                    productPanel += "<td>SGD " + parseFloat(product.localprice).toFixed(2) + "</td>";
                    productPanel += "<td>" + product.weight + "</td>";
                    productPanel += "<td>";
                    productPanel += "<center>";
                    productPanel += "<a href='updateMenu.jsp?pid=" + product._id + "' target='_blank' class='btn btn-default'>Update</a>";
                    productPanel += "</center>";
                    productPanel += "</td>";
                    productPanel += "<td>";
                    productPanel += "<center>";
                    productPanel += "<a onclick='deleteProduct(\"" + product._id + "\"," + i + ")' target='_blank' class='btn btn-default'>Delete</a>";
                    productPanel += "</center>";
                    productPanel += "</td>";
                    productPanel += "</tr>";
                    $("#products tbody").append(productPanel);
                }
                var table = $('#products').DataTable({
                    'paging': true,
                    'lengthChange': true,
                    'searching': true,
                    'ordering': true,
                    'info': true,
                    'autoWidth': true
                });
                // Apply the search
                table.columns(1).every(function () {
                    var that = this;

                    $('#search').on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
            }
            else {
                $("#products tbody").append("<tr><td colrpsn='9'>No products found</td></tr>");
            }
        }
        else {
            $("#products tbody").append("<tr><td colrpsn='9'>No products found</td></tr>");
        }
        $('.content-wrapper').loading('stop');
    },
    
    deleteProduct: async function(pId, index) {
        if (confirm('Are you sure you want to delete this product?')) {
            var self = this;
            var result = await self.retrieveWsData('POST', 'deleteProduct', {productId: pId});
            if (result.status) {
                var table = $('#products').DataTable();
                table.row($('tr#' + index)).remove().draw(false);
                $.toast({
                    heading: 'Success',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'success'
                });
            }
            else {
                $.toast({
                    heading: 'Error',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        }
    },
    
    /***** METHODS FOR addProduct.jsp *****/
    addCat: async function(category, inst) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'addCat', {catName: category});
        if (result.status) {
            var newOption = "<option>" + category + "</option>";
            $('#productCat').append(newOption);
            $('#productCat').val(category);
            var inst = $('[data-remodal-id=modal]').remodal();
            inst.close();
        }
        else {
            alert(result.message);
        }
    },
    
    addProductBrand: async function(data, productBrand) {
        var self = this;
        var result = await self.retrieveMultiWsData('POST', 'addPbrand', data);
        if (result.status) {
            var newOption = "<option>" + productBrand + "</option>";
            $('#pBrand').append(newOption);
            $('#pBrand').val(productBrand);
            var inst = $('[data-remodal-id=modal1]').remodal();
            inst.close();
        }
        else {
            alert(result.message);
        }
    },
    
    retrieveRates: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveRates', {currency: 'eur;usd'});
        if (result.status) {
            var rates = result.rates;
            self.rates = rates;
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR selectRelatedProducts.jsp *****/
    retrieveProductsForRelated: async function(pId){
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveProducts', {});
        if (result.status) {
            var products = result.products;
            var productPanel = "";
            $.each(products, function(index, product) {
                var id = product._id;
                var name = product.name;
                var cat = product.cat;
                var productBrand = product.productBrand;
                var images = product.img;
                if (images === undefined || images.length === 0) {
                    images = "images/no-image.jpeg";
                }
                else {
                    images = base + "/" + images[0];
                }
                if (id !== pId) {
                    var shortenedName = name.length > 40 ? name.substring(0, 40) + "..." : name;
                    productPanel += "<div id='" + index + "' onclick='sn.clickActions(this);' class='form-group col-sm-4 col-xs-12'>";
                    productPanel += "<label style='display: none;'>" + id + "</label>";
                    productPanel += "<img align='center' src='" + images + "' width='250' height='200'>";
                    productPanel += "<h5 title='" + name + "'>" + shortenedName + "</h5>";
                    productPanel += "<h5 style='height: 30px;'><b>Category: </b>" + cat + "</h5>";
                    productPanel += "<h5 style='height: 30px;'><b>Product Brand: </b>" + productBrand + "</h5>";
                    productPanel += "</div>";
                }
            });
            $("#productPanel").append(productPanel);
            $('.content-wrapper').loading('stop');
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    clickActions: function(element) {
        var self = this;
        var id = element.id;
        var bg = $("#" + id).css("background-color");
        var currentSelected = $("#selectedProducts").val();
        var productId = $("#" + id).children().first().text();
        if (bg === "rgba(0, 0, 0, 0)" || bg === "rgb(0, 0, 0)" || bg === "rgb(255, 255, 255)") {
            $("#" + id).css("background-color", "rgb(244, 146, 65)");
            
            if (currentSelected.length === 0) {
                currentSelected += productId;
            }
            else {
                currentSelected += "," + productId;
            }
        }
        else {
            $("#" + id).css("background-color", "white");
            if (currentSelected.indexOf("," + productId) > -1) {
                currentSelected = currentSelected.replace("," + productId, "");
            }
            else {
                currentSelected = currentSelected.replace(productId, "");
            }
        }
        $("#selectedProducts").val(currentSelected);
    },
    
    /***** METHODS FOR updateProduct.jsp *****/
    retrieveProduct: async function(pId){
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveProduct', {productId: pId});
        if (result.status) {
            var product = result.products;
            $('#productId').val(product._id);


            $('#productName').val(product.name);
            $('#partNumber').val(product.partNo);
            $('#productQty').val(product.qty);


            $('#kilo').val(product.weight);
            $('#gram').val(kgToG(product.weight));


            $('#desc').val(product.desc);


            $('#productCat').val(product.cat);


            $('#foreignsgd').val(product.foreignprice.toFixed(2));
            self.foreignSGDCheck($('#foreignsgd').val());


            $('#localsgd').val(product.localprice.toFixed(2));
            self.localSGDCheck($('#localsgd').val());


            $('#sos').val(product.sos);
            $('#ssos').val(product.ssos);


            if (product.cop === 0) {
                $('#copsgd, #copusd, #copeur').val("0.00");
            }
            else {
                $('#copsgd').val(product.cop);
            }
            self.copSGDCheck($('#copsgd').val());
            
            
            $('#gst').val(product.gst);


            if (isNaN(product.shippingCosts) || product.shippingCosts === 0) {
                $('#scsgd, #scusd, #sceur').val("0.00");
            } else {
                $('#scsgd').val(product.shippingCosts);
            }
            self.scSGDCheck($('#scsgd').val());


            $('#fProduct').attr('checked', (product.featured === "true" || product.featured));


            if (product.productBrand !== "") {
                $('#pBrand').val(product.productBrand);
            }
            
            
            var tier1markup = isNaN(product.tier1markup) || product.tier1markup === 0 ? '' : product.tier1markup;
            $("#markuptier1").empty();
            $("#markuptier1").append("<option value=''>Select Value</option>");
            for (var i = 0; i < (tier1markup + 100); i++) {
                $("#markuptier1").append("<option value='" + i + "'>" + i + "</option>");
            }
            $('#markuptier1').val(tier1markup);
            self.markupSelection(1, $('#markuptier1').val());


            var tier2markup = isNaN(product.tier2markup) || product.tier2markup === 0 ? '' : product.tier2markup;
            $("#markuptier2").empty();
            $("#markuptier2").append("<option value=''>Select Value</option>");
            for (var i = 0; i < (tier2markup + 100); i++) {
                $("#markuptier2").append("<option value='" + i + "'>" + i + "</option>");
            }
            $('#markuptier2').val(tier2markup);
            self.markupSelection(2, $('#markuptier2').val());

            
            var tier3markup = isNaN(product.tier3markup) || product.tier3markup === 0 ? '' : product.tier3markup;
            $("#markuptier3").empty();
            $("#markuptier3").append("<option value=''>Select Value</option>");
            for (var i = 0; i < (tier3markup + 100); i++) {
                $("#markuptier3").append("<option value='" + i + "'>" + i + "</option>");
            }
            $('#markuptier3').val(tier3markup);
            self.markupSelection(3, $('#markuptier3').val());
            
            
            var tier4markup = isNaN(product.tier4markup) || product.tier4markup === 0 ? '' : product.tier4markup;
            $("#markuptier4").empty();
            $("#markuptier4").append("<option value=''>Select Value</option>");
            for (var i = 0; i < (tier4markup + 100); i++) {
                $("#markuptier4").append("<option value='" + i + "'>" + i + "</option>");
            }
            $('#markuptier4').val(tier4markup);
            self.markupSelection(4, $('#markuptier4').val());
        }
        else {
            location.replace("products.jsp");
        }
        $('.content-wrapper').loading('stop');
    },
    
    /***** METHODS FOR updateProductBNM.jsp *****/
    diaplayBNM: async function(pId) {
        var self = this;
        var selectedBNM = {};
        var result = await self.retrieveWsData('POST', 'retrieveProduct', {productId: pId});
        if (result.status) {
            var product = result.products;
            var selectedBrandNmodels = product.brandNmodel;
            if (selectedBrandNmodels === undefined) {
                $("#json").val(JSON.stringify("[]"));
            }
            else {
                var bnmString = JSON.stringify(selectedBrandNmodels).replace(/�/g, '');
                if (selectedBrandNmodels !== undefined && selectedBrandNmodels !== "null") {
                    for (var idx in selectedBrandNmodels) {
                        var selectedBrandNmodel = selectedBrandNmodels[idx];
                        var brand = selectedBrandNmodel.brand;
                        var modelList = selectedBrandNmodel.modelList;
                        var updatedModelList = [];
                        for (var modelIdxMain in modelList) {
                            var model = modelList[modelIdxMain];
                            model = model.replace(/%C2%B2/g, '&#178;');
                            model = model.replace(/%C2%B3/g, '&#179;');
                            model = model.replace(/%C2%B4/g, '&#180;');
                            model = model.replace(/�/g, '');
                            updatedModelList.push(model);
                        }
                        selectedBNM[brand] = updatedModelList;
                    }
                    $("#json").val(bnmString);
                }
            }
            
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        
        result = await self.retrieveWsData('POST', 'retrieveAllBNM', {});
        if (result.status) {
            var bnms = result.bnm;
            var brandNmodelDisplay = "";
            var isAllChecked = true;
            for (var mainIdx in bnms) {
                brandNmodelDisplay += "<div class='form-group col-sm-6 col-xs-12'>";
                var bnm = bnms[mainIdx];

                var brand = bnm.brand;
                brandNmodelDisplay += "<h1 class='brandtitle'>" + brand + "</h1>";
                brandNmodelDisplay += "<br>";

                var selectedModelList = selectedBNM[brand];

                var modelList = bnm.modelList;
                for (var modelIdx in modelList) {
                    var isChecked = false;
                    var model = modelList[modelIdx];
                    model = model.replace(/%C2%B2/g, '&#178;');
                    model = model.replace(/%C2%B3/g, '&#179;');
                    model = model.replace(/%C2%B4/g, '&#180;');
                    model = model.replace(/�/g, '');
                    if (selectedModelList !== undefined && selectedModelList.length > 0) {
                        isChecked = selectedModelList.indexOf(model) !== -1;
                    }

                    if (!isChecked) {
                        isAllChecked = false;
                    }

                    brandNmodelDisplay += "<input type='checkbox' name='models' class='models' id='" + model + "' value='" + model + "' " + (isChecked ? "checked" : "") + " />&emsp;";
                    brandNmodelDisplay += "<span class='modelsName'>" + model + "</span><br>";
                }
                brandNmodelDisplay += "</div>";
            }
            $("#bnmList").append(brandNmodelDisplay);
            if (isAllChecked) {
                $("#selectAllBtm").prop("checked", true);
                $("#selectAllTop").prop("checked", true);
            }
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $('.content-wrapper').loading('stop');
    },
    
    updateProductBNM: async function(pId, bnm) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'updateProductBnM', {pId: pId, bnm: bnm});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message + "...<br>Redirecting in 1 seconds...",
                showHideTransition: 'fade',
                icon: 'success'
            });
            setTimeout(function() {
                location.replace("updateMenu.jsp?pid=" + pId);
            }, 1000);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR updateProductImage.jsp *****/
    retrieveProductImage: async function(pId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveProduct', {productId: pId});
        if (result.status) {
            var product = result.products;
            if (product.img !== undefined && product.img.length > 0) {
                for (var i = 0; i < product.img.length; i++) {
                    var item = "<tr id='" + i + "'>";
                    item += "<td><img src='" + base + "/" + product.img[i] + "' width='400' height='350'></td>";
                    item += "<td><center><a onclick='deleteImage(" + i + ")' class='btn btn-default'>Remove</a></center></td>";
                    item += "</tr>";
                    $("#imageList tbody").append(item);
                }
                $('#imageList').DataTable({
                    'paging': true,
                    'lengthChange': true,
                    'searching': false,
                    'ordering': true,
                    'info': true,
                    'autoWidth': true
                });
            }
            else {
                $("#imageList tbody").append("<tr><td colspan='2'>No images found</td></tr>");
            }
        }
        else {
            $("#imageList tbody").append("<tr><td colspan='2'>No images found</td></tr>");
        }
        $('.content-wrapper').loading('stop');
    },
    
    deleteProductImage: async function(pId, index) {
        if (confirm('Are you sure you want to delete this product?')) {
            var self = this;
            var result = await self.retrieveWsData('POST', 'removeImage', {pId: pId,index: parseInt(index)});
            if (result.status) {
                var table = $('#imageList').DataTable();
                table.row($('tr#' + index)).remove().draw();
            }
            else {
                $.toast({
                    heading: 'Error',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        }
    },
    
    /***** METHODS FOR updateRelatedProducts.jsp *****/
    retrieveProductsForRelatedUpdate: async function(pId){
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveRelatedProducts', {productId: pId});
        if (result.status) {
            var relatedProducts = result.relatedProducts;
            var productPanel = "";
            $.each(relatedProducts, function(index, relatedProduct) {
                var product = relatedProduct.product;
                var isSelected = relatedProduct.isSelected;
                var id = product._id;
                var name = product.name;
                var cat = product.cat;
                var productBrand = product.productBrand;
                var images = product.img;
                if (images === undefined || images.length === 0) {
                    images = "images/no-image.jpeg";
                }
                else {
                    images = base + "/" + images[0];
                }
                if (id !== pId) {
                    var bgColor = isSelected ? "rgb(244, 146, 65)" : "white";
                    var shortenedName = name.length > 40 ? name.substring(0, 40) + "..." : name;
                    productPanel += "<div style='background-color: " + bgColor + "' id='" + index + "' onclick='sn.clickActions(this);' class='form-group col-sm-4 col-xs-12'>";
                    productPanel += "<label style='display: none;'>" + id + "</label>";
                    productPanel += "<img align='center' src='" + images + "' width='250' height='200'>";
                    productPanel += "<h5 title='" + name + "'>" + shortenedName + "</h5>";
                    productPanel += "<h5 style='height: 30px;'><b>Category: </b>" + cat + "</h5>";
                    productPanel += "<h5 style='height: 30px;'><b>Product Brand: </b>" + productBrand + "</h5>";
                    productPanel += "</div>";
                }
            });
            $("#productPanel").append(productPanel);
            $('.content-wrapper').loading('stop');
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR cat.jsp *****/
    retrieveAllCategories: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveCats', {});
        if (result.status) {
            var catList = result.categories;
            if (catList !== undefined) {
                for (var i = 0; i < catList.length; i++) {
                    var category = catList[i];
                    var output = "<tr id='" + i + "'>";
                    var catName = category.name.replace("&", "%26");
                    output += "<td>" + category._id + "</td>";
                    output += "<td>" + category.name + "</td>";
                    output += "<td><center><a href=\"updateCat.jsp?id=" + category._id + "\" class='btn btn-default'>Update</a></center></td>";
                    output += "<td><center><a onclick=\"deleteCat('" + category._id + "'," + i + ")\" class='btn btn-default'>Delete</a></center></td>";
                    output += " </tr>";
                    $('#categories tbody').append(output);
                }
                var table = $('#categories').DataTable({
                    'paging': true,
                    'lengthChange': true,
                    'searching': true,
                    'ordering': true,
                    'info': true,
                    'autoWidth': true,
                    'order': [[ 1, 'asc' ]]
                });
                // Apply the search
                table.columns(1).every(function () {
                    var that = this;

                    $('#search').on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
            }
            else {
                $('#categories tbody').append("<tr><td colrpsn='4'>No category found</td></tr>");
            }
        }
        else {
            $('#categories tbody').append("<tr><td colrpsn='4'>No category found</td></tr>");
        }
        $('.content-wrapper').loading('stop');
    },
    
    deleteCategory: async function(catId, index) {
        if (confirm('Are you sure you want to delete this category?')) {
            var self = this;
            var result = await self.retrieveWsData('POST', 'deleteCat', {categoryId: catId});
            if (result.status) {
                var table = $('#categories').DataTable();
                table.row($('tr#' + index)).remove().draw(false);
                $.toast({
                    heading: 'Success',
                    text: "Category successfully removed!",
                    showHideTransition: 'fade',
                    icon: 'success'
                });
            }
            else {
                $.toast({
                    heading: 'Error',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        }
    },
    
    /***** METHODS FOR addCat.jsp *****/
    addCategory: async function(catName) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'addCat', {catName: catName});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message + "...<br>Redirecting in 1 seconds...",
                showHideTransition: 'fade',
                icon: 'success'
            });
            setTimeout(function () {
                location.replace("cat.jsp");
            }, 1000);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $('#addCat').blur();
    },
    
    /***** METHODS FOR updateCat.jsp *****/
    retrieveCategory: async function(catId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveCat', {categoryID: catId});
        if (result.status) {
            var category = result.category;
            var categoryName = category.name;
            $("#catName").val(categoryName);
            $("#catName").focus();
        }
        else {
            if (result.message === 'Invalid category ID detected!') {
                location.replace('cat.jsp');
                return;
            }
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    updateCategory: async function(catId, catName) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'updateCat', {catId: catId, catName: catName});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
            self.retrieveCategory(catId);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR pbrand.jsp *****/
    retrieveAllPbrands: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveAllPBrands', {});
        if (result.status) {
            var productBrands = result.productBrands;
            if (productBrands !== undefined) {
                $.each(productBrands, function(index, productBrand) {
                    var productBrandName = productBrand.name;
                    var tier1 = productBrand.tier1;
                    var tier2 = productBrand.tier2;
                    var tier3 = productBrand.tier3;
                    var tier4 = productBrand.tier4;

                    var productBrandsPanel = "<tr id='" + index + "'>";
                    productBrandsPanel += "<td>" + productBrand._id + "</td>";
                    productBrandsPanel += "<td>" + productBrandName + "</td>";
                    productBrandsPanel += "<td>" + tier1 + "</td>";
                    productBrandsPanel += "<td>" + tier2 + "</td>";
                    productBrandsPanel += "<td>" + tier3 + "</td>";
                    productBrandsPanel += "<td>" + tier4 + "</td>";
                    productBrandsPanel += "<td><center><a onclick=\"applyDiscount('" + productBrand._id + "')\" class='btn btn-default'>Apply</a></center></td>";
                    productBrandsPanel += "<td><center><a href=\"updatePbrand.jsp?id=" + productBrand._id + "\" class='btn btn-default'>Update</a></center></td>";
                    productBrandsPanel += "<td><center><a onclick=\"deletePBrand('" + productBrand._id + "'," + index + ")\" class='btn btn-default'>Delete</a></center></td>";
                    productBrandsPanel += " </tr>";
                    $('#pbrands tbody').append(productBrandsPanel);
                });
                var table = $('#pbrands').DataTable({
                    'paging': true,
                    'lengthChange': true,
                    'searching': true,
                    'ordering': true,
                    'info': true,
                    'autoWidth': true,
                    'order': [[ 1, 'asc' ]]
                });
                // Apply the search
                table.columns(1).every(function () {
                    var that = this;

                    $('#search').on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
            }
            else {
                $('#pbrands tbody').append("<tr><td colrpsn='4'>No product brands found</td></tr>");
            }
        }
        else {
            $('#pbrands tbody').append("<tr><td colrpsn='4'>No product brands found</td></tr>");
        }
        $('.content-wrapper').loading('stop');
    },
    
    applyPbrandDiscount: async function(pbrandId) {
        if (confirm('Are you sure you want to apply this discount? All dealers who have product brand discounts will be affected.')) {
            var self = this;
            var result = await self.retrieveWsData('POST', 'applyPbrandDiscount', {productBrandID: pbrandId});
            if (result.status) {
                $.toast({
                    heading: 'Success',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'success'
                });
            }
            else {
                $.toast({
                    heading: 'Error',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        }
    },
    
    deletePbrand: async function(pbrandId, index) {
        if (confirm('Are you sure you want to delete this product brand?')) {
            var self = this;
            var result = await self.retrieveWsData('POST', 'deleteProductBrand', {productBrandID: pbrandId});
            if (result.status) {
                var table = $('#pbrands').DataTable();
                table.row($('tr#' + index)).remove().draw(false);
                $.toast({
                    heading: 'Success',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'success'
                });
            }
            else {
                $.toast({
                    heading: 'Error',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        }
    },
    
    /***** METHODS FOR addPbrand.jsp *****/
    addPbrand: async function(data) {
        var self = this;
        var result = await self.retrieveMultiWsData('POST', 'addPbrand', data);
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message + "...<br>Redirecting in 1 seconds...",
                showHideTransition: 'fade',
                icon: 'success'
            });
            setTimeout(function () {
                location.replace("pbrand.jsp");
            }, 1000);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $("#addBM").blur();
    },
    
    /***** METHODS FOR updatePbrand.jsp *****/
    retrievePbrand: async function(pbId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveProductBrand', {productBrandID: pbId});
        if (result.status) {
            var productBrand = result.productBrand;
            var id = productBrand._id;
            var name = productBrand.name;
            var tier1 = productBrand.tier1;
            if (isNaN(tier1)) {
                tier1 = "0.00";
            }
            tier1 = parseFloat(tier1).toFixed(2);

            var tier2 = productBrand.tier2;
            if (isNaN(tier2)) {
                tier2 = "0.00";
            }
            tier2 = parseFloat(tier2).toFixed(2);

            var tier3 = productBrand.tier3;
            if (isNaN(tier3)) {
                tier3 = "0.00";
            }
            tier3 = parseFloat(tier3).toFixed(2);

            var tier4 = productBrand.tier4;
            if (isNaN(tier4)) {
                tier4 = "0.00";
            }
            tier4 = parseFloat(tier4).toFixed(2);

            var pbrandImage = productBrand.img;
            if (pbrandImage === undefined || pbrandImage.trim().length === 0) {
                pbrandImage = "images/no-images.jpg";
                $('#pbrandImage').attr('src', 'images/no-image.jpeg');
            }
            else {
                $('#pbrandImage').attr('src', base + '/' + pbrandImage);
            }

            $("#pbID").val(id);
            $("#productbrand").val(name);
            $("#t1bd").val(tier1);
            $("#t2bd").val(tier2);
            $("#t3bd").val(tier3);
            $("#t4bd").val(tier4);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    updatePbrand: async function(data, pbId) {
        var self = this;
        var result = await self.retrieveMultiWsData('POST', 'updatePbrand', data);
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
            await self.retrievePbrand(pbId);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $("#updatePBrand").blur();
        $('.content-wrapper').loading('stop');
    },
    
    /***** METHODS FOR BM.jsp *****/
    retrieveAllBMs: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveAllBNM', {});
        if (result.status) {
            var bnm = result.bnm;
            if (bnm !== undefined) {
                for (var i = 0; i < bnm.length; i++) {
                    var _id = bnm[i]._id;
                    var brand = bnm[i].brand;
                    var modelList = bnm[i].modelList;

                    var models = "";

                    if (modelList.length > 0) {                
                        var firstModel = modelList[0];
                        firstModel = firstModel.replace(/%C2%B2/g, '&#178;');
                        firstModel = firstModel.replace(/%C2%B3/g, '&#179;');
                        firstModel = firstModel.replace(/%C2%B4/g, '&#180;');
                        firstModel = firstModel.replace(/�/g, '');
                        var models = firstModel;
                        for (var j = 1; j < modelList.length; j++) {
                            var model = modelList[j];
                            model = model.replace(/%C2%B2/g, '&#178;');
                            model = model.replace(/%C2%B3/g, '&#179;');
                            model = model.replace(/%C2%B4/g, '&#180;');
                            model = model.replace(/�/g, '');
                            models += "<br>" + model;
                        }
                    }
                    var output = "<tr id='" + i + "'>";
                    output += "<td>" + brand + "</td>";
                    output += "<td>" + (models === undefined ? "<b><i>No models selected</i></b>" : models) + "</td>";
                    output += "<td><center><a href='updateBM.jsp?id=" + _id + "' class='btn btn-default'>Update</a></center></td>";
                    output += "<td><center><a onclick=\"deleteBrand('" + _id + "','" + i + "')\" class='btn btn-default'>Delete</a></center></td>";
                    output += "</tr>";
                    $('#BMs tbody').append(output);
                }
                var table = $('#BMs').DataTable({
                    'paging': true,
                    'lengthChange': true,
                    'searching': true,
                    'ordering': true,
                    'info': true,
                    'autoWidth': true
                });

                // Apply the search
                table.columns().every(function () {
                    var that = this;

                    $('#search').on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
            } else {
                $('#products tbody').append("<tr><td colspan='4'>No Brand and Model found</td></tr>");
            }
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $('.content-wrapper').loading('stop');
    },
    
    deleteBM: async function(BMId, index) {
        if (confirm('Are you sure you want to delete this brand?')) {
            var self = this;
            var result = await self.retrieveWsData('POST', 'deleteBNM', {brandNmodelID: BMId});
            if (result.status) {
                var table = $('#BMs').DataTable();
                table.row($('tr#' + index)).remove().draw();
                $.toast({
                    heading: 'Success',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'success'
                });
            }
            else {
                $.toast({
                    heading: 'Error',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        }
    },
    
    /***** METHODS FOR addBM.jsp *****/
    addBM: async function(brand, models) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'addBM', {brand: brand, models: models});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message + "...<br>Redirecting in 1 seconds...",
                showHideTransition: 'fade',
                icon: 'success'
            });
            setTimeout(function () {
                location.replace("BM.jsp");
            }, 1000);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $("#addBM").blur();
    },
    
    /***** METHODS FOR updateBM.jsp *****/
    retrieveBM: async function(BMId) {
        $("#model").empty();
        var self = this;
        var result = await self.retrieveWsData('POST', 'rerieveBNM', {brandId: BMId});
        if (result.status) {
            var brandObj = result.brandObj;
            var brand = brandObj.brand;
            var modelList = brandObj.modelList;
            $("#brand").val(brand);
            $.each(modelList, function (index, value) {
                var modelElement = "<tr id='" + index + "'>";
                modelElement += "<td><input type='text' class='form-control model' value='" + value + "'><td>";
                modelElement += "<td><center><a onclick='deleteModel(" + index + ")' class='btn btn-default'>Remove</a></center></td>";
                modelElement += "</tr>";
                $("#model").append(modelElement);
            });
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    updateBM: async function(BMId, brand, models) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'updateBM', {id: BMId, brand: brand, models: models});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
            await self.retrieveBM(BMId);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $("#updateBM").blur();
    },
    
    deleteModel: async function(id, index) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'deleteModel', {bnmID: id, index: parseInt(index)});
        if (result.status) {
            $("tr#" + index).remove();
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR zombieManager.jsp *****/
    retrieveAllZombies: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveAllZombies', {});
        if (result.status) {
            var zombieList = result.zombies;
            if (zombieList !== undefined && zombieList.length > 0) {
                $.each(zombieList, function(index, zombie) {
                    var zombieName = zombie.name.replace("&", "%26");
                    var zombieListPanel = "<tr id='" + index + "'>";
                    zombieListPanel += "<td>" + zombie.username + "</td>";
                    zombieListPanel += "<td>" + zombieName + "</td>";
                    zombieListPanel += "<td><center><a href=\"updateZombie.jsp?id=" + zombie._id + "\" class='btn btn-default'>Update</a></center></td>";
                    zombieListPanel += "<td><center><a onclick=\"deleteZombie('" + zombie._id + "'," + index + ")\" class='btn btn-default'>Delete</a></center></td>";
                    zombieListPanel += " </tr>";
                    $('#zombies tbody').append(zombieListPanel);
                });
                var table = $('#zombies').DataTable({
                    'paging': true,
                    'lengthChange': true,
                    'searching': true,
                    'ordering': false,
                    'info': true,
                    'autoWidth': true
                });
                // Apply the search
                table.columns(1).every(function () {
                    var that = this;

                    $('#search').on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
            }
            else {
                $('#zombies tbody').append("<tr><td colrpsn='4'>No zombie accounts found</td></tr>");
            }
        }
        else {
            $("#zombies tbody").append("<tr><td colspan='6'>No zombie accounts found</td></tr>");
        }
        $('.content-wrapper').loading('stop');
    },
    
    deleteZombie: async function(zombieId, index) {
        var self = this;
        if (confirm('Are you sure you want to delete this selected zombie?')) {
            var result = await self.retrieveWsData('POST', 'deleteZombie', {zombieId: zombieId});
            if (result.status) {
                var table = $('#zombies').DataTable();
                table.row($('tr#' + index)).remove().draw();
                $.toast({
                    heading: 'Success',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'success'
                });
            }
            else {
                $.toast({
                    heading: 'Error',
                    text: result.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            }
        }
    },
    
    /***** METHODS FOR addZombie.jsp *****/
    addZombie: async function(username, password) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'addZombie', {username: username, password: password});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message + "...<br>Redirecting in 1 seconds...",
                showHideTransition: 'fade',
                icon: 'success'
            });
            setTimeout(function () {
                location.replace("zombieManager.jsp");
            }, 1000);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
        }
        $("#addZombie").blur();
    },
    
    /***** METHODS FOR updateZombie.jsp *****/
    retrieveZombie: async function(zombieId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveZombie', {zombieId: zombieId});
        if (result.status) {
            var zombie = result.zombie;
            var username = zombie.username;
            var password = zombie.password;
            $("#username").val(username);
            $("#password").val(password);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    updateZombie: async function(zombieId, username, password) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'updateZombie', {id: zombieId, username: username, password: password});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
            await self.retrieveZombie(zombieId);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $("#updateZombie").blur();
    },
    
    /***** METHODS FOR accountApproval.jsp *****/
    retrieveUnapprovedAccounts: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveUnapprovedAccounts', {});
        if (result.status) {
            var accounts = result.accounts;
            var fbAccounts = result.fbaccounts;
            var googleAccounts = result.googleaccounts;
            
            if (accounts.length === 0 && fbAccounts.length === 0 && googleAccounts.length === 0) {
                $('#accounts tbody').append("<tr><td colrpsn='4'>No accounts to be approved</td></tr>");
                $('.content-wrapper').loading('stop');
                return;
            }
            var index = 0;
            if (accounts.length !== 0) {
                accounts.forEach(function(account) {
                    var username = account.username;
                    var email = account.email;
                    var output = "<tr id=\"" + index + "\">";
                    output += "<td>" + (index + 1) + "</td>";
                    output += "<td>" + username + "</td>";
                    output += "<td>" + email + "</td>";
                    output += "<td><center><a onclick=\"approve('" + index++ + "','" + email + "','" + username + "') \" target='_blank' class='btn btn-default'>Approve</a></center></td>";
                    output += " </tr>";
                    $('#accounts tbody').append(output);
                });
            }
            
            if (fbAccounts.length !== 0) {
                fbAccounts.forEach(function(fbAccount) {
                    var fbId = fbAccount.fb_id;
                    var email = fbAccount.email;
                    var output = "<tr id=\"" + index + "\">";
                    output += "<td>" + (index + 1) + "</td>";
                    output += "<td>" + fbId + "</td>";
                    output += "<td>" + email + "</td>";
                    output += "<td><center><a onclick=\"approveFb('" + index++ + "','" + email + "','" + fbId + "') \" target='_blank' class='btn btn-default'>Approve</a></center></td>";
                    output += " </tr>";
                    $('#accounts tbody').append(output);
                });
            }
            
            if (googleAccounts.length !== 0) {
                googleAccounts.forEach(function(googleAccount) {
                    var googleId = googleAccount.google_id;
                    var email = googleAccount.email;
                    var output = "<tr id=\"" + index + "\">";
                    output += "<td>" + (index + 1) + "</td>";
                    output += "<td>" + googleId + "</td>";
                    output += "<td>" + email + "</td>";
                    output += "<td><center><a onclick=\"approveGoogle('" + index++ + "','" + email + "','" + googleId + "') \" target='_blank' class='btn btn-default'>Approve</a></center></td>";
                    output += " </tr>";
                    $('#accounts tbody').append(output);
                });
            }
            
            var table = $('#accounts').DataTable({
                'paging': true,
                'lengthChange': true,
                'searching': true,
                'ordering': true,
                'info': true,
                'autoWidth': true
            });

            // Apply the search
            table.columns(1).every(function () {
                var that = this;

                $('#search').on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                });
            });
            $('.content-wrapper').loading('stop');
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },

    approveAccount: async function(email, username, index) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'approveAccount', {email: email, username: username});
        if (result.status) {
            var table = $('#accounts').DataTable();
            table.row($('tr#' + index)).remove().draw();
            $('.content-wrapper').loading('stop');
            location.replace("assignTier.jsp?type=sn&email=" + email + "&username=" + username);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },

    approveFbAccount: async function(email, fbId, index) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'approveFBAccount', {email: email, fbId: fbId});
        console.log(result);
        if (result.status) {
            var table = $('#accounts').DataTable();
            table.row($('tr#' + index)).remove().draw();
            $('.content-wrapper').loading('stop');
            location.replace("assignTier.jsp?clientId=" + result.clientId);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },

    approveGoogleAccount: async function(email, googleId, index) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'approveGoogleAccount', {email: email, googleId: googleId});
        console.log(result);
        if (result.status) {
            var table = $('#accounts').DataTable();
            table.row($('tr#' + index)).remove().draw();
            $('.content-wrapper').loading('stop');
            location.replace("assignTier.jsp?clientId=" + result.clientId);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR assignTier.jsp *****/
    assignTier: async function(clientId, tier) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'assignTier', {clientId: clientId, tier: tier});
        if (result.status) {
            location.replace("accountApproval.jsp");
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR viewBuygerAccount.jsp *****/
    retrieveCRM: async function(type) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveCRM', {type: type});
        if (result.status) {
            var users = result.users;
            if (users !== undefined && users.length > 0) {
                for (var i = 0; i < users.length; i++) {
                    user = users[i];
                    var infor = "<tr id='" + i + "'>";
                    infor += " <td>" + user._id + "</td>";
                    infor += "<td>" +user.fname +" "+user.lname + "</td>";
                    infor += "<td>" + user.username+"</td>";
                    infor += "<td>" + user.billAddress.country+"</td>";
                    infor += "<td>" + user.email+"</td>";
                    infor += "<td>" + (user.total).toFixed(2)+"</td>";
                    if (type === 'Buyer') {
                        infor += "<td><center><a href='buyerAccount.jsp?id=" +user._id + "' target='_blank' class='btn btn-default'>View User</a></center></td>";
                    }
                    else {
                        infor += "<td><center><a href='dealerAccount.jsp?id=" +user._id + "' target='_blank' class='btn btn-default'>View User</a></center></td>";
                    }
                    infor += "</tr>";
                    $("#userListing tbody").append(infor);
                }
            }
            else {
                $("#userListing tbody").append("<tr><td colrpsn='9'>No users found</td></tr>");
            }
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $('.content-wrapper').loading('stop');
    },
    
    /***** METHODS FOR buyerAccount.jsp & dealerAccount.jsp *****/
    retrieveCRMByClientId: async function(type, clientId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveCRMByClientId', {type: type, clientId: clientId});
        if (result.status) {
            var user = result.user[0];
            if (user !== undefined) {
                var infor = "<tr>";
                infor += "<td>" + user._id + "</td>";
                infor += "<td>" + user.fname + " " + user.lname + "</td>";
                infor += "<td>" + user.username + "</td>";
                infor += "<td>" + user.billAddress.street + "<br>";
                infor += user.billAddress.country;
                infor += "(" + user.billAddress.zip + ")</td>";
                infor += "<td>Phone: " + user.contact + "<br>";
                infor += " Email: " + user.email + "</td>";
                infor += "<td>" + (user.total).toFixed(2) + "</td>";
                $("#userListing").append(infor);
                if (type === 'Dealer') {
                    $("#edit").append("<center><a href='editTier.jsp?id=" + clientId + "' target='_blank' class='btn btn-default'>Edit Tier</a></center>");
                }
            }
            else {
                $("#userListing tbody").append("<tr><td colrpsn='9'>No data found</td></tr>");
            }
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $('.content-wrapper').loading('stop');
    },
    
    retrieveTransactions: async function(clientId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveTransactions', {clientId: clientId});
        if (result.status) {
            var transactions = result.transactions;
            for (var i = 0; i < transactions.length; i++) {
                var transaction = transactions[i];
                var currency = transaction.currency;
                var shippingCosts = parseFloat(transaction.shippingCosts);
                var total = parseFloat(self.calculateCartCost(transaction.cart));
                var infor = "<tr style='height:100px'>";
                infor += "<td colspan='2'>";
                infor += transaction.transactionId;
                infor += "</td>";
                infor += "<td class='mobile-nav-display-none'>";
                infor += transaction.transaction_date;
                infor += " </td>";
                infor += "<td class='mobile-nav-display-none-1'>";
                infor += currency + " " + total;
                infor += "</td>";
                infor += "<td class='mobile-nav-display-none'>";
                infor += currency + " " + parseFloat(transaction.shippingCosts).toFixed(2);
                infor += "</td><td align=\"center\">";
                infor += "<a href='invoice.jsp?cartId=" + transaction.cartId + "&_id=" + id + "' style=\"padding-right:10px \" target=\"_blank\" class=\"button\">View Invoice</a></td></tr>";
                $("#transactionHistory").append(infor);
            }
        }
        else {
            $("#transactionHistory").append("<tr><td colspan='6'>No transactions found</td></tr>");
        }
    },
    
    calculateCartCost: function(cartItems) {
        var total = 0;
        for (var i = 0; i < cartItems.length; i++) {
            var cart = cartItems[i];
            var cart_items = cart.cart_items;
            for (var j = 0; j < cart_items.length; j++) {
                var cart_item = cart_items[j];
                var price = parseFloat(cart_item.price);
                var qty = parseInt(cart_item.qty);
                total += (price * qty).toFixed(2);
            }
        }
        return parseFloat(total);
    },
    
    /***** METHODS FOR editTier.jsp *****/
    retrieveTierInformation: async function(clientId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveTier', {userId: clientId});
        if (result.status) {
            var tierNo = result.tierNo;
            $("#tier").append("<option value=''>Select Tier</option>");
            for (var i = 1; i <= 4; i++) {
                var isSelected = (i === tierNo) ? "selected" : "";
                $("#tier").append("<option " + isSelected + ">" + i + "</option>");
            }
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    retrieveProductBrandById: async function(clientId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrievePbrandById', {userId: clientId});
        if (result.status) {
            var productbrands = result.productbrands;
            $("#productbrands").empty();
            $("#productbrands").append("<option value=''>Select Product Brand</option>");
            $.each(productbrands, function(index, pbrand) {
                $("#productbrands").append("<option>" + pbrand + "</option>");
            });
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    retrieveBrandDiscountsByUserId: async function(clientId) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveBrandDiscounts', {userId: clientId});
        if (result.status) {
            var details = result.details;
            var discounted_brands = details.discounted_brands;
            var discounted_brands_value = details.discounted_brands_value;
            $("#discountTable tbody").empty();
            if (discounted_brands.length === 0) {
                $("#discountTable tbody").append("<tr><td colspan='4'><b>User do not have any Product Brand Discounts</b></td></tr>");
            }
            else {
                var discountDetailsPanel = "";
                $.each(discounted_brands, function(index, brand) {
                    var brandDiscount = discounted_brands_value[index];
                    discountDetailsPanel += "<tr>";
                    discountDetailsPanel += "<td id='name" + index + "'>" + brand + "</td>";
                    discountDetailsPanel += "<td>";
                    discountDetailsPanel += "<input id='" + index + "' type='text' class='form-control number-format' placeholder='Enter new Discount Value' value='" + brandDiscount + "'>";
                    discountDetailsPanel += "</td>";
                    discountDetailsPanel += "<td>";
                    discountDetailsPanel += "<button id='" + index + "-update' type='button' class='updateBrandDiscount btn btn-primary'>Update Brand Discount</button>&emsp;";
                    discountDetailsPanel += "<button id='" + index + "-delete' type='button' class='deleteBrandDiscount btn btn-primary'>Delete Brand Discount</button>";
                    discountDetailsPanel += "</td>";
                    discountDetailsPanel += "<td>";
                    discountDetailsPanel += "</td>";
                    discountDetailsPanel += "</tr>";
                });
                
                $("#discountTable tbody").append(discountDetailsPanel);
            }
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    updateTier: async function(clientId, tierNo) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'updateTier', {userId: clientId, tierNo: tierNo});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $("#tierBtn").blur();
    },
    
    addPbrandDiscount: async function(clientId, pbrand) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'addUserPbrandDiscount', {userId: clientId, pbrand: pbrand});
        if (result.status) {
            await self.retrieveBrandDiscountsByUserId(clientId);
            await self.retrieveProductBrandById(clientId);
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $("#brandDiscountBtn").blur();
    },
    
    updatePbrandDiscount: async function(clientId, pbrand, discountValue) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'updateUserPbrandDiscount', {userId: clientId, pBrand: pbrand, pDiscount: discountValue});
        if (result.status) {
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $(".updateBrandDiscount").blur();
    },
    
    deletePbrandDiscount: async function(clientId, pbrand) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'deleteUserPbrandDiscount', {userId: clientId, pBrand: pbrand});
        if (result.status) {
            await self.retrieveBrandDiscountsByUserId(clientId);
            await self.retrieveProductBrandById(clientId);
            $.toast({
                heading: 'Success',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'success'
            });
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
        $(".deleteBrandDiscount").blur();
    },
    
    /***** METHODS FOR orders.jsp *****/
    retrieveAllTransactions: async function() {
        var self = this;
        var result = await self.retrieveWsData('POST', 'retrieveAllTransactions', {});
        if (result.status) {
            var transactions = result.transactions;
            for (var i = 0; i < data.transactions.length; i++) {
                var transaction = data.transactions[i];
                var currency = transaction.currency;
                var transactionId = transaction._id; 
                var date = new Date(transaction.transaction_date);
                var transactionDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                var shippingDetails = transaction.shippingDetails;
                var CustName = shippingDetails.name;
                var cart = transaction.cart;
                var transactionAmt = 0;
                var status = "";
                for (var j = 0; j < cart.length; j++) {
                    var cartItem = cart[j].cart_items;
                    for(var k = 0; k < cartItem.length; k++){
                        transactionAmt += (parseFloat(cartItem[k].price).toFixed(2) * parseFloat(cartItem[k].qty));
                    }
                    status = cart[j].status;
                }
                var info = "<tr>";
                info += "<td>" + transactionId + "</td>";
                info += "<td>" + transactionDate + "</td>";
                info += "<td>" + currency + " " + transactionAmt + "</td>";
                info += "<td>" + CustName + "</td>";
                info += "<td>" + status + "</td>";
                info += "<td><center><a href='transaction.jsp?cartId=" + transaction.cartId + "&clientId=" + transaction.clientId + "' class=\"btn btn-default\">View More..</a></center></td>";
                info += "</tr>";
                $('#tranList').append(info);
            }
            $('#orders').DataTable({
                'paging': true,
                'lengthChange': true,
                'searching': true,
                'ordering': true,
                'info': true,
                'autoWidth': true
            });
        }
        else {
            $("#tranList").append("<tr><td colspan='5'>No orders found</td></tr>");
        }
        $('.content-wrapper').loading('stop');
    },
    
    /***** METHODS FOR transaction.jsp *****/
    retrieveCart: async function(clientId, cartId, cart, transaction, shipStatus) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'cartForInvoice', {clientId: clientId, cartId: cartId});
        if(result.status) {
            cart = result.cart;
            var cart_items = cart.cart_items;
            var productTotalWeight = 0.0;
            var subTotal = 0.0;
            $.each(cart_items, function(index, cart_item) {
                var productQty = parseFloat(cart_item.qty);
                var productUprice = parseFloat(cart_item.price);
                var productWeight = parseFloat(cart_items.weight);
                productTotalWeight += productWeight * productQty;
                subTotal += productUprice * productQty;
                
                var cartInfoPanel = "<tr>";
                cartInfoPanel += "<th>" + (i+1) + "</th>";
                cartInfoPanel += "<td>" +  cartItems[i].name + "</td>";
                cartInfoPanel += "<td>" + productQty + "</td>";
                cartInfoPanel += "<td>" + productWeight + "KG</td>";
                cartInfoPanel += "<td>" + productUprice + "</td>";
                cartInfoPanel += "<td>" + (productUprice * productQty).toFixed(2) + "</td>";
                cartInfoPanel += "</tr>";
                
                $("#invoiceDetails").append(cartInfoPanel);
            });
            if(cart.status === "Shipped") {
                $("#shipped").hide();
            }
            
            transaction = cart.transaction[0];
            var shipping = transaction.shippingCosts;
            var paymentType = transaction.paymentType;
            var tDate = new Date(transaction.transaction_date);
            var shippingDetails = transaction.shippingDetails;
            var shipmentInfos = transaction.shipmentInfo;
            var noPackage;
            
            $.each(shipmentInfos, function(index, shipmentInfo) {
                $("#orderIds").append("<option>" + shipmentInfo.shipmentId + "</option>");
                noPackage += shipmentInfo.shipment.length;
            });
            
            shipStatus = transaction.shipmentInfo[0].isShipped;
            var name = shippingDetails.name;
            var street = shippingDetails.street1;
            var zip = shippingDetails.zip;
            var city = shippingDetails.city;
            var phone = shippingDetails.phone;
            var courier = transaction.courier;
            var total = parseFloat(subTotal) + parseFloat(shipping);
            
            $("#name").html(name);
            $("#postal").html(city + ", " + zip);
            $("#street1").html(street);
            $("#inum").html(transaction._id);
            $("#totalWeight").html(parseFloat(productTotalWeight).toFixed(2) + "KG");
            $("#noPackage").html(noPackage);
            $("#subTotal").html(subTotal.toFixed(2));
            $("#shipping").html(parseFloat(shipping).toFixed(2));
            $("#total").html(parseFloat(total).toFixed(2));
            $("#forwader").html(courier);
            $("#mValue").html(subTotal.toFixed(2));
            $("#phone").html(phone);
            $("#tDate").html("Date: " + tDate.getDate() + "/" + (tDate.getMonth() + 1) + "/" + tDate.getFullYear());
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    buyShipment: async function(orderId, courier, cartId, shipStatus) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'buyShipment', {orderId: orderId, service: courier, cartId: cartId, isShipped: shipStatus});
        if(result.status) {
            $.toast({
                heading: 'Error',
                text: "Order has been marked shipped...<br>Navigating back to order list...",
                showHideTransition: 'fade',
                icon: 'error'
            });
            
            setTimeout(function() {
                location.replace("orders.jsp");
            }, 2000);
        }
        else {
            $.toast({
                heading: 'Error',
                text: result.message,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    },
    
    /***** METHODS FOR invoice.jsp and invoice-print.jsp *****/
    retrieveInvoiceDetails: async function(clientId, cartId, isPrint) {
        var self = this;
        var result = await self.retrieveWsData('POST', 'cartForInvoice', {clientId: clientId, cartId: cartId});
        if(result.status) {
            var cart = result.cart;
            var cartItems = cart.cart_items;
            var transaction = cart.transaction[0];
            var transactionId = transaction._id;
            var currency = transaction.currency;
            var productTotalWeight;
            var subTotal;
            
            for (var i = 0; i < cartItems.length; i++) {
                var cartItem = cartItems[i];
                var productQty = parseFloat(cartItem.qty);
                var productUprice = parseFloat(cartItem.price);
                var productWeight = parseFloat(cartItem.weight);
                productTotalWeight += productWeight * productQty;
                subTotal += productUprice * productQty;
                cartInfo = "<tr>";
                cartInfo += "<th>" + (i + 1) + "</th>";
                cartInfo += "<td>" + cartItems[i].name + "</td>";
                cartInfo += "<td>" + productQty + "</td>";
                cartInfo += "<td>" + productWeight + "KG</td>";
                cartInfo += "<td>" + currency + " " + productUprice + "</td>";
                cartInfo += "<td>" + currency + " " + (productUprice * productQty).toFixed(2) + "</td>";
                cartInfo += "</tr>";
                $("#invoiceDetails").append(cartInfo);
            }
            var courier = transaction.courier;
            var shipping = transaction.shippingCosts;
            var paymentType = transaction.paymentType;
            var tDate = new Date(transaction.transaction_date);
            var shippingDetails = transaction.shippingDetails;
            var name = shippingDetails.name;
            var street = shippingDetails.street1;
            var zip = shippingDetails.zip;
            var city = shippingDetails.city;
            var shipmentInfos = transaction.shipmentInfo;
            var noPackage = 0;
            
            for (var j = 0; j < shipmentInfos.length; j++) {
                var shipmentInfo = shipmentInfos[j];
                var shipment = shipmentInfo.shipment;
                noPackage += shipment.length;
            }
            
            var total = subTotal + shipping;
            $('#cid').html(clientId);
            $('#name').html(name);
            $('#postal').html(city + ", " + zip);
            $('#street1').html(street);
            $('#inum').html(transactionId);
            $('#totalWeight').html(productTotalWeight + "KG");
            $('#noPackage').html(noPackage);
            $('#subTotal').html(currency + " " + subTotal.toFixed(2));
            $('#shipping').html(currency + " " + parseFloat(shipping).toFixed(2));
            $('#total').html(currency + " " + parseFloat(total).toFixed(2));
            $('#paymentType').html(paymentType);
            $('#forwader').html(courier);
            $('#mValue').html(currency + " " + subTotal.toFixed(2));
            $('#tDate').html(tDate.getDate() + "/" + (tDate.getMonth() + 1) + "/" + tDate.getFullYear());
            
            if (isPrint) {
                window.print();
            }
        }
        else {
            location.replace('orders.jsp');
        }
    },
    
    /***** FUNCTIONAL METHODS FOR addProduct.jsp and updateProduct.jsp *****/
    foreignSGDCheck: function(sgdPrice) {
        var self = this;
        if (sgdPrice === "") {
            $('#foreignsgd, #foreignusd, #foreigneur').val("");
        }
        else {
            var usd_euro_vals = SGD_TO_USD_EURO(sgdPrice, self.rates);
            $('#foreignusd').val(usd_euro_vals[0]);
            $('#foreigneur').val(usd_euro_vals[1]);
        }
        
        if ($("#foreignsgd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
            $("#profitforeignsgd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
            $("#profitforeignsgd").text(tempVal.toFixed(2));
        }
        if ($("#foreignusd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
            $("#profitforeignusd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
            $("#profitforeignusd").text(tempVal.toFixed(2));
        }
        if ($("#foreigneur").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
            $("#profitforeigneuro").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
            $("#profitforeigneuro").text(tempVal.toFixed(2));
        }
    },
    
    foreignUSDCheck: function(usdPrice) {
        var self = this;
        if (usdPrice === "") {
            $('#foreignsgd, #foreignusd, #foreigneur').val("");
        }
        else {
            var sgd_euro_vals = USD_TO_SGD_EURO(usdPrice, sn.rates);
            $('#foreignsgd').val(sgd_euro_vals[0]);
            $('#foreigneur').val(sgd_euro_vals[1]);
        }
        
        if ($("#foreignsgd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
            $("#profitforeignsgd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
            $("#profitforeignsgd").text(tempVal.toFixed(2));
        }
        if ($("#foreignusd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
            $("#profitforeignusd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
            $("#profitforeignusd").text(tempVal.toFixed(2));
        }
        if ($("#foreigneur").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
            $("#profitforeigneuro").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
            $("#profitforeigneuro").text(tempVal.toFixed(2));
        }
    },
    
    foreignEURCheck: function(eurPrice) {
        var self = this;
        if (eurPrice === "") {
            $('#foreignsgd, #foreignusd, #foreigneur').val("");
        }
        else {
            var sgd_usd_vals = EUR_TO_SGD_USD(eurPrice, sn.rates);
            $('#foreignsgd').val(sgd_usd_vals[0]);
            $('#foreignusd').val(sgd_usd_vals[1]);
        }
            
        if ($('#foreignsgd').val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
            $("#profitforeignsgd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($('#foreignsgd').val()) - parseFloat($("#costwGstSgd").val());
            $("#profitforeignsgd").text(tempVal.toFixed(2));
        }
        if ($('#foreignusd').val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
            $("#profitforeignusd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($('#foreignusd').val()) - parseFloat($("#costwGstUsd").val());
            $("#profitforeignusd").text(tempVal.toFixed(2));
        }
        if ($("#foreigneur").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
            $("#profitforeigneuro").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
            $("#profitforeigneuro").text(tempVal.toFixed(2));
        }
    },
    
    localSGDCheck: function(sgdPrice) {
        var self = this;
        if (sgdPrice === "") {
            $('#localsgd, #localusd, #localeur').val("");
        }
        else {
            var usd_euro_vals = SGD_TO_USD_EURO(sgdPrice, sn.rates);
            $('#localusd').val(usd_euro_vals[0]);
            $('#localeur').val(usd_euro_vals[1]);
        }
            
        if ($("#localsgd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
            $("#profitlocalsgd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
            $("#profitlocalsgd").text(tempVal.toFixed(2));
        }
        if ($("#localusd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
            $("#profitlocalusd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
            $("#profitlocalusd").text(tempVal.toFixed(2));
        }
        if ($("#localeur").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
            $("#profitlocaleuro").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
            $("#profitlocaleuro").text(tempVal.toFixed(2));
        }
        self.RecalculateDiscountFromRetail();
    },
    
    localUSDCheck: function(usdPrice) {
        var self = this;
        if (usdPrice === "") {
            $('#localsgd, #localusd, #localeur').val("");
        }
        else {
            var sgd_euro_vals = USD_TO_SGD_EURO(usdPrice, sn.rates);
            $('#localsgd').val(sgd_euro_vals[0]);
            $('#localeur').val(sgd_euro_vals[1]);
        }
            
        if ($("#localsgd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
            $("#profitlocalsgd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
            $("#profitlocalsgd").text(tempVal.toFixed(2));
        }
        if ($("#localusd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
            $("#profitlocalusd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
            $("#profitlocalusd").text(tempVal.toFixed(2));
        }
        if ($("#localeur").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
            $("#profitlocaleuro").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
            $("#profitlocaleuro").text(tempVal.toFixed(2));
        }
        self.RecalculateDiscountFromRetail();
    },
    
    localEURCheck: function(eurPrice) {
        var self = this;
        if (eurPrice === "") {
            $('#localsgd, #localusd, #localeur').val("");
        }
        else {
            var sgd_usd_vals = EUR_TO_SGD_USD(eurPrice, sn.rates);
            $('#localsgd').val(sgd_usd_vals[0]);
            $('#localusd').val(sgd_usd_vals[1]);
        }
            
        if ($("#localsgd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
            $("#profitlocalsgd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
            $("#profitlocalsgd").text(tempVal.toFixed(2));
        }
        if ($("#localusd").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
            $("#profitlocalusd").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
            $("#profitlocalusd").text(tempVal.toFixed(2));
        }
        if ($("#localeur").val() === "") {
            var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
            $("#profitlocaleuro").text(tempVal.toFixed(2));
        } else {
            var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
            $("#profitlocaleuro").text(tempVal.toFixed(2));
        }
        self.RecalculateDiscountFromRetail();
    },
    
    RecalculateDiscountFromRetail: function() {
        var retailPrice = $('#localsgd').val() !== "" ? $('#localsgd').val() : 0;
        var markupPrice1 = $('#tier1markupprice').val();
        var markupPrice2 = $('#tier2markupprice').val();
        var markupPrice3 = $('#tier3markupprice').val();
        var markupPrice4 = $('#tier4markupprice').val();
        
        if (markupPrice1 === "") {
            $('#tier1discount').val("");
        }
        else {
            $('#tier1discount').val(((retailPrice - parseFloat(markupPrice1)) / retailPrice * 100).toFixed(2));
        }
        if (markupPrice2 === "") {
            $('#tier2discount').val("");
        }
        else {
            $('#tier2discount').val(((retailPrice - parseFloat(markupPrice2)) / retailPrice * 100).toFixed(2));
        }
        if (markupPrice3 === "") {
            $('#tier3discount').val("");
        }
        else {
            $('#tier3discount').val(((retailPrice - parseFloat(markupPrice3)) / retailPrice * 100).toFixed(2));
        }
        if (markupPrice4 === "") {
            $('#tier4discount').val("");
        }
        else {
            $('#tier4discount').val(((retailPrice - parseFloat(markupPrice4)) / retailPrice * 100).toFixed(2));
        }
    },
    
    copSGDCheck: function(sgdPrice) {
        var gst = $('#gst').val();
        if (gst === "") {
            gst = 7;
        } else {
            gst = parseInt(gst);
        }
        
        var usdPrice, eurPrice;
        if (sgdPrice === "") {
            $('#copsgd, #copusd, #copeur').val("");
            sgdPrice = usdPrice = eurPrice = 0;
        }
        else {
            var usd_euro_vals = SGD_TO_USD_EURO(sgdPrice, sn.rates);
            usdPrice = usd_euro_vals[0];
            eurPrice = usd_euro_vals[1];
            $('#copusd').val(usd_euro_vals[0]);
            $('#copeur').val(usd_euro_vals[1]);
        }
        
        // Update cop with gst & shipping
        if ($("#scsgd").val() === "") {
            var copPrice = parseFloat(sgdPrice);
            var gst_percent = (1 + gst / 100);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstSgd').val(costwGst);
        } else {
            var copPrice = parseFloat(sgdPrice);
            var shippingCost = parseFloat($("#scsgd").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstSgd').val(costwGstnShip);
        }
        if ($("#scusd").val() === "") {
            var copPrice = parseFloat(usdPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstUsd').val(costwGst);
        } else {
            var copPrice = parseFloat(usdPrice);
            var shippingCost = parseFloat($("#scusd").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstUsd').val(costwGstnShip);
        }
        if ($("#sceur").val() === "") {
            var copPrice = parseFloat(eurPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstEur').val(costwGst);
        } else {
            var copPrice = parseFloat(eurPrice);
            var shippingCost = parseFloat($("#sceur").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstEur').val(costwGstnShip);
        }
        
        // Update profit
        if (sgdPrice !== "" && sgdPrice !== 0) {
            if ($("#scsgd").val() !== "") {
                $(".showme").show();
            } else {
                $(".showme").hide();
                $("#profitlocalsgd").val("0");
                $("#profitforeignsgd").val("0");
                $("#profitlocalusd").val("0");
                $("#profitforeignusd").val("0");
                $("#profitlocaleuro").val("0");
                $("#profitforeigneuro").val("0");
            }
            if ($("#localsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            }
            if ($("#foreignsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            }
            if ($("#localusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            }
            if ($("#foreignusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            }
            if ($("#localeur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            }
            if ($("#foreigneur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            }
        } else {
            $(".showme").hide();
            $("#profitlocalsgd").val("0");
            $("#profitforeignsgd").val("0");
            $("#profitlocalusd").val("0");
            $("#profitforeignusd").val("0");
            $("#profitlocaleuro").val("0");
            $("#profitforeigneuro").val("0");
        }
    },
    
    copUSDCheck: function(usdPrice) {
        var gst = $('#gst').val();
        if (gst === "") {
            gst = 7;
        } else {
            gst = parseInt(gst);
        }
        
        var sgdPrice, eurPrice;
        if (usdPrice === "") {
            $('#copsgd, #copusd, #copeur').val("");
            sgdPrice = usdPrice = eurPrice = 0;
        }
        else {
            var sgd_euro_vals = USD_TO_SGD_EURO(usdPrice, sn.rates);
            sgdPrice = sgd_euro_vals[0];
            eurPrice = sgd_euro_vals[1];
            $('#copsgd').val(sgd_euro_vals[0]);
            $('#copeur').val(sgd_euro_vals[1]);
        }
        
        // Update cop with gst & shipping
        if ($("#scsgd").val() === "") {
            var copPrice = parseFloat(sgdPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstSgd').val(costwGst);
        } else {
            var copPrice = parseFloat(sgdPrice);
            var shippingCost = parseFloat($("#scsgd").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstSgd').val(costwGstnShip);
        }
        if ($("#scusd").val() === "") {
            var copPrice = parseFloat(usdPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstUsd').val(costwGst);
        } else {
            var copPrice = parseFloat(usdPrice);
            var shippingCost = parseFloat($("#scusd").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstUsd').val(costwGstnShip);
        }
        if ($("#sceur").val() === "") {
            var copPrice = parseFloat(eurPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstEur').val(costwGst);
        } else {
            var copPrice = parseFloat(eurPrice);
            var shippingCost = parseFloat($("#sceur").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstEur').val(costwGstnShip);
        }
        
        // Update profit
        if (usdPrice !== "" && usdPrice !== 0) {
            if ($("#scsgd").val() !== "") {
                $(".showme").show();
            } else {
                $(".showme").hide();
                $("#profitlocalsgd").val("0");
                $("#profitforeignsgd").val("0");
                $("#profitlocalusd").val("0");
                $("#profitforeignusd").val("0");
                $("#profitlocaleuro").val("0");
                $("#profitforeigneuro").val("0");
            }
            if ($("#localsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            }
            if ($("#foreignsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            }
            if ($("#localusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            }
            if ($("#foreignusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            }
            if ($("#localeur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            }
            if ($("#foreigneur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            }
        } else {
            $(".showme").hide();
            $("#profitlocalsgd").val("0");
            $("#profitforeignsgd").val("0");
            $("#profitlocalusd").val("0");
            $("#profitforeignusd").val("0");
            $("#profitlocaleuro").val("0");
            $("#profitforeigneuro").val("0");
        }
    },
    
    copEURCheck: function(eurPrice) {
        var gst = $('#gst').val();
        if (gst === "") {
            gst = 7;
        } else {
            gst = parseInt(gst);
        }
        
        var sgdPrice, usdPrice;
        if (eurPrice === "") {
            $('#copsgd, #copusd, #copeur').val("");
            sgdPrice = usdPrice = eurPrice = 0;
        }
        else {
            var sgd_usd_vals = EUR_TO_SGD_USD(eurPrice, sn.rates);
            sgdPrice = sgd_usd_vals[0];
            usdPrice = sgd_usd_vals[1];
            $('#copsgd').val(sgd_usd_vals[0]);
            $('#copusd').val(sgd_usd_vals[1]);
        }
        
        // Update cop with gst & shipping
        if ($("#scsgd").val() === "") {
            var copPrice = parseFloat(sgdPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstSgd').val(costwGst);
        } else {
            var copPrice = parseFloat(sgdPrice);
            var shippingCost = parseFloat($("#scsgd").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstSgd').val(costwGstnShip);
        }
        if ($("#scusd").val() === "") {
            var copPrice = parseFloat(usdPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstUsd').val(costwGst);
        } else {
            var copPrice = parseFloat(usdPrice);
            var shippingCost = parseFloat($("#scusd").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstUsd').val(costwGstnShip);
        }
        if ($("#sceur").val() === "") {
            var copPrice = parseFloat(eurPrice);
            var costwGst = (copPrice * (1 + gst / 100)).toFixed(2);
            $('#costwGstEur').val(costwGst);
        } else {
            var copPrice = parseFloat(eurPrice);
            var shippingCost = parseFloat($("#sceur").val());
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstEur').val(costwGstnShip);
        }
        
        // Update profit
        if (eurPrice !== "" && eurPrice !== 0) {
            if ($("#sceur").val() !== "") {
                $(".showme").show();
            } else {
                $(".showme").hide();
                $("#profitlocalsgd").val("0");
                $("#profitforeignsgd").val("0");
                $("#profitlocalusd").val("0");
                $("#profitforeignusd").val("0");
                $("#profitlocaleuro").val("0");
                $("#profitforeigneuro").val("0");
            }
            if ($("#localsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            }
            if ($("#foreignsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            }
            if ($("#localusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            }
            if ($("#foreignusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            }
            if ($("#localeur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            }
            if ($("#foreigneur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            }
        } else {
            $(".showme").hide();
            $("#profitlocalsgd").val("0");
            $("#profitforeignsgd").val("0");
            $("#profitlocalusd").val("0");
            $("#profitforeignusd").val("0");
            $("#profitlocaleuro").val("0");
            $("#profitforeigneuro").val("0");
        }
    },
    
    scSGDCheck: function(sgdPrice) {
        var gst = $('#gst').val();
        if (gst === "") {
            gst = 7;
        } else {
            gst = parseInt(gst);
        }
        
        var usdPrice, eurPrice;
        if (sgdPrice === "") {
            $('#scsgd, #scusd, #sceur').val("");
            sgdPrice = usdPrice = eurPrice = 0;
        }
        else {
            var usd_euro_vals = SGD_TO_USD_EURO(sgdPrice, sn.rates);
            usdPrice = usd_euro_vals[0];
            eurPrice = usd_euro_vals[1];
            $('#scusd').val(usd_euro_vals[0]);
            $('#sceur').val(usd_euro_vals[1]);
        }
        
        // Update sc with gst & cop
        if ($("#copsgd").val() === "") {
            $('#costwGstSgd').val(sgdPrice);
        } else {
            var copPrice = parseFloat($('#copsgd').val());
            var shippingCost = parseFloat(sgdPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstSgd').val(costwGstnShip);
        }
        
        if ($("#copusd").val() === "") {
            $('#costwGstUsd').val(usdPrice);
        } else {
            var copPrice = parseFloat($('#copusd').val());
            var shippingCost = parseFloat(usdPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstUsd').val(costwGstnShip);
        }
        
        if ($("#copeur").val() === "") {
            $('#costwGstEur').val(eurPrice);
        } else {
            var copPrice = parseFloat($('#copeur').val());
            var shippingCost = parseFloat(eurPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstEur').val(costwGstnShip);
        }
        
        // Update profit
        if (sgdPrice !== "" && sgdPrice !== 0) {
            if ($("#copsgd").val() !== "") {
                $(".showme").show();
            } else {
                $(".showme").hide();
                $("#profitlocalsgd").val("0");
                $("#profitforeignsgd").val("0");
                $("#profitlocalusd").val("0");
                $("#profitforeignusd").val("0");
                $("#profitlocaleuro").val("0");
                $("#profitforeigneuro").val("0");
            }
            if ($("#localsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            }
            if ($("#foreignsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            }
            if ($("#localusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            }
            if ($("#foreignusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            }
            if ($("#localeur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            }
            if ($("#foreigneur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            }
        } else {
            $(".showme").hide();
            $("#profitlocalsgd").val("0");
            $("#profitforeignsgd").val("0");
            $("#profitlocalusd").val("0");
            $("#profitforeignusd").val("0");
            $("#profitlocaleuro").val("0");
            $("#profitforeigneuro").val("0");
        }
    },
    
    scUSDCheck: function(usdPrice) {
        var gst = $('#gst').val();
        if (gst === "") {
            gst = 7;
        } else {
            gst = parseInt(gst);
        }
        
        var sgdPrice, eurPrice;
        if (usdPrice === "") {
            $('#scsgd, #scusd, #sceur').val("");
            sgdPrice = usdPrice = eurPrice = 0;
        }
        else {
            var sgd_euro_vals = USD_TO_SGD_EURO(usdPrice, sn.rates);
            sgdPrice = sgd_euro_vals[0];
            eurPrice = sgd_euro_vals[1];
            $('#scsgd').val(sgd_euro_vals[0]);
            $('#sceur').val(sgd_euro_vals[1]);
        }
        
        // Update sc with gst & cop
        if ($("#copsgd").val() === "") {
            $('#costwGstSgd').val(sgdPrice);
        } else {
            var copPrice = parseFloat($('#copsgd').val());
            var shippingCost = parseFloat(sgdPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstSgd').val(costwGstnShip);
        }
        
        if ($("#copusd").val() === "") {
            $('#costwGstUsd').val(usdPrice);
        } else {
            var copPrice = parseFloat($('#copusd').val());
            var shippingCost = parseFloat(usdPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstUsd').val(costwGstnShip);
        }
        
        if ($("#copeur").val() === "") {
            $('#costwGstEur').val(eurPrice);
        } else {
            var copPrice = parseFloat($('#copeur').val());
            var shippingCost = parseFloat(eurPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstEur').val(costwGstnShip);
        }
        
        // Update profit
        if (usdPrice !== "" && usdPrice !== 0) {
            if ($("#copsgd").val() !== "") {
                $(".showme").show();
            } else {
                $(".showme").hide();
                $("#profitlocalsgd").val("0");
                $("#profitforeignsgd").val("0");
                $("#profitlocalusd").val("0");
                $("#profitforeignusd").val("0");
                $("#profitlocaleuro").val("0");
                $("#profitforeigneuro").val("0");
            }
            if ($("#localsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            }
            if ($("#foreignsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            }
            if ($("#localusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            }
            if ($("#foreignusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            }
            if ($("#localeur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            }
            if ($("#foreigneur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            }
        } else {
            $(".showme").hide();
            $("#profitlocalsgd").val("0");
            $("#profitforeignsgd").val("0");
            $("#profitlocalusd").val("0");
            $("#profitforeignusd").val("0");
            $("#profitlocaleuro").val("0");
            $("#profitforeigneuro").val("0");
        }
    },
    
    scEURCheck: function(eurPrice) {
        var gst = $('#gst').val();
        if (gst === "") {
            gst = 7;
        } else {
            gst = parseInt(gst);
        }
        
        var sgdPrice, eurPrice;
        if (eurPrice === "") {
            $('#scsgd, #scusd, #sceur').val("");
            sgdPrice = usdPrice = eurPrice = 0;
        }
        else {
            var sgd_usd_vals = EUR_TO_SGD_USD(eurPrice, sn.rates);
            sgdPrice = sgd_usd_vals[0];
            usdPrice = sgd_usd_vals[1];
            $('#scsgd').val(sgd_usd_vals[0]);
            $('#scusd').val(sgd_usd_vals[1]);
        }
        
        // Update sc with gst & cop
        if ($("#copsgd").val() === "") {
            $('#costwGstSgd').val(sgdPrice);
        } else {
            var copPrice = parseFloat($('#copsgd').val());
            var shippingCost = parseFloat(sgdPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstSgd').val(costwGstnShip);
        }
        
        if ($("#copusd").val() === "") {
            $('#costwGstUsd').val(usdPrice);
        } else {
            var copPrice = parseFloat($('#copusd').val());
            var shippingCost = parseFloat(usdPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstUsd').val(costwGstnShip);
        }
        
        if ($("#copeur").val() === "") {
            $('#costwGstEur').val(eurPrice);
        } else {
            var copPrice = parseFloat($('#copeur').val());
            var shippingCost = parseFloat(eurPrice);
            var costwGstnShip = ((copPrice * (1 + gst / 100)) + shippingCost).toFixed(2);
            $('#costwGstEur').val(costwGstnShip);
        }
        
        // Update profit
        if (eurPrice !== "" && eurPrice !== 0) {
            if ($("#copsgd").val() !== "") {
                $(".showme").show();
            } else {
                $(".showme").hide();
                $("#profitlocalsgd").val("0");
                $("#profitforeignsgd").val("0");
                $("#profitlocalusd").val("0");
                $("#profitforeignusd").val("0");
                $("#profitlocaleuro").val("0");
                $("#profitforeigneuro").val("0");
            }
            if ($("#localsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitlocalsgd").text(tempVal.toFixed(2));
            }
            if ($("#foreignsgd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignsgd").val()) - parseFloat($("#costwGstSgd").val());
                $("#profitforeignsgd").text(tempVal.toFixed(2));
            }
            if ($("#localusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitlocalusd").text(tempVal.toFixed(2));
            }
            if ($("#foreignusd").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreignusd").val()) - parseFloat($("#costwGstUsd").val());
                $("#profitforeignusd").text(tempVal.toFixed(2));
            }
            if ($("#localeur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#localeur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitlocaleuro").text(tempVal.toFixed(2));
            }
            if ($("#foreigneur").val() === "") {
                var tempVal = 0.0 - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            } else {
                var tempVal = parseFloat($("#foreigneur").val()) - parseFloat($("#costwGstEur").val());
                $("#profitforeigneuro").text(tempVal.toFixed(2));
            }
        } else {
            $(".showme").hide();
            $("#profitlocalsgd").val("0");
            $("#profitforeignsgd").val("0");
            $("#profitlocalusd").val("0");
            $("#profitforeignusd").val("0");
            $("#profitlocaleuro").val("0");
            $("#profitforeigneuro").val("0");
        }
    },
    
    markupSelection: function(index, markupPercentageValue) {     
//        var costOfProduct = parseFloat($('#copsgd').val());
        var costOfProduct = parseFloat($('#costwGstSgd').val());
        if (markupPercentageValue === "") {
            if (index === 1) {
                $('#tier1markupprice').val(costOfProduct.toFixed(2));
                $('#tier1discount').val('0.00');
            }
            else if (index === 2) {
                $('#tier2markupprice').val(costOfProduct.toFixed(2));
                $('#tier2discount').val('0.00');
            }
            else if (index === 3) {
                $('#tier3markupprice').val(costOfProduct.toFixed(2));
                $('#tier3discount').val('0.00');
            }
            else if (index === 4) {
                $('#tier4markupprice').val(costOfProduct.toFixed(2));
                $('#tier4discount').val('0.00');
            }
            return;
        }
        markupPercentageValue = parseInt(markupPercentageValue);
        var markupPercentage = 1 + (Math.ceil(markupPercentageValue) / 100.0);
        var retailPrice = parseFloat($('#localsgd').val());
        
        // Calculate Markup for Tier [index]
        var markup = costOfProduct * markupPercentage;
        
        // Calculate Discount for Tier [index]
        var discount = (retailPrice - parseFloat(markup)) / retailPrice * 100.0;
        
        if (index === 1) {
            $('#tier1markupprice').val(markup.toFixed(2));
            $('#tier1discount').val(discount.toFixed(2));
            
            $('#markuptier2').empty();
            $('#markuptier2').append("<option value=''>Select Value</option>");
            for (var i = (markupPercentageValue + 1); i <= ((markupPercentageValue + 1) + 100); i++) {
                $('#markuptier2').append("<option value='" + i + "'>" + i + "</option>");
                tier2finalval = i;
            }
        }
        else if (index === 2) {
            $('#tier2markupprice').val(markup.toFixed(2));
            $('#tier2discount').val(discount.toFixed(2));
            
            $('#markuptier3').empty();
            $('#markuptier3').append("<option value=''>Select Value</option>");
            for (var i = (markupPercentageValue + 1); i <= ((markupPercentageValue + 1) + 100); i++) {
                $('#markuptier3').append("<option value='" + i + "'>" + i + "</option>");
                tier3finalval = i;
            }
        }
        else if (index === 3) {
            $('#tier3markupprice').val(markup.toFixed(2));
            $('#tier3discount').val(discount.toFixed(2));
            
            $('#markuptier4').empty();
            $('#markuptier4').append("<option value=''>Select Value</option>");
            for (var i = (markupPercentageValue + 1); i <= ((markupPercentageValue + 1) + 100); i++) {
                $('#markuptier4').append("<option value='" + i + "'>" + i + "</option>");
                tier4finalval = i;
            }
        }
        else if (index === 4) {
            $('#tier4markupprice').val(markup.toFixed(2));
            $('#tier4discount').val(discount.toFixed(2));
        }
    },
    
    markupPriceUpdate: function(index, markupPrice, forDiscount) {
        var self = this;
        if (markupPrice.trim().length === 0 || isNaN(markupPrice)) {
            if (index === 1) {
                $('#markuptier1').empty();
                $('#markuptier1').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier1').append("<option value='" + i + "'>" + i + "</option>");
                    tier1finalval = i;
                }
                $('#tier1markupprice').val("");
                $('#tier1discount').val("");
                
                if ($('#markuptier2').val() === '') {
                    $('#markuptier2').empty();
                    $('#markuptier2').append("<option value=''>Select Value</option>");

                    for (var i = 1; i <= 100; i++) {
                        $('#markuptier2').append("<option value='" + i + "'>" + i + "</option>");
                        tier2finalval = i;
                    }
                }
            }
            else if (index === 2) {
                $('#markuptier2').empty();
                $('#markuptier2').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier2').append("<option value='" + i + "'>" + i + "</option>");
                    tier2finalval = i;
                }
                $('#tier2markupprice').val("");
                $('#tier2discount').val("");
                
                if ($('#markuptier3').val() === '') {
                    $('#markuptier3').empty();
                    $('#markuptier3').append("<option value=''>Select Value</option>");

                    for (var i = 1; i <= 100; i++) {
                        $('#markuptier3').append("<option value='" + i + "'>" + i + "</option>");
                        tier3finalval = i;
                    }
                }
            }
            else if (index === 3) {
                $('#markuptier3').empty();
                $('#markuptier3').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier3').append("<option value='" + i + "'>" + i + "</option>");
                    tier3finalval = i;
                }
                $('#tier3markupprice').val("");
                $('#tier3discount').val("");
                
                if ($('#markuptier4').val() === '') {
                    $('#markuptier4').empty();
                    $('#markuptier4').append("<option value=''>Select Value</option>");

                    for (var i = 1; i <= 100; i++) {
                        $('#markuptier4').append("<option value='" + i + "'>" + i + "</option>");
                        tier4finalval = i;
                    }
                }
            }
            else if (index === 4) {
                $('#markuptier4').empty();
                $('#markuptier4').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier4').append("<option value='" + i + "'>" + i + "</option>");
                    tier4finalval = i;
                }
                $('#tier4markupprice').val("");
                $('#tier4discount').val("");
            }
            return;
        }
        
        markupPrice = parseFloat(markupPrice);
//        var costOfProduct = parseFloat($('#copsgd').val());
        var costOfProduct = parseFloat($('#costwGstSgd').val());
        var retailPrice = parseFloat($('#localsgd').val());
        
        // Calculate markup percentage
        var markupPercentageValue = parseInt(markupPrice / costOfProduct * 100.0 - 100.0);
        var selected = markupPercentageValue;
        
        if (index === 1) {
            var min = markupPercentageValue < 1 ? markupPercentageValue : 1;
            var max = markupPercentageValue > 100 ? markupPercentageValue : 100;
                    
            $('#markuptier1').empty();
            $('#markuptier1').append("<option value=''>Select Value</option>");
            for (var i = min; i <= max; i++) {
                $('#markuptier1').append("<option value='" + i + "'>" + i + "</option>");
                tier1finalval = i;
            }
            $('#markuptier1').val(selected);

            // Calculate Discount for Tier [index]
            if (!forDiscount) {
                var discount = (retailPrice - parseFloat(markupPrice)) / retailPrice * 100.0;
                $('#tier1discount').val(discount.toFixed(2));
            }

            $('#markuptier2').empty();
            $('#markuptier2').append("<option value=''>Select Value</option>");
            for (var i = (markupPercentageValue + 1); i <= ((markupPercentageValue + 1) + 100); i++) {
                $('#markuptier2').append("<option value='" + i + "'>" + i + "</option>");
                tier2finalval = i;
            }
            if ($('#tier2markupprice').val() !== '') {
                self.markupPriceUpdate(2, $('#tier2markupprice').val());
            }
        }
        else if (index === 2) {
            var min = markupPercentageValue;
            var max = markupPercentageValue + 100;
            
            $('#markuptier2').empty();
            $('#markuptier2').append("<option value=''>Select Value</option>");
            for (var i = min; i <= max; i++) {
                $('#markuptier2').append("<option value='" + i + "'>" + i + "</option>");
                tier2finalval = i;
            }
            $('#markuptier2').val(selected);

            // Calculate Discount for Tier [index]
            if (!forDiscount) {
                var discount = (retailPrice - parseFloat(markupPrice)) / retailPrice * 100.0;
                $('#tier2discount').val(discount.toFixed(2));
            }

            $('#markuptier3').empty();
            $('#markuptier3').append("<option value=''>Select Value</option>");
            for (var i = (markupPercentageValue + 1); i <= ((markupPercentageValue + 1) + 100); i++) {
                $('#markuptier3').append("<option value='" + i + "'>" + i + "</option>");
                tier3finalval = i;
            }
            if ($('#tier3markupprice').val() !== '') {
                self.markupPriceUpdate(3, $('#tier3markupprice').val());
            }
        }
        else if (index === 3) {
            var min = markupPercentageValue;
            var max = markupPercentageValue + 100;
            
            $('#markuptier3').empty();
            $('#markuptier3').append("<option value=''>Select Value</option>");
            for (var i = min; i <= max; i++) {
                $('#markuptier3').append("<option value='" + i + "'>" + i + "</option>");
                tier3finalval = i;
            }
            $('#markuptier3').val(selected);

            // Calculate Discount for Tier [index]
            if (!forDiscount) {
                var discount = (retailPrice - parseFloat(markupPrice)) / retailPrice * 100.0;
                $('#tier3discount').val(discount.toFixed(2));
            }

            $('#markuptier4').empty();
            $('#markuptier4').append("<option value=''>Select Value</option>");
            for (var i = (markupPercentageValue + 1); i <= ((markupPercentageValue + 1) + 100); i++) {
                $('#markuptier4').append("<option value='" + i + "'>" + i + "</option>");
                tier4finalval = i;
            }
            if ($('#tier4markupprice').val() !== '') {
                self.markupPriceUpdate(4, $('#tier4markupprice').val());
            }
        }
        else if (index === 4) {
            var min = markupPercentageValue;
            var max = markupPercentageValue + 100;
            
            $('#markuptier4').empty();
            $('#markuptier4').append("<option value=''>Select Value</option>");
            for (var i = min; i <= max; i++) {
                $('#markuptier4').append("<option value='" + i + "'>" + i + "</option>");
                tier4finalval = i;
            }
            $('#markuptier4').val(selected);

            // Calculate Discount for Tier [index]
            if (!forDiscount) {
                var discount = (retailPrice - parseFloat(markupPrice)) / retailPrice * 100.0;
                $('#tier4discount').val(discount.toFixed(2));
            }
        }
    },
    
    discountValueUpdate: function(index, discountValue) {
        var self = this;
        var retailPrice = parseFloat($('#localsgd').val());
        
        if (discountValue.trim().length === 0 || isNaN(discountValue)) {
            if (index === 1) {
                $('#markuptier1').empty();
                $('#markuptier1').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier1').append("<option value='" + i + "'>" + i + "</option>");
                    tier1finalval = i;
                }
                $('#tier1discount').val("");
                $('#tier1markupprice').val("");

                if ($('#markuptier2').val() === '') {
                    $('#markuptier2').empty();
                    $('#markuptier2').append("<option value=''>Select Value</option>");

                    for (var i = 1; i <= 100; i++) {
                        $('#markuptier2').append("<option value='" + i + "'>" + i + "</option>");
                        tier2finalval = i;
                    }
                }
            }
            else if (index === 2) {
                $('#markuptier2').empty();
                $('#markuptier2').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier2').append("<option value='" + i + "'>" + i + "</option>");
                    tier2finalval = i;
                }
                $('#tier2discount').val("");
                $('#tier2markupprice').val("");

                if ($('#markuptier3').val() === '') {
                    $('#markuptier3').empty();
                    $('#markuptier3').append("<option value=''>Select Value</option>");

                    for (var i = 1; i <= 100; i++) {
                        $('#markuptier3').append("<option value='" + i + "'>" + i + "</option>");
                        tier3finalval = i;
                    }
                }
            }
            else if (index === 3) {
                $('#markuptier3').empty();
                $('#markuptier3').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier3').append("<option value='" + i + "'>" + i + "</option>");
                    tier3finalval = i;
                }
                $('#tier3discount').val("");
                $('#tier3markupprice').val("");

                if ($('#markuptier4').val() === '') {
                    $('#markuptier4').empty();
                    $('#markuptier4').append("<option value=''>Select Value</option>");

                    for (var i = 1; i <= 100; i++) {
                        $('#markuptier4').append("<option value='" + i + "'>" + i + "</option>");
                        tier4finalval = i;
                    }
                }
            }
            else if (index === 4) {
                $('#markuptier4').empty();
                $('#markuptier4').append("<option value=''>Select Value</option>");

                for (var i = 1; i <= 100; i++) {
                    $('#markuptier4').append("<option value='" + i + "'>" + i + "</option>");
                    tier4finalval = i;
                }
                $('#tier4discount').val("");
                $('#tier4markupprice').val("");
            }
            return;
        }
        
        // Calculate markup price
        var markupPrice = retailPrice - (discountValue / 100.0 * retailPrice);
        
        if (index === 1) {
            $('#tier1markupprice').val(markupPrice.toFixed(2));        
            self.markupPriceUpdate(1, markupPrice.toFixed(2), true);
        }
        else if (index === 2) {
            $('#tier2markupprice').val(markupPrice.toFixed(2));        
            self.markupPriceUpdate(2, markupPrice.toFixed(2), true);
        }
        else if (index === 3) {
            $('#tier3markupprice').val(markupPrice.toFixed(2));        
            self.markupPriceUpdate(3, markupPrice.toFixed(2), true);
        }
        else if (index === 4) {
            $('#tier4markupprice').val(markupPrice.toFixed(2));        
            self.markupPriceUpdate(4, markupPrice.toFixed(2), true);
        }
    }
};