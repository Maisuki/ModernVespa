$(document).ready(function () {
    $("#productbrand").focus();

    $("#t1bd, #t2bd, #t3bd, #t4bd").change(function () {
        var val = $(this).val();
        if (isNaN(val)) {
            val = "0.00";
        }
        val = parseFloat(val).toFixed(2);
        $(this).val(val);
    });

    $("#addPbrandForm").submit(function (e) {
        e.preventDefault();
        
        var formData = new FormData();
        
        var productbrand = $("#productbrand").val();
        var t1bd = $("#t1bd").val();
        var t2bd = $("#t2bd").val();
        var t3bd = $("#t3bd").val();
        var t4bd = $("#t4bd").val();

        if (productbrand === undefined || productbrand.trim().length === 0) {
            $.toast({
                heading: 'Error',
                text: "Product Brand name is required!<br>Blanks are not allowed!",
                showHideTransition: 'fade',
                icon: 'error'
            });
            $("#addBM").blur();
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
        
        var pbrandImage = $("#pbrandImage")[0].files[0];
        formData.append("pbrandImage", pbrandImage);
        sn.addPbrand(formData);
    });
});