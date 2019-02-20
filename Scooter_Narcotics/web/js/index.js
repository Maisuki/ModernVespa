var isLeft = true;
$(document).ready(function() {   
    $("#loader").fadeOut(1500, function () {
        $("#myDiv").fadeIn(1000);
    });
    
    $(document).on('opening', '.remodal', function () {
        
    });

    $(document).on('confirmation', '.remodal', function () {
        var qty = $("#productQuantity").val();
        var priceText = $("#productPrice").text();
        var id = $("#productId").val();
        var price = priceText.split(" ")[1];
        addToCartMobile(qty, id, price);
    });

    $(document).on('cancellation', '.remodal', function () {
        var inst = $('[data-remodal-id=modal]').remodal();
        inst.close();
    });


    $('#featuredProduct').loading({
        stoppable: false,
        message: '',
        theme: ''
    });

    if (ccode !== "SGD") {
        $("#hideService").hide();
    }
    
    loadFeatured();
    
    $("#brand").change(function() {
        var brand = $(this).val();
        $("#models").empty();
        $("#models").append("<option value='' style='color:black'>Select Model</option>");
        $.ajax({
            type: 'POST',
            url: 'populateModel',
            data: {
                brand: brand
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                var data = ($.parseJSON(e.responseText));

                if (e.status === 200) {
                    for (var i = 0; i < data.models.length; i++) {
                        var model = translate(data.models[i]);
                        $("#models").append("<option style='color:black'>" + model + "</option>");
                    }
                }
            },
            dataType: 'json'
        });
    });
    
    $("#brand1").change(function() {
        var brand = $(this).val();
        $("#models1").empty();
        $("#models1").append("<option value='' style='color:black'>Select Model</option>");
        
        $.ajax({
            type: 'POST',
            url: 'populateModel',
            data: {
                brand: brand
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                var data = ($.parseJSON(e.responseText));

                if (e.status === 200) {
                    for (var i = 0; i < data.models.length; i++) {
                        var model = translate(data.models[i]);
                        $("#models1").append("<option style='color:black'>" + model + "</option>");
                    }
                }
            },
            dataType: 'json'
        });
    });
});

var pageNo = 1;
var maxPage = 0;

window.onscroll = function () {
    var maxHeight = $("#page-header-top").height() + $("#page-header-bottom").height()
            + $("#banner_filter-section").height() + $("#featured-products-section").height();
    var pageYOffset = window.pageYOffset;
    if (pageYOffset / maxHeight >= 0.6) {
        fetchPage(++pageNo);
    }
};

function fetchPage(page) {
    if (pageNo <= maxPage) {
        loadFeatured();
    } else {
        return;
    }
}

