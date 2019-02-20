var myVar;

function myFunction() {
    myVar = setTimeout(showPage, 1500);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}

var cartId = "";

$(document).ready(function () {
    $("#emptyCartDetails").hide();
    $("#noStock").hide();

    $('#cart').loading({
        stoppable: false,
        message: 'Retrieving your shopping cart...',
        theme: 'light'
    });

    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }

    $.ajax({
        type: 'POST',
        url: 'retrieveCart',
        data: {},
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200 && data.status) {
                var cart = data.cart;
                var productbrands = data.pbs;
                var shopcart = cart.cart_items;
                
                if (shopcart.length === 0) {
                    $("#additional1").hide();
                    $("#emptyCartDetails").show();
                    $('#cart').loading('stop');
                    return;
                }

                $("#emptyCartDetails").hide();
                $("#additional1").show();

                cartId = data.cart._id;

                var product_tracker = [];
                var subTotal = 0.0, weight = 0.0;
                
                for (var i = 0; i < shopcart.length; i++) {
                    var shopcartitem = shopcart[i];
                    var itemId = shopcartitem.item;
                    var itemName = shopcartitem.name;
                    var itemPrice = parseFloat(shopcartitem.price).toFixed(2);
                    var itemQty = shopcartitem.qty;
                    var itemWeight = shopcartitem.weight;
                    var itemImages = shopcartitem.img;
                    
                    var totalPrice = (itemPrice * itemQty).toFixed(2);
                    subTotal += parseFloat(totalPrice);
                    weight += (itemWeight * itemQty);
                    
                    var image = "";
                    if (itemImages !== undefined && itemImages.length >= 1) {
                        image = itemImages[0];
                    }
                    
                    var tempName = itemName.replace(/\"/g, "&#34;");
                    tempName = tempName.replace(/,/g, "&#44;");
                    
                    var objStorage = {};
                    objStorage["itemId"] = itemId;
                    objStorage["itemName"] = tempName;
                    objStorage["itemPrice"] = itemPrice;
                    objStorage["itemWeight"] = itemWeight;
                    objStorage["itemImg"] = image;
                    
                    product_tracker.push({id: itemId, index: i, storage: objStorage});

                    $.get('additionalInfo?itemId=' + itemId, function (data) {
                        data = ($.parseJSON(data));
                        if (data.status) {
                            var id = data.id;
                            var desc = data.desc;
                            var pBrand = data.productBrand;
                            var pNo = data.partNo;

                            var translatedDescription = translate(desc);

                            for (var index = 0; index < product_tracker.length; index++) {
                                if (product_tracker[index].id === id) {
                                    if (pBrand === "") {
                                        pBrand = "-";
                                    }
                                    var shortenedTranslatedDescription = translatedDescription.length === 0 ? "-" : translatedDescription.length >= 150 ? translatedDescription.substring(0, 150) + "..." : translatedDescription;
//                                    var shortenedTranslatedDescription = translatedDescription.substring(0, 150) + "...";
                                    
                                    $("." + product_tracker[index].index + "desc").html(shortenedTranslatedDescription);
                                    $("." + product_tracker[index].index + "pbrand").text(pBrand);
                                    $("." + product_tracker[index].index + "partno").text(pNo);
                                    
                                    var tempDesc = translatedDescription.replace(/\"/g, "&#34;");
                                    tempDesc = tempDesc.replace(/,/g, "&#44;");
                                    
                                    var objStorage = product_tracker[index].storage;
                                    objStorage["itemPartNo"] = pNo;
                                    objStorage["itemDescFull"] = tempDesc;
                                    
                                    localStorage.setItem(id, JSON.stringify(objStorage));
                                    
                                    product_tracker.splice(index, 1);
                                    break;
                                }
                            }
                        } else {
                            if (data.message === "You must login to use this service!") {
                                location.replace("login.jsp?page=shop-cart.jsp&message=Session%20Expired%21%20Please%20relogin%21");
                            } else {
                                $.toast({
                                    heading: 'Error',
                                    text: data.message,
                                    showHideTransition: 'fade',
                                    icon: 'error'
                                });
                            }
                        }
                    });
                    
                    var imagePath = image === "" ? "img/coming_soon.jpg" : base + "/" + image;
                    
                    // Mobile View
                    var mobileView = "<table class='sMobileDisplayOption product" + i + "' style='margin-bottom: 20px'>";
                    
                    mobileView += " <tr>";
                    mobileView += "     <th colspan='2'>Item</th>";
                    mobileView += "     <th>Price</th>";
                    mobileView += "     <th>Quantity</th>";
                    mobileView += "     <th>Total</th>";
                    mobileView += " </tr>";
                    
                    mobileView += " <tr>";
                    mobileView += "     <td colspan='2'>";
                    mobileView += "         <a href='shop-details.jsp?productId=" + itemId + "' class='pic' style='display: block; margin-left: -15px;'>";
                    mobileView += "             <img src='" + imagePath + "' width='50' height='50' alt=''>";
                    mobileView += "         </a>";
                    mobileView += "         <h3 style='width: 100px;'>";
                    mobileView += "             <a href='shop-details.jsp?productId=" + itemId + "'>" + itemName + "</a>";
                    mobileView += "         </h3>";
                    mobileView += "         <br>";
                    mobileView += "         <b>";
                    mobileView += "             <a style='text-decoration: underline;' onclick='viewProductDetails(\"" + itemId + "\")'>View Product<br>Details</a>";
                    mobileView += "         </b>";
                    mobileView += "     </td>";
                    
                    mobileView += "     <td class='price' style='width: 80px;'>";
                    mobileView += "         " + ccode + " " + itemPrice;
                    mobileView += "     </td>";
                    
                    mobileView += "     <td>";
                    mobileView += "         <div class='quantity'>";
                    mobileView += "             <a class='fa fa-minus' onclick='reduceQty(" + i + ", \"" + itemId + "\", " + itemPrice + ");'></a>";
                    mobileView += "             <input type='text' disabled class='qty" + i + "' value='" + itemQty + "'>";
                    mobileView += "             <a class='fa fa-plus' onclick='increaseQty(" + i + ", \"" + itemId + "\", " + itemPrice + ");'></a>";
                    mobileView += "         </div>";
                    mobileView += "     </td>";

                    mobileView += "     <td class='price price" + i + "' style='width: 76.67px'>"
                    mobileView += "         " + ccode + " " + totalPrice;
                    totalPrice += "     </td>";
                    mobileView += " </tr>";
                    
                    mobileView += " <tr>";
                    mobileView += "     <td colspan='2'></td>";
                    mobileView += "     <td></td>";
                    mobileView += "     <td></td>";
                    mobileView += "     <td></td>";
                    mobileView += " </tr>";
                    
                    mobileView += "</table>";
                    
                    // Tablet View
                    var tabletView = "<table class='sTabletDisplayOption product" + i + "' style='margin-bottom: 20px'>";
                    
                    tabletView += " <tr>";
                    tabletView += "     <th colspan='2' style='width: 30%;'>Item</th>";
                    tabletView += "     <th style='width: 10%;'>Price</th>";
                    tabletView += "     <th style='width: 10%;'>Quantity</th>";
                    tabletView += "     <th style='width: 10%;'>Total</th>";
                    tabletView += " </tr>";
                    
                    tabletView += " <tr>";
                    tabletView += "     <td colspan='2' style='width: 30%;'>";
                    tabletView += "         <a href='shop-details.jsp?productId=" + itemId + "' class='pic' style='display: block; margin-left: -15px;'>";
                    tabletView += "             <img src='" + imagePath + "' width='150' height='150' alt=''>";
                    tabletView += "         </a>"
                    tabletView += "         <h3>";
                    tabletView += "             <a href='shop-details.jsp?productId=" + itemId + "'>" + itemName + "</a>";
                    tabletView += "         </h3>";
                    tabletView += "         <br>";
                    tabletView += "         <b>";
                    tabletView += "             <a style='text-decoration: underline;' onclick='viewProductDetails(\"" + itemId + "\")'>View Product Details</a>";
                    tabletView += "         </b>";
                    tabletView += "     </td>";
                    tabletView += "     <td class='price' style='width: 10%;'>";
                    tabletView += "         " + ccode + " " + itemPrice;
                    tabletView += "     </td>";
                    tabletView += "     <td style='width: 10%;'>";
                    tabletView += "         <div class='quantity'>";
                    tabletView += "             <a class='fa fa-minus' onclick='reduceQty(" + i + ", \"" + itemId + "\", " + itemPrice + ");'></a>";
                    tabletView += "             <input type='text' disabled class='qty" + i + "' value='" + itemQty + "'>";
                    tabletView += "             <a class='fa fa-plus' onclick='increaseQty(" + i + ", \"" + itemId + "\", " + itemPrice + ");'></a>";
                    tabletView += "         </div>";
                    tabletView += "     </td>";

                    tabletView += "     <td class='price price" + i + " style='width: 10%;'>";
                    tabletView += "         " + ccode + " " + totalPrice;
                    tabletView += "     </td>";
                    tabletView += " </tr>";
                    
                    tabletView += " <tr>";
                    tabletView += "     <td colspan='2'></td>";
                    tabletView += "     <td></td>";
                    tabletView += "     <td></td>";
                    tabletView += "     <td></td>";
                    tabletView += " </tr>";
                    
                    tabletView += "</table>";
                    
                    // Desktop View
                    var desktopView = "<table class='sDesktopDisplayOption product" + i + "' style='margin-bottom: 20px'>";
                    
                    desktopView += "    <tr>";
                    desktopView += "        <th colspan='2'>Item</th>";
                    desktopView += "        <th>Brand</th>";
                    desktopView += "        <th>Description</th>";
                    desktopView += "        <th>Price</th>";
                    desktopView += "        <th>Quantity</th>";
                    desktopView += "        <th>Total</th>";
                    desktopView += "        <th></th>";
                    desktopView += "    </tr>";
                    
                    desktopView += "    <tr>";
                    desktopView += "        <td>";
                    desktopView += "            <a href='shop-details.jsp?productId=" + itemId + "' class='pic'>";
                    desktopView += "                <img src='" + imagePath + "' width='100' height='100' alt=''>";
                    desktopView += "            </a>";
                    desktopView += "        </td>";
                    desktopView += "        <td>";
                    desktopView += "            <h3>";
                    desktopView += "                <a href='shop-details.jsp?productId=" + itemId + "'>" + itemName + "</a>";
                    desktopView += "            </h3>";
                    desktopView += "            <br>";
                    desktopView += "            <span class='" + i + "partno'></span>";
                    desktopView += "        </td>";
                    desktopView += "        <td  class='" + i + "pbrand' style='text-align: center;'></td>";
                    desktopView += "        <td class='" + i + "desc' style='width: 300px;'></td>";
                    desktopView += "        <td class='price'>";
                    desktopView += "            " + ccode + " " + itemPrice;
                    desktopView += "        </td>";
                    desktopView += "        <td>";
                    desktopView += "            <div class='quantity'>";
                    desktopView += "                <a class='fa fa-minus' onclick='reduceQty(" + i + ", \"" + itemId + "\", " + itemPrice + ");'></a>";
                    desktopView += "                <input type='text' disabled class='qty" + i + "' value='" + itemQty + "'>";
                    desktopView += "                <a class='fa fa-plus' onclick='increaseQty(" + i + ", \"" + itemId + "\", " + itemPrice + ");'></a>";
                    desktopView += "            </div>";
                    desktopView += "        </td>";
                    desktopView += "        <td class='price price" + i + "'>";
                    desktopView += "            " + ccode + " " + totalPrice;
                    desktopView += "        </td>";
                    desktopView += "        <td>";
                    desktopView += "            <a class='fa fa-times remove' onclick='removeItem(" + i + ", \"" + itemId + "\", " + itemPrice + ");'></a>";
                    desktopView += "        </td>";
                    desktopView += "    </tr>";
                    
                    desktopView += "    <tr>";
                    desktopView += "        <td colspan='2'></td>";
                    desktopView += "        <td></td>";
                    desktopView += "        <td></td>";
                    desktopView += "        <td></td>";
                    desktopView += "        <td></td>";
                    desktopView += "        <td></td>";
                    desktopView += "        <td></td>";
                    desktopView += "    </tr>";
                    
                    desktopView += "</table>";
                    
                    $("#cart").append(mobileView);
                    $("#cart").append(tabletView);
                    $("#cart").append(desktopView);
                }
                var subtotalView = "<table>";
                subtotalView += "<tr>";
                subtotalView += "<td style='padding: 15px;'></td>";
                subtotalView += "<td style='padding: 15px;'><h3>Subtotal</h3></td>";
                subtotalView += "<td style='padding: 15px;'></td>";
                subtotalView += "<td style='padding: 15px;'></td>";
                subtotalView += "<td style='padding: 15px;'></td>";
                subtotalView += "<td class='mobile-nav-display-none-3' style='padding: 15px;'></td>";
                subtotalView += "<td class='mobile-nav-display-none-3' style='padding: 15px;'></td>";
                subtotalView += "<td class='mobile-nav-display-none-2 mobile-nav-display-none-3' style='padding: 15px;'></td>";
                subtotalView += "<td class='mobile-nav-display-none-2 mobile-nav-display-none-3' style='padding: 15px;'></td>";
                subtotalView += "<td class='price' id='subtotal'>" + ccode + " " + subTotal.toFixed(2) + "</td>";
                subtotalView += "<td style='padding: 15px;'></td>";
                subtotalView += "</tr>";
                subtotalView += "</table>";
                $("#cart").append(subtotalView);
                
                resizeAction();
                
                verifyItems();
            }
            else {
                if (data.message === "You must login to view your cart!") {
                    location.replace("login.jsp?page=shop-cart.jsp&message=Session%20Expired%21%20Please%20relogin%21");
                }
                else {
                    $("#additional1").hide();
                    $("#emptyCartDetails").show();
                }
            }
            $('#cart').loading('stop');
        },
        dataType: 'JSON'
    });
    
    $(document).on('opening', '.remodal', function () {
        
    });

    $(document).on('confirmation', '.remodal', function () {
        var inst = $('[data-remodal-id=modal]').remodal();
        inst.close();
    });

    $(document).on('cancellation', '.remodal', function () {
        var inst = $('[data-remodal-id=modal]').remodal();
        inst.close();
    });
});
function verifyItems() {
    errorMsg = $("#errorMsg");
    $.ajax({
        type: 'POST',
        url: 'verifyAvailability',
        data: {},
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200) {
                if (!data.status) {
                    var info = "";
                    for (var i = 0; i < data.messages.length; i++) {
                        message = data.messages[i];
                        info += "- " + message.item.name + " only has " + message.availableQty + " available <br>";
                    }
                    document.getElementById("errorMsg").innerHTML = info;
                    $("#noStock").show();
                } else {
                    $("#noStock").hide();
                }
            }
        },
        dataType: 'JSON'
    });
}

