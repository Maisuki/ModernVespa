var renameNotepadName = "";
var renameNotepadId = "";
var clientId = '${sessionScope.clientId}';
var modalSelection = "";

$(document).ready(function () {
    $(".activenpcheckhandler").change(function () {
        $.toast({
            heading: 'Error',
            text: 'You need to have one active notepad!',
            showHideTransition: 'fade',
            icon: 'error'
        });
        $(this).prop("checked", true);
    });

    $(".inactivenpcheckhandler").change(function () {
        var selectedNotepadId = $(this).val();
        $.ajax({
            type: 'POST',
            url: 'setNpActive',
            data: {
                npId: selectedNotepadId
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                var data = ($.parseJSON(e.responseText));
                if (data.status) {
                    $(".activenpcheckhandler").prop("checked", false);

                    $.toast({
                        heading: 'Success',
                        text: 'New notepad successfully added! Updating your notepads...',
                        showHideTransition: 'fade',
                        icon: 'success'
                    });
                    setTimeout(function () {
                        var href = window.location.href;
                        var lastSlashIndex = href.lastIndexOf("/") + 1;
                        var redirectUrl = href.substring(lastSlashIndex);
                        redirectUrl = redirectUrl.split("#")[0];
                        window.location.replace(redirectUrl);
                    }, 2000);
                } else {
                    if (data.message === "You must login to set your notepads active!") {
                        $.toast({
                            heading: 'Error',
                            text: 'Please login to set your notepads active',
                            showHideTransition: 'fade',
                            icon: 'error'
                        });
                        var href = window.location.href;
                        var lastSlashIndex = href.lastIndexOf("/") + 1;
                        var redirectUrl = href.substring(lastSlashIndex);
                        window.location.replace("login.jsp?page=" + redirectUrl);
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
    });

    $("#newnotepad, #newnotepad1, #newnotepad2").click(function () {
        modalSelection = "1";
        var inst = $('[data-remodal-id=modal]').remodal({closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false});
        inst.open();
    });

    $(document).on('opening', '.remodal', function () {
        $('#notepad').focus();
    });

    $(document).on('confirmation', '.remodal', function () {
        if (modalSelection === "1") {
            var notepadName = $('#notepad').val();
            if (notepadName === "" || notepadName.trim().length === 0) {
                var totalNumOfNp = ($(".activenp").children().length / 2) + ($(".inactivenp").children().length / 2);
                notepadName = "New Notepad " + (totalNumOfNp + 1);
            }
            $.ajax({
                type: 'POST',
                url: 'createNotepad',
                data: {
                    npName: notepadName
                },
                success: function (data) {},
                complete: function (e, xhr, settings) {
                    var data = ($.parseJSON(e.responseText));

                    if (data.status) {
                        var notepad = data.notepad;
                        
                        var newNotepadDetailsPanel = "<div class='block-head block-head-4 grid-col-9 grid-col' style='line-height: 180%; font-size: 16px; margin-bottom: 30px;'>";
                        newNotepadDetailsPanel += " <h4 id='" + notepad._id + "npName' style='text-transform: uppercase; color: #a6eb14; font-weight: bold; font-size: 17px;display: inline-block;'>";
                        newNotepadDetailsPanel += "     " + notepadName;
                        newNotepadDetailsPanel += " </h4>";
                        
                        newNotepadDetailsPanel += " <div style='display: inline-block; float: right; margin-left: 30px;'>";
                        newNotepadDetailsPanel += "     <label style='margin-top: 7px;' class='checkbox mobile-billing-address'>";
                        newNotepadDetailsPanel += "         <input class='inactivenpcheckhandler' type='checkbox' value='" + notepad._id + "' " + (notepad.active ? 'checked' : '') + ">";
                        newNotepadDetailsPanel += "         <i class='fa fa-check'></i>Active";
                        newNotepadDetailsPanel += "     </label>";
                        newNotepadDetailsPanel += " </div>";
                        
                        newNotepadDetailsPanel += " <div class='mobile-nav-display-none' style='float: right;'>";
                        newNotepadDetailsPanel += "     <div style='float: right; margin-left: 30px;'>";
                        newNotepadDetailsPanel += "         <a class='underline-link' onclick='removeNotepad(\"" + notepad._id + "\")'>Remove Notepad</a>";
                        newNotepadDetailsPanel += "     </div>";
                        newNotepadDetailsPanel += "     <div style='float: right; margin-left: 30px;'>";
                        newNotepadDetailsPanel += "         <a class='underline-link' onclick='rename(\"" + notepad.npName + "\", \"" + notepad._id + "\")'>Rename Notepad</a>";
                        newNotepadDetailsPanel += "     </div>";
                        newNotepadDetailsPanel += "     <div style='float: right;'>";
                        newNotepadDetailsPanel += "         <a class='underline-link' onclick='viewNotepad(\"" + notepad._id + "\")'>View Notepad</a>";
                        newNotepadDetailsPanel += "     </div>";
                        newNotepadDetailsPanel += " </div>";
                                        
                        newNotepadDetailsPanel += " <div class='dropdown mobile-nav-display-full'>";
                        newNotepadDetailsPanel += "     <button class='dropbtn mobile-nav-display-full'>";
                        newNotepadDetailsPanel += "         <i class='fa fa-ellipsis-v'></i>"
                        newNotepadDetailsPanel += "     </button>";
                        newNotepadDetailsPanel += "     <div class='dropdown-content'>";
                        newNotepadDetailsPanel += "         <a onclick='viewNotepad(\"" + notepad._id + "\")'>View Notepad</a>";
                        newNotepadDetailsPanel += "         <a onclick='rename(\"" + notepad.npName + "\", \"" + notepad._id + "\")'>Rename Notepad</a>";
                        newNotepadDetailsPanel += "         <a onclick='removeNotepad(\"" + notepad._id + "\")'>Remove Notepad</a>";
                        newNotepadDetailsPanel += "     </div>";
                        newNotepadDetailsPanel += " </div>";
                        
                        newNotepadDetailsPanel += "</div>";
                        
                        newNotepadDetailsPanel += "<div class='block block-shopping-cart'>";
                        newNotepadDetailsPanel += " <table id='cart'></table>";
                        newNotepadDetailsPanel += "</div>";
                        
                        $(".inactivenp").append(newNotepadDetailsPanel);

                        $.toast({
                            heading: 'Success',
                            text: 'New notepad successfully added!',
                            showHideTransition: 'fade',
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
                            window.location.replace("login.jsp?page=" + redirectUrl);
                        } else {
                            $.toast({
                                heading: 'Error',
                                text: data.message,
                                showHideTransition: 'fade',
                                icon: 'error'
                            });
                        }
                    }
                    var inst = $('[data-remodal-id=modal]').remodal();
                    inst.close();
                    modalSelection = "";
                },
                dataType: 'json'
            });
        }
    });

    $(document).on('cancellation', '.remodal', function () {
        var notepad = $('#notepad').val();
        if (notepad !== "" && notepad.trim().length !== 0) {
            if (confirm('Are you sure you want to stop this operation? (All entered data will be lost!)')) {
                $('#notepad').val("");
                var inst = $('[data-remodal-id=modal]').remodal();
                inst.close();
            }
        } else {
            var inst = $('[data-remodal-id=modal]').remodal();
            inst.close();
        }
    });

    $(document).on('opening', '.remodal1', function () {
        $('#notepadName').focus();
    });

    $(document).on('confirmation', '.remodal1', function () {
        if (modalSelection === "2") {
            var notepadName = $('#notepadName').val();
            if (notepadName === "" || notepadName.trim().length === 0) {
                alert("Please enter a notepad name to rename!");
            } else {
                $('#notepadName').val("");

                $.ajax({
                    type: 'POST',
                    url: 'renameNotepad',
                    data: {
                        npId: renameNotepadId,
                        npName: notepadName
                    },
                    success: function (data) {},
                    complete: function (e, xhr, settings) {
                        var data = ($.parseJSON(e.responseText));

                        if (data.status) {
                            $("#" + renameNotepadId + "npName").text(notepadName);
                            $.toast({
                                heading: 'Success',
                                text: 'Notepad successfully renamed!',
                                showHideTransition: 'fade',
                                icon: 'success'
                            });
                        } else {
                            if (data.message === "You must login to rename your notepad!") {
                                $.toast({
                                    heading: 'Error',
                                    text: 'Please login to rename your notepad',
                                    showHideTransition: 'fade',
                                    icon: 'error'
                                });
                                var href = window.location.href;
                                var lastSlashIndex = href.lastIndexOf("/") + 1;
                                var redirectUrl = href.substring(lastSlashIndex);
                                window.location.replace("login.jsp?page=" + redirectUrl);
                            } else {
                                $.toast({
                                    heading: 'Error',
                                    text: data.message,
                                    showHideTransition: 'fade',
                                    icon: 'error'
                                });
                            }
                        }
                        var inst = $('[data-remodal-id=modal1]').remodal();
                        inst.close();
                    },
                    dataType: 'json'
                });

                var inst = $('[data-remodal-id=modal1]').remodal();
                inst.close();
                modalSelection = "";
            }
        }
    });

    $(document).on('cancellation', '.remodal1', function () {
        var notepadName = $('#notepadName').val();
        if (notepadName !== "" && notepadName.trim().length !== 0 && notepadName !== renameNotepadName) {
            if (confirm('Are you sure you want to stop this operation? (All entered data will be lost!)')) {
                $('#notepadName').val("");
                var inst = $('[data-remodal-id=modal1]').remodal();
                inst.close();
            }
        } else {
            $('#notepadName').val("");
            var inst = $('[data-remodal-id=modal1]').remodal();
            inst.close();
        }
    });
    
    $(document).on('opening', '.remodal2', function () {
        
    });

    $(document).on('confirmation', '.remodal2', function () {
        if (modalSelection === "3") {
            
            var inst = $('[data-remodal-id=modal2]').remodal();
            inst.close();
            modalSelection = "";
        }
    });

    $(document).on('cancellation', '.remodal2', function () {
        var inst = $('[data-remodal-id=modal2]').remodal();
        inst.close();
    });

    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }
});

function reduceQty(index, npId, item, price) {
    var qty = $(".qty" + index).val();
    var qtyNum = parseInt(qty);

    if (qtyNum >= 1) {
        $.ajax({
            type: 'POST',
            url: 'npQtyUpdate',
            data: {
                npId: npId,
                action: '-',
                qty: 1,
                item: item,
                price: price
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                var data = ($.parseJSON(e.responseText));
                if (e.status === 200) {
                    var parent = $(".npitemrow" + index).parent();
                    if (qtyNum === 1) {
                        $(".qty" + index).val(0);
                        $(".price" + index).text(0);
                        $(".npitemrow" + index).remove();
                    } else {
                        var updatedQty = qtyNum - 1;
                        $(".qty" + index).val(updatedQty);
                        var updatedPrice = updatedQty * price;
                        $(".price" + index).text(ccode + ' ' + updatedPrice.toFixed(2));
                    }

                    var currentTotalText = $("#subtotal").text();
                    var currentTotal = parseFloat(currentTotalText.split(" ")[1]);
                    currentTotal -= price;
                    $("#subtotal").text(ccode + ' ' + currentTotal.toFixed(2));
                    if (currentTotal.toFixed(2) === "0.00") {
                        var emptyPanel = "<div align='center' style='margin-bottom: 20px;'>";
                        emptyPanel += "<span>There are no items in this notepad! <br>Click ";
                        emptyPanel += "<a style='text-decoration: underline;' href='products.jsp'>here</a> to browse for your desired products";
                        emptyPanel += "</span>";
                        emptyPanel += "</div>";
                        parent.prepend(emptyPanel);
                    }
                }
            },
            dataType: 'json'
        });
    }
}

function removeAllQty(index, npId, item, price) {
    var qty = $(".qty" + index).val();
    $.ajax({
        type: 'POST',
        url: 'npQtyUpdate',
        data: {
            npId: npId,
            action: '-',
            qty: qty,
            item: item,
            price: price
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200) {
                if (data.status) {
                    var parent = $(".npitemrow" + index).parent();
                    var totalPrice = price * qty;
                    var currentTotalText = $("#subtotal").text();
                    var currentTotal = parseFloat(currentTotalText.split(" ")[1]);
                    currentTotal -= totalPrice;
                    $("#subtotal").text(ccode + ' ' + currentTotal.toFixed(2));
                    $(".npitemrow" + index).remove();
                    if (currentTotal.toFixed(2) === "0.00") {
                        var emptyPanel = "<div align='center' style='margin-bottom: 20px;'>";
                        emptyPanel += "<span>There are no items in this notepad! <br>Click ";
                        emptyPanel += "<a style='text-decoration: underline;' href='products.jsp'>here</a> to browse for your desired products";
                        emptyPanel += "</span>";
                        emptyPanel += "</div>";
                        parent.prepend(emptyPanel);
                    }
                }
            }
        },
        dataType: 'json'
    });
}

function addQty(index, npId, item, price) {
    var qty = $(".qty" + index).val();
    $.ajax({
        type: 'POST',
        url: 'npQtyUpdate',
        data: {
            npId: npId,
            action: '+',
            qty: 1,
            item: item,
            price: price
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200) {
                var updatedQty = parseInt(qty) + 1;
                var updatedPrice = (updatedQty * price).toFixed(2);
                $(".qty" + index).val(updatedQty);
                $(".price" + index).text(ccode + ' ' + updatedPrice);
                var currentTotalText = $("#subtotal").text();
                var currentTotal = parseFloat(currentTotalText.split(" ")[1]);
                currentTotal += parseFloat(price);
                $("#subtotal").text(ccode + ' ' + currentTotal.toFixed(2));
            }
        },
        dataType: 'json'
    });
}

function rename(npName, npId) {
    modalSelection = "2";
    renameNotepadName = npName;
    renameNotepadId = npId;
    $('#notepadName').val(renameNotepadName);
    var inst = $('[data-remodal-id=modal1]').remodal({closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false});
    inst.open();
}

function copyToCart(npId) {
    $.ajax({
        type: 'POST',
        url: 'npToCart',
        data: {
            npId: npId
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            console.log(e.responseText);
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200) {
                $.toast({
                    heading: data.status ? 'Success' : 'Error',
                    text: data.message,
                    showHideTransition: 'fade',
                    icon: data.status ? 'success' : 'error'
                });
            }
        },
        dataType: 'json'
    });
}

function viewNotepad(npId) {
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "retrieveNp");
    var hiddenField1 = document.createElement("input");
    hiddenField1.setAttribute("type", "hidden");
    hiddenField1.setAttribute("name", 'npId');
    hiddenField1.setAttribute("value", npId);
    var hiddenField2 = document.createElement("input");
    hiddenField2.setAttribute("type", "hidden");
    hiddenField2.setAttribute("name", 'Referer');
    hiddenField2.setAttribute("value", "<%=splittedUri[splittedUri.length - 1]%>");
    form.appendChild(hiddenField1);
    form.appendChild(hiddenField2);
    document.body.appendChild(form);
    form.submit();
}

function viewProductDetails(npId) {
    var item = localStorage.getItem(npId);
    var jsonString = JSON.stringify(item);
    var json = JSON.parse(jsonString);
    
    item = item.replace(/[{}"]/g, "");
    var itemArray = item.split(",");
    if (itemArray.length > 0) {
        var itemId = itemArray[0].split(":")[1];
        var itemName = itemArray[1].split(":")[1];
        var itemPrice = itemArray[2].split(":")[1];
        var itemWeight = itemArray[3].split(":")[1];
        var itemPartNo = itemArray[4].split(":")[1];
        var itemDescFull = itemArray[5].split(":")[1];
        var itemImg = itemArray[6].split(":")[1];
        
        itemDescFull = itemDescFull.replace(/&#34;/g, "\"");
        itemDescFull = itemDescFull.replace(/&#44;/g, ",");
        
        itemName = itemName.replace(/&#34;/g, "\"");
        itemName = itemName.replace(/&#44;/g, ",");
        
        $("#modal2Title").html(itemName);
        $("#prodImage").attr("src", base + "/" + itemImg);
        $("#prodpNo").text(itemPartNo);
        $("#prodDesc").html(itemDescFull);
        $("#prodPrice").text(ccode + " $" + parseFloat(itemPrice).toFixed(2));
        $("#prodWeight").text(parseFloat(itemWeight).toFixed(2) + " KG");
        
        
        
        modalSelection = "3";
        var inst = $('[data-remodal-id=modal2]').remodal({closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false});
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

function removeNotepad(npId) {
    $.ajax({
        type: 'POST',
        url: 'removeNp',
        data: {
            npId: npId
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var data = ($.parseJSON(e.responseText));
            if (e.status === 200) {
                if (!data.status) {
                    $.toast({
                        heading: 'Error',
                        text: data.message,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                } else {
                    location.reload();
                }
            }
        },
        dataType: 'json'
    });
}