function loadFeatured() {
    $.ajax({
        type: 'POST',
        url: "featuredProducts",
        data: {
            currency: ccode,
            page: pageNo
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200) {
                products = data.products;
                for (var i = 0; i < products.length; i++) {
                    var product = products[i];
                    var pId = product._id;
                    var name = product.name;
                    var category = product.cat;
                    var costOfProduct = product.cop;
                    var gst = product.gst;
                    var foreignprice = product.foreignprice;
                    var localprice = product.localprice;
                    var productBrand = product.productBrand;
                    var shippingCosts = product.shippingCosts;
                    var images = product.img;
                    
                    if (ccode === "SGD" && (typeof localprice === 'undefined' || localprice === null || localprice === 0)) {
                        continue;
                    } 
                    else {
                        /**** DESKTOP VERSION ****/
//                        var rating = (products[i].rating / 5) * 100;
                        var outputDesktop = "<li>";
                        outputDesktop += "<div class='inner'>";
                        outputDesktop += "<a href='shop-details.jsp?productId=" + pId + "' class='pic'>";
                        
                        if (typeof images !== 'undefined' && images !== null && images instanceof Array && images.length > 0) {
                            outputDesktop += "<div class='product-image-fixed-size'>";
                            outputDesktop += "<img src='" + base + "/" + images[0] + "' alt=''>";
                            outputDesktop += "</a>";
                            outputDesktop += "</div>";
                        }
                        else {
                            outputDesktop += "<div class='product-image-fixed-size'>";
                            outputDesktop += "<img src='img/coming_soon.jpg' alt=''>";
                            outputDesktop += "</a>";
                            outputDesktop += "</div>";
                        }

                        var translatedprodname = translate(name);
                        var alt = "";
                        if (translatedprodname.length >= 30) {
                            alt = translatedprodname.substring(0, 31) + "...";
                        }
                        else {
                            alt = translatedprodname;
                        }
                        
                        outputDesktop += "<h3 style='height: 40px;'>";
                        outputDesktop += "<a href='shop-details.jsp?productId=" + pId + "'>";
                        outputDesktop += "<p title='" + translatedprodname + "' class='limited-text'>"+ alt + "</p>";
                        outputDesktop += "</a>";
                        outputDesktop += "</h3>";
                        outputDesktop += "<p style='height:35px'>" + category + "</p>";
                        
                        var price = 0;
                        if (ccode === "SGD") {
                            price = parseFloat(localprice).toFixed(2);
                        }
                        else {
                            price = parseFloat(foreignprice).toFixed(2);
                        }
                        
                        if (role === dealer) {
                            console.log(product)
                            outputDesktop += "<div class='price'>";

                            var initialPrice = price;
                            var brandList = userObject['discounted_brands'];

                            if (brandList === undefined || brandList === null || brandList === "") {
                                for (var key in product) {
                                    if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                        var markupPercentage = parseInt(product[key]);
                                        if (markupPercentage.toString() !== "0" && costOfProduct.toString() !== "0") {
                                            var gstval = 1 + (parseInt(gst)) / 100.0;
                                            var markup = 1 + (markupPercentage / 100.0);
                                            shippingCosts = parseFloat(shippingCosts);
                                            var copsgdval = parseFloat(costOfProduct);
                                            var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;
                                            price = parseFloat(finalmarkuptier1).toFixed(2);
                                        }
                                    }
                                }
                            }
                            else {
                                brandDiscount = userObject['discounted_brands_value'];
                                if (brandList.includes(product['productBrand'])) {
                                    for (var j = 0; j < brandList.length; j++) {
                                        if (product['productBrand'] === brandList[j]) {
                                            price = (initialPrice * ((100 - brandDiscount[j]) / 100)).toFixed(2);
                                            break;
                                        }
                                    }
                                }
                                else {
                                    for (var key in products[i]) {
                                        if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                            var markupPercentage = parseInt(product[key]);
                                            if (markupPercentage.toString() !== "0" && costOfProduct.toString() !== "0") {
                                                var gstval = 1 + (parseInt(gst)) / 100.0;
                                                var markup = 1 + (markupPercentage / 100.0);
                                                shippingCosts = parseFloat(shippingCosts);
                                                var copsgdval = parseFloat(costOfProduct);
                                                var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;
                                                price = parseFloat(finalmarkuptier1).toFixed(2);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            if (initialPrice > price) {
                                outputDesktop += "<span style='font-size:10px'>";
                                outputDesktop += "MRSP: <strike>" + ccode + " " + initialPrice + "</strike>";
                                outputDesktop += "</span>";
                                outputDesktop += "</br>NOW: " + ccode + " " + price;
                                outputDesktop += "</br>";
                                outputDesktop += "<span style='font-size:15px'>Discount: " + (((initialPrice - price) / initialPrice) * 100).toFixed(2) + "%</span>";
                                outputDesktop += "</div>";
                            }
                            else {
                                outputDesktop += "<span style='font-size:10px'>";
                                outputDesktop += "MRSP: <strike>" + ccode + " " + price + "</strike>";
                                outputDesktop += "</span>";
                                outputDesktop += "</br>NOW: " + ccode + " " + price;
                                outputDesktop += "</br>";
                                outputDesktop += "<span style='font-size:15px'>Discount: " + (((price - price) / price) * 100).toFixed(2) + "%</span>";
                                outputDesktop += "</div>";
                            }
                        }
                        else {
                            var gstval = 1 + (parseInt(gst)) / 100.0;
                            var priceWGst = price * gstval;
                            price = parseFloat(priceWGst).toFixed(2);
                            outputDesktop += "<div class='price'>" + ccode + " " + price + "</div>";
                        }
                        outputDesktop += "<div class='actions'>";
                        outputDesktop += "<a class='fa fa-plus' onclick='increaseQty(\"" + pId + "\");' style='float:right; padding-left:8px; padding-top:2px'></a>";
                        outputDesktop += "<input type='text' style='color:black' min='1' value='1' class='qty-style' id='" + pId + "Qty' disabled>";
                        outputDesktop += "<a class='fa fa-minus' onclick='reduceQty(\"" + pId + "\");' style='float:right; padding-right:8px; padding-top:2px'></a>";
                        outputDesktop += "<a id='" + pId + "Btn' onclick='addToCart(\"" + pId + "\", " + price + ")'>";
                        outputDesktop += "<i class='fa fa-shopping-cart'></i>";
                        outputDesktop += "Add to cart";
                        outputDesktop += "</a>";
                        outputDesktop += "</div>";
                        outputDesktop += "</div>";
                        outputDesktop += "</li>";
                        
                        $("#productGridDesktop").append(outputDesktop);
                        /**** DESKTOP VERSION ****/
                        
                        /**** MOBILE VERSION ****/
                        var position = isLeft ? "half-left" : "half-right";
                        var outputMobile = "<li class='" + position + "'>";
                        outputMobile += "<a href='shop-details.jsp?productId=" + pId + "' class='pic'>";
                        if (typeof images !== 'undefined' && images !== null && images instanceof Array && images.length > 0) {
                            var margin = isLeft ? "margin-left: -21px;" : "margin: 0;";
                            outputMobile += "<img style='" + margin + "' src='" + base + "/" + images[0] + "' width='150px' height='150px' alt=''>";
                            outputMobile += "</a>";
                        }
                        else {
//                            outputMobile += "<div class='product-image-fixed-size'>";
                            var margin = isLeft ? "margin-left: -21px;" : "margin: 0;";
                            outputMobile += "<img style='" + margin + "' src='img/coming_soon.jpg' width='150px' height='150px' alt=''>";
                            outputMobile += "</a>";
//                            outputMobile += "</div>";
                        }
                        outputMobile += "</a>"
                        outputMobile += "<h3 style='color:#fff'>";
                        outputMobile += "<a href='shop-details.jsp?productId=" + pId + "'>";
                        var margin = isLeft ? "margin-left: -25px;" : "margin-left: -5px;";
                        outputMobile += "<p style='height: 80px; width: 150px; " + margin + " text-align: center;' title='" + translatedprodname + "' class='limited-text'>"+ alt + "</p>";
                        outputMobile += "</a>";
                        outputMobile += "</h3>";
//                        outputMobile += "<p style='height:30px'>" + category + "</p>";
                        
                        price = 0;
                        if (ccode === "SGD") {
                            price = parseFloat(localprice).toFixed(2);
                        }
                        else {
                            price = parseFloat(foreignprice).toFixed(2);
                        }
                        
                        if (role === dealer) {
                            margin = isLeft ? "margin-left: -25px;" : "";
                            outputMobile += "<div class='price' style='" + margin + " width: 150px; text-align: center;'>";
                            
                            var initialPrice = price;
                            var brandList = userObject['discounted_brands'];

                            if (brandList === undefined || brandList === null || brandList === "") {
                                for (var key in product) {
                                    if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                        var markupPercentage = parseInt(product[key]);
                                        if (markupPercentage === 0) {
                                            var gstval = 1 + (parseInt(gst)) / 100.0;
                                            var priceWGst = price * gstval;
                                            price = parseFloat(priceWGst).toFixed(2);
                                        }
                                        else {
                                            var gstval = 1 + (parseInt(gst)) / 100.0;
                                            var markup = 1 + (markupPercentage / 100.0);
                                            shippingCosts = parseFloat(shippingCosts);
                                            var copsgdval = parseFloat(costOfProduct);
                                            var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;
                                            price = parseFloat(finalmarkuptier1).toFixed(2);
                                        }
                                    }
                                }
                            }
                            else {
                                brandDiscount = userObject['discounted_brands_value'];
                                if (brandList.includes(product['productBrand'])) {
                                    for (var j = 0; j < brandList.length; j++) {
                                        if (product['productBrand'] === brandList[j]) {
                                            price = (initialPrice * ((100 - brandDiscount[j]) / 100)).toFixed(2);
                                            break;
                                        }
                                    }
                                }
                                else {
                                    for (var key in products[i]) {
                                        if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                            var markupPercentage = parseInt(product[key]);
                                            if (markupPercentage === 0) {
                                                var gstval = 1 + (parseInt(gst)) / 100.0;
                                                var priceWGst = price * gstval;
                                                price = parseFloat(priceWGst).toFixed(2);
                                            }
                                            else {
                                                var gstval = 1 + (parseInt(gst)) / 100.0;
                                                var markup = 1 + (markupPercentage / 100.0);
                                                shippingCosts = parseFloat(shippingCosts);
                                                var copsgdval = parseFloat(costOfProduct);
                                                var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;
                                                price = parseFloat(finalmarkuptier1).toFixed(2);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            if (initialPrice > price) {
                                outputMobile += "<span style='font-size:10px'>";
                                outputMobile += "MRSP: <strike>" + ccode + " " + initialPrice + "</strike>";
                                outputMobile += "</span>";
                                outputMobile += "</br>NOW:<br>" + ccode + " " + price;
                                outputMobile += "</br>";
                                outputMobile += "<span style='font-size:15px'>Discount: " + (((initialPrice - price) / initialPrice) * 100).toFixed(2) + "%</span>";
                                outputMobile += "</div>";
                            }
                            else {
                                outputMobile += "<span style='font-size:10px'>";
                                outputMobile += "MRSP: <strike>" + ccode + " " + price + "</strike>";
                                outputMobile += "</span>";
                                outputMobile += "</br>NOW:<br>" + ccode + " " + price;
                                outputMobile += "</br>";
                                outputMobile += "<span style='font-size:15px'>Discount: " + (((price - price) / price) * 100).toFixed(2) + "%</span>";
                                outputMobile += "</div>";
                            }
                            
                        }
                        else {
                            margin = isLeft ? "margin-left: -25px;" : "";
                            var gstval = 1 + (parseInt(gst)) / 100.0;
                            var priceWGst = price * gstval;
                            price = parseFloat(priceWGst).toFixed(2);
                            outputMobile += "<div class='price' style='" + margin + " width: 150px; text-align: center;'>" + ccode + " " + price + "</div>";
                        }
                        
                        margin = isLeft ? "margin-left: -25px;" : "margin-left: -5px; margin-right: -15px;";
                        outputMobile += "<div style='" + margin + "' class='actions'>";
                        outputMobile += "<a id='" + pId + "Btn' onclick='selectQtyMobile(\"" + translatedprodname + "\", \"" + pId + "\", " + price + ")'>";
                        outputMobile += "<i class='fa fa-shopping-cart'></i>";
                        outputMobile += "Add to cart";
                        outputMobile += "</a>";
                        outputMobile += "</div>";
                        outputMobile += "</div>";
                        
                        outputMobile += "</li>";
                        $("#productGridMobile").append(outputMobile);
                        isLeft = !isLeft;
                        /**** MOBILE VERSION ****/
                    }
                }
                maxPage = data.totalPages;
                $('#featuredProduct').loading('stop');
            }
        },
        dataType: 'json'
    });
}

function selectQtyMobile(pname, pid, price) {
    $("#productName").text(pname);
    $("#productPrice").text(ccode + " " + price.toFixed(2));
    $("#productId").val(pid);
    var inst = $('[data-remodal-id=modal]').remodal({closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false});
    inst.open();
}

function addToCartMobile(qty, pid, price) {
    $.ajax({
        type: 'POST',
        url: 'addToCart',
        data: {
            pid: pid,
            qty: qty,
            price: price
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            if (e.status === 200) {
                var data = ($.parseJSON(e.responseText));
                var inst = $('[data-remodal-id=modal]').remodal();
                inst.close();
                if (data.status) {
                    $.toast({
                        heading: 'Success',
                        text: 'Item(s) have successfully added to cart!',
                        showHideTransition: 'slide',
                        icon: 'success'
                    });
                }
                else {
                    $.toast({
                        heading: 'Error',
                        text: 'Please login to add to cart',
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                }
            }
        },
        dataType: 'json',
    });
}

function addToCart(pid, price) {
    var itemqty = $("#" + pid + "Qty").val();
    if (itemqty.length > 0) {
        $.ajax({
            type: 'POST',
            url: 'addToCart',
            data: {
                pid: pid,
                qty: itemqty,
                price: price
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                if (e.status === 200) {
                    var data = ($.parseJSON(e.responseText));
                    if (data.status) {
                        $.toast({
                            heading: 'Success',
                            text: 'Item(s) have successfully added to cart!',
                            showHideTransition: 'slide',
                            icon: 'success'
                        });
                    }
                    else {
                        $.toast({
                            heading: 'Error',
                            text: 'Please login to add to cart',
                            showHideTransition: 'fade',
                            icon: 'error'
                        });
                    }
                }
            },
            dataType: 'json',
        });
    }
    else {
        $.toast({
            heading: 'Error',
            text: 'Please indicate your quantity in the box',
            showHideTransition: 'fade',
            icon: 'error'
        });
    }
}

function reduceQty(itemId) {
    var qty = parseInt($("#" + itemId + "Qty").val());
    var newQty = qty - 1;
    $("#" + itemId + "Qty").val(newQty);
}

function increaseQty(itemId) {
    var qty = parseInt($("#" + itemId + "Qty").val());
    var newQty = qty + 1;
    $("#" + itemId + "Qty").val(newQty);
}