function reduceQty(index, itemId, price) {
    var qty = $(".qty" + index).val();

    if (parseInt(qty) > 0) {
        $.ajax({
            type: 'POST',
            url: 'cartQtyUpdate',
            data: {
                itemId: itemId,
                qty: 1,
                action: '-',
                price: price
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                var data = ($.parseJSON(e.responseText));
                if (e.status === 200 && data.status) {
                    verifyItems();
                    if (parseInt(qty) === 1) {
                        $(".product" + index).remove();
                    } else {
                        qty = parseInt(qty) - 1;
                        $(".qty" + index).val(qty);
                        var updatedPrice = qty * price;
                        $(".price" + index).text(ccode + " " + updatedPrice.toFixed(2));
                    }
                    var subtotalText = $("#subtotal").text();
                    var subtotal = parseFloat(subtotalText.split(" ")[1]);
                    subtotal -= price;
                    $("#subtotal").text(ccode + " " + subtotal.toFixed(2));
                    if (subtotal === 0.0) {
                        $("#additional").hide();
                        $("#emptyCartDetails").show();
                        $("#cart").empty();
                    }
                } else {
                    if (data.message === "You must login to update items in your cart!") {
                        location.replace("login.jsp?page=shop-cart.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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
            dataType: 'JSON'
        });
    }
}

function increaseQty(index, itemId, price) {
    var qty = $(".qty" + index).val();

    $.ajax({
        type: 'POST',
        url: 'cartQtyUpdate',
        data: {
            itemId: itemId,
            qty: 1,
            action: '+',
            price: price
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200 && data.status) {
                verifyItems();

                qty = parseInt(qty) + 1;
                $(".qty" + index).val(qty);
                var updatedPrice = qty * price;
                $(".price" + index).text(ccode + " " + updatedPrice.toFixed(2));

                var subtotalText = $("#subtotal").text();
                var subtotal = parseFloat(subtotalText.split(" ")[1]);
                subtotal += price;
                $("#subtotal").text(ccode + " " + subtotal.toFixed(2));
            } else {
                if (data.message === "You must login to update items in your cart!") {
                    location.replace("login.jsp?page=shop-cart.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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
        dataType: 'JSON'
    });
}

function removeItem(index, itemId, price) {
    var qty = $(".qty" + index).val();
    $.ajax({
        type: 'POST',
        url: 'cartQtyUpdate',
        data: {
            itemId: itemId,
            qty: qty,
            price: price,
            action: '-'
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200 && data.status) {
                verifyItems();

                $(".product" + index).remove();
                qty = parseInt(qty);
                var updatedPrice = qty * price;

                var subtotalText = $("#subtotal").text();
                var subtotal = parseFloat(subtotalText.split(" ")[1]);
                subtotal -= updatedPrice;
                $("#subtotal").text(ccode + " " + subtotal.toFixed(2));
            } else {
                if (data.message === "You must login to update items in your cart!") {
                    location.replace("login.jsp?page=shop-cart.jsp&message=Session%20Expired%21%20Please%20relogin%21");
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
        dataType: 'JSON'
    });
}

function next() {
    if (userObject === "") {
        $.toast({
            heading: 'Warning',
            text: "You need to login / create a new account to checkout.<br>Redirecting to login page...",
            showHideTransition: 'fade',
            icon: 'warning'
        });
        
        setTimeout(() => {
            location.replace("login.jsp?page=shop-cart.jsp&message=You%20need%20to%20login%2Fregister%20to%20checkout%21");
        }, 2000);
        
        return;
    }
    if ($("#noStock").is(":hidden")) {
        window.location.href = "shop-checkout-particulars.jsp?id=" + cartId;
    } else {
        window.location.href = "shop-checkout-particulars.jsp?id=" + cartId + "&option=" + $('#outStockOption').val();
    }
}
function save() {
    var npName = document.getElementById('notepadName').value;
    $.ajax({
        type: 'POST',
        url: 'cartToNp',
        data: {
            npName: npName
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (!data.status) {
                $.toast({
                    heading: 'Error',
                    text: data.message,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
            } else {
                $.toast({
                    heading: 'Success',
                    text: data.message,
                    showHideTransition: 'slide',
                    icon: 'success'
                });
            }
        },
        dataType: 'json'
    });
}

function viewProductDetails(itemId) {
    var item = localStorage.getItem(itemId);    
    item = item.replace(/[{}"]/g, "");
    var itemArray = item.split(",");
    if (itemArray.length > 0) {
        var itemId = itemArray[0].split(":")[1];
        var itemName = itemArray[1].split(":")[1];
        var itemPrice = itemArray[2].split(":")[1];
        var itemWeight = itemArray[3].split(":")[1];
        var itemImg = itemArray[4].split(":")[1];
        var itemPartNo = itemArray[5].split(":")[1];
        var itemDescFull = itemArray[6].split(":")[1];
        
        itemDescFull = itemDescFull.replace(/&#34;/g, "\"");
        itemDescFull = itemDescFull.replace(/&#44;/g, ",");
        
        itemName = itemName.replace(/&#34;/g, "\"");
        itemName = itemName.replace(/&#44;/g, ",");
        
        if (itemImg === "") {
            itemImg = "img/coming_soon.jpg";
        }
        else {
            itemImg = base + "/" + itemImg;
        }
        
        $("#modalTitle").html(itemName);
        $("#prodImage").attr("src", itemImg);
        $("#prodpNo").text(itemPartNo);
        $("#prodDesc").html(itemDescFull);
        $("#prodPrice").text(ccode + " $" + parseFloat(itemPrice).toFixed(2));
        $("#prodWeight").text(parseFloat(itemWeight).toFixed(2) + " KG");
        
        var inst = $('[data-remodal-id=modal]').remodal({closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false});
        inst.open();
        
        var pNoHeight = $("#prodpNo").height();
        $("#pnopanel").css("height", (pNoHeight * 1.5));
        
        var pDescHeight = $("#prodDesc").height();
        $("#pdescpanel").css("height", (pDescHeight * 1.1));
        
        var pPriceHeight = $("#prodPrice").height();
        $("#ppricepanel").css("height", (pPriceHeight * 1.5));
        
        var pWeightHeight = $("#prodWeight").height();
        $("#pweightpanel").css("height", (pWeightHeight * 1.5));
        
    }
}