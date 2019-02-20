var myVar;
var rating = "";

function myFunction() {
    myVar = setTimeout(showPage, 1500);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}

$(document).ready(function () {
    $(".fancybox").fancybox({
        beforeShow : function(){
            this.title =  '<a href="contact.jsp">' + $(this.element).data("caption") + '</a>';
        }
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

    $('#productDetail').loading({
        stoppable: false,
        message: 'Retrieving product details...',
        theme: ''
    });

    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }

    $("#categories").change(function () {
        var category = $(this).val();
        var encodedCategory = category.replace(/&/g, "%26");
        encodedCategory = encodedCategory.replace(" ", "%20");
        window.location.href = "products.jsp?cat=" + encodedCategory + "&brand=&model=";
    });

    $(".ratings").change(function () {
        rating = $(this).val();
    });

    $.ajax({
        type: 'POST',
        url: 'retrieveProduct',
        data: {},
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200 && data.status) {
                var product = data.product;
                /**** Display product images ****/
                var images = product.img;

                var productImagesPanel = "<br><br>";
                productImagesPanel += "<ul>";
                productImagesPanel += "<li>";
                if (images !== undefined && images !== null && images.length !== 0) {
                    productImagesPanel += "<a href='" + base + "/" + images[0] + "' data-caption='Contact Us For more Information' rel='fancybox' class='fancybox'>";
                    productImagesPanel += "<img src='" + base + "/" + images[0] + "' width='328' height='120' alt=''>";
                    productImagesPanel += "</a>";
                    if (images.length > 1) {
                        for (var i in images) {
                            productImagesPanel += "<li>";
                            productImagesPanel += "<a href='" + base + "/" + images[i] + "' data-caption='Contact Us For more Information' rel='fancybox' class='fancybox'>";
                            productImagesPanel += "<img src='" + base + "/" + images[i] + "' width='122' height='98' alt=''>";
                            productImagesPanel += "</a>";
                            productImagesPanel += "</li>";
                        }
                    }
                } else {
                    productImagesPanel += "<a href='img/coming_soon.jpg' data-caption='Contact Us For more Information' rel='fancybox' class='fancybox'>";
                    productImagesPanel += "<img src='img/coming_soon.jpg' width='328' height='120' alt=''></a>";
                }
                productImagesPanel += "</li>";
                productImagesPanel += "</ul>";

                $("#productImagesPanel").append(productImagesPanel);
                /**** Display product images ****/


                /**** Display product basic information (Name, Price, Categories and Buttons) ****/
                var productName = product.name;
                var translatedProductName = translate(productName);
                if (images === undefined || images === null && images.length === 0) {
                    translatedProductName += " (Coming Soon)";
                }
                var basicInformationPanel = "<div class='block-head block-head-4'>" + translatedProductName + "</div>";
                basicInformationPanel += "<br><br>";

                var price = 0;
                if (ccode === "SGD") {
                    price = parseFloat(product.localprice).toFixed(2);
                } else {
                    price = parseFloat(product.foreignprice).toFixed(2);
                }

                if (role === dealer) {
                    basicInformationPanel += "<dl>";
                    basicInformationPanel += "<dt style='font-size:15px'>MRSP:</dt>";
                    basicInformationPanel += "<dd style='font-size:15px'>";
                    basicInformationPanel += "<strike>" + ccode + " " + price + "</strike>";
                    basicInformationPanel += "</dd>";
                    basicInformationPanel += "</dl>";

                    var initialPrice = price;
                    var brandList = userObject['discounted_brands'];
                    if (brandList === undefined || brandList === null) {
                        for (var key in product) {
                            if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                var markupPercentage = parseInt(product[key]);
                                var gstval = 1 + (parseInt(product.gst)) / 100.0;
                                var markup = 1 + (markupPercentage / 100.0);
                                var shippingCosts = parseFloat(product.shippingCosts);
                                var copsgdval = parseFloat(product.cop);
                                var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;
                                price = parseFloat(finalmarkuptier1).toFixed(2);
                            }
                        }
                    } else {
                        brandDiscount = userObject['discounted_brands_value'];
                        if (brandList.includes(product['productBrand'])) {
                            for (var j = 0; j < brandList.length; j++) {
                                if (product['productBrand'] === brandList[j]) {
                                    price = (initialPrice * ((100 - brandDiscount[j]) / 100)).toFixed(2);
                                    break;
                                }
                            }
                        } else {
                            for (var key in product) {
                                if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                    var markupPercentage = parseInt(product[key]);
                                    var gstval = 1 + (parseInt(product.gst)) / 100.0;
                                    var markup = 1 + (markupPercentage / 100.0);
                                    var shippingCosts = parseFloat(product.shippingCosts);
                                    var copsgdval = parseFloat(product.cop);
                                    var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;

                                    price = parseFloat(finalmarkuptier1).toFixed(2);
                                }
                            }
                        }
                    }
                    basicInformationPanel += "<dl>";
                    basicInformationPanel += "<dt>Price:</dt>";
                    basicInformationPanel += "<dd><b>" + ccode + " " + price + "</b></dd>";
                    basicInformationPanel += "</dl>";

                    basicInformationPanel += "<dl>";
                    basicInformationPanel += "<dt style='font-size:15px'>Discount:</dt>";
                    basicInformationPanel += "<dd style='font-size:15px'><b>" + (((initialPrice - price) / initialPrice) * 100).toFixed(2) + "%</b></dd>";
                    basicInformationPanel += "</dl>";
                } else {
                    basicInformationPanel += "<dl>";
                    basicInformationPanel += "<dt>Price:</dt>";
                    basicInformationPanel += "<dd><b>" + ccode + " " + price + "</b></dd>";
                    basicInformationPanel += "</dl>";
                }
                basicInformationPanel += "<p></p>";

                basicInformationPanel += "<div class='quantity'>";
                basicInformationPanel += "<input id='qty' onchange='quantityUpdates()' type='text' value='1'>";
                basicInformationPanel += "<a class='plus' onclick='increment()'><span></span></a>";
                basicInformationPanel += "<a class='minus' onclick='decrement()'><span></span></a>";
                basicInformationPanel += "</div>";
                basicInformationPanel += "<a onclick='addToCart(" + price + ")' class='button'>";
                basicInformationPanel += "<i class='fa fa-shopping-cart'></i>Add to Cart";
                basicInformationPanel += "</a>";
                if (userObject !== "" && userObject !== null) {
                    basicInformationPanel += "<div style='margin-left: 80px;' class='mobile-nav-display-full'>";
                    basicInformationPanel += "<br>";
                    basicInformationPanel += "<a onclick='addToNotepad(" + price + ")' class='button'>";
                    basicInformationPanel += "<i class='fa fa-plus'></i>Add to Notepad";
                    basicInformationPanel += "</a>";
                    basicInformationPanel += "</div>";

                    basicInformationPanel += "<div class='mobile-nav-display-none' style='display: inline-block;'>";
                    basicInformationPanel += "<a onclick='addToNotepad(" + price + ")' class='button mobile-nav-display-none'>";
                    basicInformationPanel += "<i class='fa fa-plus'></i>Add to Notepad";
                    basicInformationPanel += "</a>";
                    basicInformationPanel += "</div>";
                }
                basicInformationPanel += "<p>Category: ";
                basicInformationPanel += "<a href='products.jsp?search=" + product.cat + "'>" + product.cat + "</a></p>";
                var productBrandImg = product.productBrandImg === "nil" ? "img/coming_soon.jpg" : base + "/" + product.productBrandImg;
                basicInformationPanel += "<table>";
                basicInformationPanel += "<tr>";
                basicInformationPanel += "<td rowspan='2' style='vertical-align:middle;width:20%;'>";
                basicInformationPanel += "<span>Product Brand: </span>";
                basicInformationPanel += "</td>";
                basicInformationPanel += "<td style='padding:10px;'>";
                basicInformationPanel += "<a href='products.jsp?search=" + product.productBrand + "'>";
                basicInformationPanel += "<img title='" + product.productBrand + "' src='" + productBrandImg + "' width='50' height='50'>";
                basicInformationPanel += "</a>";
                basicInformationPanel += "</td>";
                basicInformationPanel += "</tr>";
                basicInformationPanel += "<tr>";
                basicInformationPanel += "<td>";
                basicInformationPanel += "</td>";
                basicInformationPanel += "</tr>";
                basicInformationPanel += "</table>";
                basicInformationPanel += "</div>";

                $("#productBasicInformationPanel").append(basicInformationPanel);
                /**** Display product basic information (Name, Price, Categories and Buttons) ****/


                /**** Display product description ****/
                var description = product.desc;
                var translatedDescription = translate(description);
                translatedDescription = translatedDescription.replace(/(?:\\[rn])+/g, "");
                translatedDescription = translatedDescription.replace(/%20/g, " ");
                $("#descriptionPanel").append(translatedDescription);
                /**** Display product description ****/


                /**** Display product fitment list ****/
                var fitmentListPanel = "Fitment list is not avaliable";
                var brandNmodel = product.brandNmodel;
                if (brandNmodel !== undefined && brandNmodel !== null) {
                    fitmentListPanel = "";
                    for (var brand in brandNmodel) {
                        var modelList = brandNmodel[brand];
                        for (var key in modelList) {
                            if (key === "brand") {
                                fitmentListPanel += "<u>";
                                fitmentListPanel += "<h4>" + modelList[key] + "</h4>";
                                fitmentListPanel += "</u>";
                                fitmentListPanel += "<ul>";
                            } else {
                                var models = modelList[key];
                                for (var modelIndex in models) {
                                    fitmentListPanel += "<li>" + models[modelIndex] + "</li>";
                                }
                                fitmentListPanel += "</ul>";
                                fitmentListPanel += "<br>";
                            }
                        }
                    }
                }

                $("#fitmentListPanel").append(fitmentListPanel);
                /**** Display product fitment list ****/


                /**** Display product details ****/
                var partNo = product.partNo;
                var weight = product.weight;

                var productDetailsPanel = "<strong> Part no: </strong>    " + partNo + "<br>";
                productDetailsPanel += "<strong>Weight: </strong>    " + weight + " KG";

                $("#productDetailsPanel").append(productDetailsPanel);
                /**** Display product details ****/


                /**** Display product reviews ****/
                retrieveReviews();
                /**** Display product reviews ****/
                
                
                /**** Display related products ****/
                var relatedProducts = data.related;
                for (var idx in relatedProducts) {
                    var product = relatedProducts[idx];
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
                        var outputDesktop = "<li>";
                        outputDesktop += "<div class='inner'>";
                        outputDesktop += "<a href='shop-details.jsp?productId=" + pId + "' class='pic'>";

                        if (typeof images !== 'undefined' && images !== null && images instanceof Array && images.length > 0) {
                            outputDesktop += "<div class='product-image-fixed-size'>";
                            outputDesktop += "<img src='" + base + "/" + images[0] + "' alt=''>";
                            outputDesktop += "</a>";
                            outputDesktop += "</div>";
                        } else {
                            outputDesktop += "<div class='product-image-fixed-size'>";
                            outputDesktop += "<img src='img/coming_soon.jpg' alt=''>";
                            outputDesktop += "</a>";
                            outputDesktop += "</div>";
                        }

                        var translatedprodname = translate(name);
                        var alt = "";
                        if (translatedprodname.length >= 70) {
                            alt = translatedprodname.substring(0, 71) + "...";
                        } else {
                            alt = translatedprodname;
                        }

                        outputDesktop += "<h3>";
                        outputDesktop += "<a href='shop-details.jsp?productId=" + pId + "'>";
                        outputDesktop += "<p title='" + translatedprodname + "' class='limited-text'>" + alt + "</p>";
                        outputDesktop += "</a>";
                        outputDesktop += "</h3>";
                        outputDesktop += "<p style='height:30px'>" + category + "</p>";

                        var price = 0;
                        if (ccode === "SGD") {
                            price = parseFloat(localprice).toFixed(2);
                        } else {
                            price = parseFloat(foreignprice).toFixed(2);
                        }

                        if (role === dealer) {
                            outputDesktop += "<div class='price'>";
                            outputDesktop += "<span style='font-size:10px'>";
                            outputDesktop += "MRSP: <strike>" + ccode + " " + price + "</strike>";
                            outputDesktop += "</span>";

                            var initialPrice = price;
                            var brandList = userObject['discounted_brands'];

                            if (brandList === undefined || brandList === null || brandList === "") {
                                for (var key in product) {
                                    if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                        var markupPercentage = parseInt(product[key]);
                                        var gstval = 1 + (parseInt(gst)) / 100.0;
                                        var markup = 1 + (markupPercentage / 100.0);
                                        shippingCosts = parseFloat(shippingCosts);
                                        var copsgdval = parseFloat(costOfProduct);
                                        var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;

                                        price = parseFloat(finalmarkuptier1).toFixed(2);
                                    }
                                }
                            }
                            else {
                                brandDiscount = userObject['discounted_brands_value'];
                                if (brandList.includes(productBrand)) {
                                    for (var j = 0; j < brandList.length; j++) {
                                        if (productBrand === brandList[j]) {
                                            price = (initialPrice * ((100 - brandDiscount[j]) / 100)).toFixed(2);
                                            break;
                                        }
                                    }
                                } else {
                                    for (var key in product) {
                                        if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                            var markupPercentage = parseInt(product[key]);
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
                            outputDesktop += "</br>NOW: " + ccode + " " + price;
                            outputDesktop += "</br>";
                            outputDesktop += "<span style='font-size:15px'>Discount: " + (((initialPrice - price) / initialPrice) * 100).toFixed(2) + "%</span>";
                            outputDesktop += "</div>";
                        } else {
                            outputDesktop += "<div class='price'>" + ccode + " " + price + "</div>";
                        }
                        outputDesktop += "<div class='actions'>";
                        outputDesktop += "<input type='number' style='color:black' min='1' value='1' class='qty-style' id='" + pId + "Qty'>";
                        outputDesktop += "<a id='" + pId + "Btn' onclick='addToCartRelated(\"" + pId + "\", " + price + ")'>";
                        outputDesktop += "<i class='fa fa-shopping-cart'></i>";
                        outputDesktop += "Add to cart";
                        outputDesktop += "</a>";
                        outputDesktop += "</div>";
                        outputDesktop += "</div>";
                        outputDesktop += "</li>";
                        /**** DESKTOP VERSION ****/
                        
                        /**** MOBILE VERSION ****/
                        var outputMobile = "<li>";
                        outputMobile += "<div class='inner'>";
                        outputMobile += "<a href='shop-details.jsp?productId=" + pId + "' class='pic'>";

                        if (typeof images !== 'undefined' && images !== null && images instanceof Array && images.length > 0) {
                            outputMobile += "<div class='product-image-fixed-size'>";
                            outputMobile += "<img src='" + base + "/" + images[0] + "' alt=''>";
                            outputMobile += "</a>";
                            outputMobile += "</div>";
                        } else {
                            outputMobile += "<div class='product-image-fixed-size'>";
                            outputMobile += "<img src='img/coming_soon.jpg' alt=''>";
                            outputMobile += "</a>";
                            outputMobile += "</div>";
                        }

                        var translatedprodname = translate(name);
                        var alt = "";
                        if (translatedprodname.length >= 70) {
                            alt = translatedprodname.substring(0, 71) + "...";
                        } else {
                            alt = translatedprodname;
                        }

                        outputMobile += "<h3>";
                        outputMobile += "<a href='shop-details.jsp?productId=" + pId + "'>";
                        outputMobile += "<p style='height: 75px;' title='" + translatedprodname + "' class='limited-text'>" + alt + "</p>";
                        outputMobile += "</a>";
                        outputMobile += "</h3>";
                        outputMobile += "<p style='height:30px'>" + category + "</p>";

                        var price = 0;
                        if (ccode === "SGD") {
                            price = parseFloat(localprice).toFixed(2);
                        } else {
                            price = parseFloat(foreignprice).toFixed(2);
                        }

                        if (role === dealer) {
                            outputMobile += "<div class='price'>";
                            outputMobile += "<span style='font-size:10px'>";
                            outputMobile += "MRSP: <strike>" + ccode + " " + price + "</strike>";
                            outputMobile += "</span>";

                            var initialPrice = price;
                            var brandList = userObject['discounted_brands'];

                            if (brandList === undefined || brandList === null || brandList === "") {
                                for (var key in product) {
                                    if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                        var markupPercentage = parseInt(product[key]);
                                        var gstval = 1 + (parseInt(gst)) / 100.0;
                                        var markup = 1 + (markupPercentage / 100.0);
                                        shippingCosts = parseFloat(shippingCosts);
                                        var copsgdval = parseFloat(costOfProduct);
                                        var finalmarkuptier1 = (copsgdval * gstval + shippingCosts) * markup * gstval;

                                        price = parseFloat(finalmarkuptier1).toFixed(2);
                                    }
                                }
                            }
                            else {
                                brandDiscount = userObject['discounted_brands_value'];
                                if (brandList.includes(productBrand)) {
                                    for (var j = 0; j < brandList.length; j++) {
                                        if (productBrand === brandList[j]) {
                                            price = (initialPrice * ((100 - brandDiscount[j]) / 100)).toFixed(2);
                                            break;
                                        }
                                    }
                                } else {
                                    for (var key in product) {
                                        if (key.indexOf("markup") !== -1 && key.indexOf("tier") !== -1 && key.indexOf(tier) !== -1) {
                                            var markupPercentage = parseInt(product[key]);
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
                            outputMobile += "</br>NOW: " + ccode + " " + price;
                            outputMobile += "</br>";
                            outputMobile += "<span style='font-size:15px'>Discount: " + (((initialPrice - price) / initialPrice) * 100).toFixed(2) + "%</span>";
                            outputMobile += "</div>";
                        } else {
                            outputMobile += "<div class='price'>" + ccode + " " + price + "</div>";
                        }
                        outputMobile += "<div class='actions'>";
                        outputMobile += "<a id='" + pId + "Btn' onclick='selectQtyMobile(\"" + translatedprodname + "\", \"" + pId + "\", " + price + ")'>";
                        outputMobile += "<i class='fa fa-shopping-cart'></i>";
                        outputMobile += "Add to cart";
                        outputMobile += "</a>";
                        outputMobile += "</div>";
                        outputMobile += "</div>";
                        outputMobile += "</li>";
                        /**** MOBILE VERSION ****/
                    }
                    $("#productGridDesktop").append(outputDesktop);
                    $("#productGridMobile").append(outputMobile);
                }
                /**** Display related products ****/

                $('#productDetail').loading('stop');
            }
        },
        dataType: 'json'
    });
});

function retrieveReviews() {
    var reviewsPanel = "";
    if (userObject === "") {
        var href = window.location.href;
        var lastSlashIndex = href.lastIndexOf("/") + 1;
        var redirectUrl = href.substring(lastSlashIndex);
        reviewsPanel += "<div style='display: block; float: left;'>"
        reviewsPanel += "   Please <a href='login.jsp?page=" + redirectUrl + "'>login</a> to write a review now!";
        reviewsPanel += "</div>";
        reviewsPanel += "<br>";
    } else {
        reviewsPanel += "<div style='display: block; float: left;'>"
        reviewsPanel += "   Submit a review now!";
        reviewsPanel += "</div>";
        reviewsPanel += "<br>";
    }
    $.ajax({
        type: 'POST',
        url: "retrieveReviews",
        data: {},
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200 && data.status) {
                var reviews = data.reviews;
                if (reviews.length > 0) {
                    for (var i = (reviews.length - 1); i >= 0; i--) {
                        var review = reviews[i];
                        reviewsPanel += "<div style='display: block;'>"
                        
                        reviewsPanel += "<div style='margin-top: 10px; display: inline-block; float: left;'>";
                        reviewsPanel += "<u><b>" + review.reviewer + "</b></u>:";
                        reviewsPanel += "</div>";
                        
                        var rating = review.rating / 5 * 100;
                        reviewsPanel += "<div style='margin-top: 10px; display: inline-block; float: right;' class='rating'>";
                        reviewsPanel += "<div style='width:" + rating + "%'></div>";
                        reviewsPanel += "</div>";
                        reviewsPanel += "<b style='float: right; margin-top: 7px;'>Ratings:&emsp;&emsp;</b>";
                        
                        reviewsPanel += "<br><br>";
                        reviewsPanel += "<div align='center' style='margin-top: 10px;'>";
                        reviewsPanel += "<h3 style='margin-right: 10px; display: inline-block; font-size: xx-large;'>&ldquo;</h3>";
                        reviewsPanel += "<span style='display: inline-block; font-style: italic;'>" + review.review + "</span>";
                        reviewsPanel += "<h3 style='margin-left: 10px; display: inline-block; font-size: xx-large;'>&rdquo;</h3>";
                        reviewsPanel += "</div>";
                        
                        reviewsPanel += "</div>";
                        reviewsPanel += "<hr><br>";
                    }
                }
                else {
                    var noItemPanel = "<div style='display: block; float: left;'>";
                    noItemPanel += "   No review currently.";
                    noItemPanel += "</div>";
                    noItemPanel += "<br>";
                    reviewsPanel = noItemPanel + reviewsPanel;
                }
            }
            $("#reviewsPanel").append(reviewsPanel);
        },
        dataType: 'json'
    });
}

