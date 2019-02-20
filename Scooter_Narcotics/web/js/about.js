$(document).ready(function () {
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }
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