async function main() {
    await sn.retrieveRates();
}

$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: true,
        message: 'Generating Form...',
        theme: 'dark'
    });
    
    var choice;

    $("#productCat").change(function () {
        if ($(this).val() === "addnew") {
            $(this).val("");
            choice = 1;
            var inst = $('[data-remodal-id=modal]').remodal({closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false});
            inst.open();
            return;
        }
    });

    $(document).on('opening', '.remodal', function () {
        if (choice === 1) {
            $('#category').focus();
        }
    });

    $(document).on('confirmation', '.remodal', function () {
        if (choice === 1) {
            category = $('#category').val();
            if (category === "" || category.trim().length === 0) {
                alert("You need to enter a category name before submitting!");
                return;
            }
            var inst = $('[data-remodal-id=modal]').remodal();
            sn.addCat(category, inst);
        }
    });

    $(document).on('cancellation', '.remodal', function () {
        if (choice === 1) {
            var category = $('#category').val();
            if (category !== "" && category.trim().length !== 0) {
                if (confirm('Are you sure you want to stop this operation? (All entered data will be lost!)')) {
                    $('#category').val("");
                    var inst = $('[data-remodal-id=modal]').remodal();
                    inst.close();
                }
            } else {
                var inst = $('[data-remodal-id=modal]').remodal();
                inst.close();
            }
        }
    });

    $("#pBrand").change(function () {
        if ($(this).val() === "addnew") {
            $(this).val("");

            choice = 2;
            var inst = $('[data-remodal-id=modal1]').remodal({closeOnConfirm: false, closeOnCancel: false, closeOnEscape: false, closeOnOutsideClick: false});
            inst.open();
            return;
        }
    });

    $(document).on('opening', '.remodal1', function () {
        if (choice === 2) {
            $('#productBrand').focus();
        }
    });

    $(document).on('confirmation', '.remodal1', function () {
        if (choice === 2) {
            var formData = new FormData();
            
            var productBrand = $('#productBrand').val();
            var tier1Dis = $('#tier1Dis').val();
            var tier2Dis = $('#tier2Dis').val();
            var tier3Dis = $('#tier3Dis').val();
            var tier4Dis = $('#tier4Dis').val();
            if (productBrand === "" && productBrand.trim().length === 0) {
                alert("You need to enter a product brand name before submitting!");
                return;
            }
            
            formData.append("pbrand", productBrand);
            
            if (tier1Dis !== "" && tier1Dis.trim().length !== 0 && isNaN(tier1Dis)) {
                alert("Tier 1 Brand Discount must be a number!!");
                $('#tier1Dis').focus();
                return;
            }
            else if (tier1Dis === "" && tier1Dis.trim().length === 0) {
                tier1Dis = 0;
            }
            
            formData.append("t1bd", tier1Dis);

            if (tier2Dis !== "" && tier2Dis.trim().length !== 0 && isNaN(tier2Dis)) {
                alert("Tier 2 Brand Discount must be a number!!");
                $('#tier2Dis').focus();
                return;
            }
            else if (tier2Dis === "" && tier2Dis.trim().length === 0) {
                tier2Dis = 0;
            }
            
            formData.append("t2bd", tier2Dis);

            if (tier3Dis !== "" && tier3Dis.trim().length !== 0 && isNaN(tier3Dis)) {
                alert("Tier 3 Brand Discount must be a number!!");
                $('#tier3Dis').focus();
                return;
            }
            else if (tier3Dis === "" && tier3Dis.trim().length === 0) {
                tier3Dis = 0;
            }
            
            formData.append("t3bd", tier3Dis);

            if (tier4Dis !== "" && tier4Dis.trim().length !== 0 && isNaN(tier4Dis)) {
                alert("Tier 4 Brand Discount must be a number!!");
                $('#tier4Dis').focus();
                return;
            }
            else if (tier4Dis === "" && tier4Dis.trim().length === 0) {
                tier4Dis = 0;
            }
            
            formData.append("t4bd", tier4Dis);
            sn.addProductBrand(formData, productBrand);
        }
    });

    $(document).on('cancellation', '[data-remodal-id=modal1]', function () {
        if (choice === 2) {
            var productBrand = $('#productBrand').val();
            var tier1Dis = $('#tier1Dis').val();
            var tier2Dis = $('#tier2Dis').val();
            var tier3Dis = $('#tier3Dis').val();
            var tier4Dis = $('#tier4Dis').val();
            if (productBrand !== "" && productBrand.trim().length !== 0 ||
                    tier1Dis !== "" && tier1Dis.trim().length !== 0 ||
                    tier2Dis !== "" && tier2Dis.trim().length !== 0 ||
                    tier3Dis !== "" && tier3Dis.trim().length !== 0 ||
                    tier4Dis !== "" && tier4Dis.trim().length !== 0) {
                if (confirm('Are you sure you want to stop this operation? (All entered data will be lost!)')) {
                    $('#productBrand').val("");
                    $('#tier1Dis').val("");
                    $('#tier2Dis').val("");
                    $('#tier3Dis').val("");
                    $('#tier4Dis').val("");
                    var inst = $('[data-remodal-id=modal1]').remodal();
                    inst.close();
                }
            } else {
                var inst = $('[data-remodal-id=modal1]').remodal();
                inst.close();
            }
        }
    });
    
    main();
    
    $('input:text').focus(function () {
        $(this).select();
    });
    
    sn.retrieveProduct(getUrlParameter('pid'));

    /* SGD Foreign Market Price Conversion */
    $('#foreignsgd').keyup(function () {
        var sgdPrice = $(this).val();
        sn.foreignSGDCheck(sgdPrice);
    });

    $('#foreignsgd').on('paste', function () {
        var sgdPrice = $(this).val();
        sn.foreignSGDCheck(sgdPrice);
    });

    /* USD Foreign Market Price Conversion */
    $('#foreignusd').keyup(function () {
        var usdPrice = $(this).val();
        sn.foreignUSDCheck(usdPrice);
    });

    $('#foreignusd').on('paste', function () {
        var usdPrice = $(this).val();
        sn.foreignUSDCheck(usdPrice);
    });

    /* EUR Foreign Market Price Conversion */
    $('#foreigneur').keyup(function () {
        var eurPrice = $(this).val();
        sn.foreignEURCheck(eurPrice);
    });

    $('#foreigneur').on('paste', function () {
        var eurPrice = $(this).val();
        sn.foreignEURCheck(eurPrice);
    });




    /* SGD Local Market Price Conversion */
    $('#localsgd').keyup(function () {
        var sgdPrice = $(this).val();
        sn.localSGDCheck(sgdPrice);
    });

    $('#localsgd').on('paste', function () {
        var sgdPrice = $(this).val();
        sn.localSGDCheck(sgdPrice);
    });

    /* USD Local Market Price Conversion */
    $('#localusd').keyup(function () {
        var usdPrice = $(this).val();
        sn.localUSDCheck(usdPrice);
    });

    $('#localusd').on('paste', function () {
        var usdPrice = $(this).val();
        sn.localUSDCheck(usdPrice);
    });

    /* EUR Local Market Price Conversion */
    $('#localeur').keyup(function () {
        var eurPrice = $(this).val();
        sn.localEURCheck(eurPrice);
    });

    $('#localeur').on('paste', function () {
        var eurPrice = $(this).val();
        sn.localEURCheck(eurPrice);
    });




    /* SGD Cost of Product Conversion */
    $('#copsgd').keyup(function () {
        var sgdPrice = $(this).val();
        sn.copSGDCheck(sgdPrice);
    });

    $('#copsgd').on('paste', function () {
        var sgdPrice = $(this).val();
        sn.copSGDCheck(sgdPrice);
    });

    /* USD Cost of Product Conversion */
    $('#copusd').keyup(function () {
        var usdPrice = $(this).val();
        sn.copUSDCheck(usdPrice);
    });

    $('#copusd').on('paste', function () {
        var usdPrice = $(this).val();
        sn.copUSDCheck(usdPrice);
    });

    /* EUR Cost of Product Conversion */
    $('#copeur').keyup(function () {
        var eurPrice = $(this).val();
        sn.copEURCheck(eurPrice);
    });

    $('#copeur').on('paste', function () {
        var eurPrice = $(this).val();
        sn.copEURCheck(eurPrice);
    });
    
    
    
    
    /* SGD Shipping Costs Conversion */
    $('#scsgd').keyup(function () {
        var sgdPrice = $(this).val();
        sn.scSGDCheck(sgdPrice);
    });

    $('#scsgd').on('paste', function () {
        var sgdPrice = $(this).val();
        sn.scSGDCheck(sgdPrice);
    });

    /* USD Shipping Costs Conversion */
    $('#scusd').keyup(function () {
        var usdPrice = $(this).val();
        sn.scUSDCheck(usdPrice);
    });

    $('#scusd').on('paste', function () {
        var usdPrice = $(this).val();
        sn.scUSDCheck(usdPrice);
    });

    /* EUR Shipping Costs Conversion */
    $('#sceur').keyup(function () {
        var eurPrice = $(this).val();
        sn.scEURCheck(eurPrice);
    });

    $('#sceur').on('paste', function () {
        var eurPrice = $(this).val();
        sn.scEURCheck(eurPrice);
    });
    
    


    /* Mark up conversion */
    var tier1finalval = 100;
    var tier2finalval = 100;
    var tier3finalval = 100;
    var tier4finalval = 100;

    $('#markuptier1').change(function () {
        var markupPercentageValue = parseInt($(this).val());
        sn.markupSelection(1, markupPercentageValue);
    });

    $('#markuptier2').change(function () {
        var markupPercentageValue = parseInt($(this).val());
        sn.markupSelection(2, markupPercentageValue);
    });

    $('#markuptier3').change(function () {
        var markupPercentageValue = parseInt($(this).val());
        sn.markupSelection(3, markupPercentageValue);
    });

    $('#markuptier4').change(function () {
        var markupPercentageValue = parseInt($(this).val());
        sn.markupSelection(4, markupPercentageValue);
    });

    $('#tier1markupprice').keyup(function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(1, markupPrice, false);
    });

    $('#tier1markupprice').on('paste', function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(1, markupPrice, false);
    });
    
    $('#tier2markupprice').keyup(function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(2, markupPrice, false);
    });

    $('#tier2markupprice').on('paste', function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(2, markupPrice, false);
    });

    $('#tier3markupprice').keyup(function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(3, markupPrice, false);
    });

    $('#tier3markupprice').on('paste', function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(3, markupPrice, false);
    });

    $('#tier4markupprice').keyup(function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(4, markupPrice, false);
    });

    $('#tier4markupprice').on('paste', function () {
        var markupPrice = $(this).val();
        sn.markupPriceUpdate(4, markupPrice, false);
    });

    $('#tier1discount').keyup(function(){
        var discountValue = $(this).val();
        sn.discountValueUpdate(1, discountValue);
    });
    
    $('#tier1discount').on('paste', function () {
        var discountValue = $(this).val();
        sn.discountValueUpdate(1, discountValue);
    });
    
     $('#tier2discount').keyup(function(){
        var discountValue = $(this).val();
        sn.discountValueUpdate(2, discountValue);
    });
    
    $('#tier2discount').on('paste', function () {
        var discountValue = $(this).val();
        sn.discountValueUpdate(2, discountValue);
    });
    
     $('#tier3discount').keyup(function(){
        var discountValue = $(this).val();
        sn.discountValueUpdate(3, discountValue);
    });
    
    $('#tier3discount').on('paste', function () {
        var discountValue = $(this).val();
        sn.discountValueUpdate(3, discountValue);
    });
    
     $('#tier4discount').keyup(function(){
        var discountValue = $(this).val();
        sn.discountValueUpdate(4, discountValue);
    });

    $('#tier4discount').on('paste', function () {
        var discountValue = $(this).val();
        sn.discountValueUpdate(4, discountValue);
    });
    



    /* Weight KG to G Conversion */
    $('#kilo').keyup(function () {
        var kgWeight = $(this).val();
        var gValue = kgToG(kgWeight);
        $('#gram').val(gValue);
    });

    $('#kilo').on('paste', function () {
        var kgWeight = $(this).val();
        var gValue = kgToG(kgWeight);
        $('#gram').val(gValue);
    });

    /* Weight G to KG Conversion */
    $('#gram').keyup(function () {
        var gWeight = $(this).val();
        var kgValue = gToKG(gWeight);
        $('#kilo').val(kgValue);
    });

    $('#gram').on('paste', function () {
        var gWeight = $(this).val();
        var kgValue = kgToG(gWeight);
        $('#kilo').val(kgValue);
    });
    $('#gst').keyup(function () {
        var gst = $(this).val();
        if ($('#copsgd').val() != "") {
            var sgdPrice = parseFloat($('#copsgd').val());
            $('#costwGst').val((sgdPrice * (1 + (gst / 100))).toFixed(2));
        }
    });
});