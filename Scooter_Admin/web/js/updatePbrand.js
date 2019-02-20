$(document).ready(function () {
    var id = getUrlParameter('id');
    if (id === undefined || id.trim().length === 0) {
        location.replace("pbrand.jsp");
        return;
    }
    $('#pbrandImageFileChooser').hide();
    sn.retrievePbrand(id);

    $("#t1bd, #t2bd, #t3bd, #t4bd").change(function () {
        var val = $(this).val();
        
        if (isNaN(val) || val.trim().length === 0) {
            val = "0.00";
        }
        val = parseFloat(val).toFixed(2);
        $(this).val(val);
    });
    
    $('#pbrandImageBtn').click(function() {
        $('#pbrandImageFileChooser').click();
    });
    
    $("#pbrandImageFileChooser").change(function (){
        if ($(this)[0].files && $(this)[0].files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#pbrandImage').attr('src', e.target.result);
            }
            reader.readAsDataURL($(this)[0].files[0]);
        }
        $('#pbrandImageBtn').blur();
    });

    $("#updatePbrandForm").submit(function (e) {
        e.preventDefault();
        $('.content-wrapper').loading({
            stoppable: false,
            message: 'Submitting updates...',
            theme: 'dark'
        });
        
        var formData = new FormData();
        
        var id = $("#pbID").val();
        var productbrand = $("#productbrand").val();
        var t1bd = $("#t1bd").val();
        var t2bd = $("#t2bd").val();
        var t3bd = $("#t3bd").val();
        var t4bd = $("#t4bd").val();

        if (id === undefined || id.trim().length === 0) {
            location.replace("pbrand.jsp");
            return;
        }
        
        formData.append("productBrandID", id);

        if (productbrand === undefined || productbrand.trim().length === 0) {
            $.toast({
                heading: 'Error',
                text: "Product Brand name is required!<br>Blanks are not allowed!",
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        
        formData.append("pbrand", productbrand);

        if (t1bd !== undefined || t1bd.trim().length !== 0) {
            formData.append("t1bd", t1bd);
        }

        if (t2bd !== undefined || t2bd.trim().length !== 0) {
            formData.append("t2bd", t2bd);
        }

        if (t3bd !== undefined || t3bd.trim().length !== 0) {
            formData.append("t3bd", t3bd);
        }

        if (t4bd !== undefined || t4bd.trim().length !== 0) {
            formData.append("t4bd", t4bd);
        }
        
        var pbrandImage = $("#pbrandImageFileChooser")[0].files[0];
        formData.append("pbrandImage", pbrandImage);

        sn.updatePbrand(formData, id);
    });
});

function retrievePbrand() {
    var retrievePbrandsResults = ajaxCall('POST', 'retrieveProductBrand', {productBrandID: getUrlParameter('id')});
    if (retrievePbrandsResults.status) {
        var productBrand = retrievePbrandsResults.productBrand;
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

        $("#pbID").val(id);
        $("#productbrand").val(name);
        $("#t1bd").val(tier1);
        $("#t2bd").val(tier2);
        $("#t3bd").val(tier3);
        $("#t4bd").val(tier4);
    } else {
        $.toast({
            heading: 'Error',
            text: retrievePbrandsResults.message,
            showHideTransition: 'fade',
            icon: 'error'
        });
    }
}