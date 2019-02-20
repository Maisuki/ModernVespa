$(document).ready(function () {
    var id = getUrlParameter('id');
    sn.retrieveTierInformation(id);
    sn.retrieveProductBrandById(id);
    sn.retrieveBrandDiscountsByUserId(id);

    $("#tierMgmtForm").submit(function (e) {
        e.preventDefault();
        var tier = $("#tier").val();
        if (tier === "") {
            $.toast({
                heading: 'Error',
                text: 'Please select a tier before submitting',
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        sn.updateTier(id, tier);
    });

    $("#pBrandDiscountMgmtForm").submit(function (e) {
        e.preventDefault();
        var productbrand = $("#productbrands").val();
        if (productbrand === "") {
            $.toast({
                heading: 'Error',
                text: 'Please select a product brand before submitting',
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        sn.addPbrandDiscount(id, productbrand);
    });

    $(document).on('change', '.number-format', function () {
        var value = $(this).val();
        if (isNaN(value)) {
            $.toast({
                heading: 'Error',
                text: 'Please enter a valid number for the discount!',
                showHideTransition: 'fade',
                icon: 'error'
            });
            $(this).val("");
            $(this).focus();
        } else {
            var decimalNum = parseFloat(value);
            $(this).val(decimalNum.toFixed(2));
        }
    });

    $(document).on('click', '.updateBrandDiscount', function () {
        var index = $(this).attr('id').split("-")[0];
        var pName = $("#name" + index).text();
        var pDiscount = $("#" + index).val();
        if (pDiscount === undefined || pDiscount === "") {
            $.toast({
                heading: 'Error',
                text: 'Please enter a discount value before submitting',
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        sn.updatePbrandDiscount(id, pName, pDiscount);
    });

    $(document).on('click', '.deleteBrandDiscount', function () {
        var index = $(this).attr('id').split("-")[0];
        var pName = $("#name" + index).text();
        sn.deletePbrandDiscount(id, pName);
    });
});