function submitReview() {
    productComment = $("#userComments").val();

    if (productComment === undefined || productComment.trim().length === 0 ||
            rating === "") {
        $.toast({
            heading: 'Error',
            text: 'Please enter a review and select a ratings before submitting!',
            showHideTransition: 'fade',
            icon: 'error'
        });
        return;
    }

    $.ajax({
        type: 'POST',
        url: "writeReview",
        data: {
            productReview: productComment,
            productRating: rating
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var response = e.responseText;
            if (response === "Unauthorized access!") {
                $.toast({
                    heading: 'Error',
                    text: 'Please login to submit a review',
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            } else if (e.status === 200) {
                var data = ($.parseJSON(e.responseText));
                if (data.status) {
                    var reviewsPanel = "<div style='display: block;'>"

                    reviewsPanel += "<div style='margin-top: 10px; display: inline-block; float: left;'>";
                    reviewsPanel += "<u><b>" + userObject['fname'] + "</b></u>:";
                    reviewsPanel += "</div>";

                    var productRating = parseInt(rating) / 5 * 100;
                    reviewsPanel += "<div style='margin-top: 10px; display: inline-block; float: right;' class='rating'>";
                    reviewsPanel += "<div style='width:" + productRating + "%'></div>";
                    reviewsPanel += "</div>";
                    reviewsPanel += "<b style='float: right; margin-top: 7px;'>Ratings:&emsp;&emsp;</b>";

                    reviewsPanel += "<br><br>";
                    reviewsPanel += "<div align='center' style='margin-top: 10px;'>";
                    reviewsPanel += "<h3 style='margin-right: 10px; display: inline-block; font-size: xx-large;'>&ldquo;</h3>";
                    reviewsPanel += "<span style='display: inline-block; font-style: italic;'>" + productComment + "</span>";
                    reviewsPanel += "<h3 style='margin-left: 10px; display: inline-block; font-size: xx-large;'>&rdquo;</h3>";
                    reviewsPanel += "</div>";

                    reviewsPanel += "</div>";
                    reviewsPanel += "<hr><br>";

                    if ($("#reviewsPanel").text().indexOf("No review currently") != -1) {
                        $("#reviewsPanel").empty();
                    }

                    $("#reviewsPanel").prepend(reviewsPanel);

                    rating = "";
                    $("#userComments").val("");
                    $(".ratings").prop('checked', false);

                    $.toast({
                        heading: 'Success',
                        text: "Reviews successfully submitted!",
                        showHideTransition: 'fade',
                        icon: 'success'
                    });
                } else {
                    $.toast({
                        heading: 'Error',
                        text: data.message,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                }
            }
        },
        dataType: 'json'
    });
}

function increment() {
    var qty = $("#qty").val();
    qty = parseInt(qty) + 1;
    $("#qty").val(qty);
}

function decrement() {
    var qty = $("#qty").val();
    if (parseInt(qty) > 1) {
        qty = parseInt(qty) - 1;
    }
    $("#qty").val(qty);
}

function quantityUpdates() {
    var qty = $("#qty").val();
    if (isNaN(qty)) {
        $.toast({
            heading: 'Error',
            text: "Invalid quantity detected! Reverting quantity back to 1...",
            showHideTransition: 'fade',
            icon: 'error'
        });
        $("#qty").val(1);
    } else if (qty.indexOf(".") > -1) {
        qty = Math.floor(parseFloat(qty));
        $("#qty").val(qty);
    }
}

function addToCartRelated(pid, price) {
    var qty = $("#" + pid + "Qty").val();
    if (qty.length > 0 && !isNaN(qty)) {
        $.ajax({
            type: 'POST',
            url: 'addToCart',
            dataType: 'json',
            data: {
                pid: pid,
                qty: qty,
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
                    } else {
                        $.toast({
                            heading: 'Error',
                            text: 'Please login to add to cart',
                            showHideTransition: 'fade',
                            icon: 'error'
                        });
                    }
                }
            }
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

function addToCart(price) {
    var qty = $("#qty").val();

    if (qty.length > 0) {
        $.ajax({
            type: 'POST',
            url: 'addToCart',
            data: {
                qty: qty,
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
                    } else {
                        if (data.message === "You must login to add items to cart!") {
                            $.toast({
                                heading: 'Error',
                                text: 'Please login to add to cart',
                                showHideTransition: 'fade',
                                icon: 'error'
                            });
                            var href = window.location.href;
                            var lastSlashIndex = href.lastIndexOf("/") + 1;
                            var redirectUrl = href.substring(lastSlashIndex);
                            window.location.href = "login.jsp?page=" + redirectUrl;
                        }
                        else {
                            $.toast({
                                heading: 'Error',
                                text: data.message,
                                showHideTransition: 'fade',
                                icon: 'error'
                            });
                        }
                    }
                }
            },
            dataType: 'json'
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

function addToNotepad(price) {
    var qty = $("#qty").val();
    if (qty.length > 0) {
        $.ajax({
            type: 'POST',
            url: 'addToNotepad',
            data: {
                qty: qty,
                price: price
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                if (e.status === 200) {
                    var data = ($.parseJSON(e.responseText));
                    if (data.status) {
                        $.toast({
                            heading: 'Success',
                            text: 'Item(s) have successfully added to notepad!',
                            showHideTransition: 'slide',
                            icon: 'success'
                        });
                    } else {
                        if (data.message === "You must login to add items to notepad!") {
                            $.toast({
                                heading: 'Error',
                                text: 'Please login to add to notepad',
                                showHideTransition: 'fade',
                                icon: 'error'
                            });
                            var href = window.location.href;
                            var lastSlashIndex = href.lastIndexOf("/") + 1;
                            var redirectUrl = href.substring(lastSlashIndex);
                            window.location.href = "login.jsp?page=" + redirectUrl;
                        }
                        else {
                            $.toast({
                                heading: 'Error',
                                text: data.message,
                                showHideTransition: 'fade',
                                icon: 'error'
                            });
                        }
                    }
                }
            },
            dataType: 'json'
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