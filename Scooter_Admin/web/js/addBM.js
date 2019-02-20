$(document).ready(function () {
    $('#modelAdd').click(function () {
        var modelInput = "<input type='text' class='form-control model' placeholder='Enter new Model'><br>";
        $("#modelList").append(modelInput);
    });
    $("#addBMForm").submit(function (e) {
        e.preventDefault();
        var brand = $("#brand").val();

        if (brand === undefined || brand.trim().length === 0) {
            $.toast({
                heading: 'Error',
                text: "Brand Name is required!<br>Blanks are not allowed!",
                showHideTransition: 'fade',
                icon: 'error'
            });
            $("#addBM").blur();
            return;
        }

        var models = "";
        var modelsArr = [];
        $('.model').each(function (index, item) {
            if ($(item).val().length !== 0) {
                modelsArr.push($(item).val().trim());
            }
        });
        modelsArr.sort();
        models = modelsArr.join("~");
        
        sn.addBM(brand, models);
    });
});