$(window).keydown(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        
        search();
        
        return false;
    }
});

$(".models").change(function () {
    var jsonObject = new Object();
    var jsonArray = new Array();
    var selectedModel = new Array();
    var n = $(".models:checked").length;
    var brand = "";
    var i = 0;
    if (n > 0) {
        $(".models:checked").each(function () {
            var val = $(this).val();
            var temp = "";
            for (var i in val) {
                if (val.charCodeAt(i) !== 194) {
                    temp += val[i];
                }
            }

            if (i++ === 0) {
                brand = $(this).parent().children(":first").text();
                selectedModel.push(temp);
            } else if (brand !== $(this).parent().children(":first").text()) {
                brand = $(this).parent().children(":first").text();
                selectedModel = new Array();
                selectedModel.push(temp);
                jsonObject = new Object();
                jsonObject["brand"] = brand;
                jsonObject["modelList"] = selectedModel;
                jsonArray.push(jsonObject);
            } else {
                selectedModel.push(temp);
            }
            if (i === n) {
                jsonObject["brand"] = brand;
                jsonObject["modelList"] = selectedModel;
                jsonArray.push(jsonObject);
            }
        });
        $('#json').val(JSON.stringify(jsonArray));
    } else {
        $('#json').val("");
    }
});

$("#selectAllTop, #selectAllBtm").click(function () {
    var checkboxes = document.getElementsByName('models');

    for (var i in checkboxes) {
        checkboxes[i].checked = $(this).prop("checked");
    }

    if ($(this).prop("checked")) {
        if ($(this).attr('id') === 'selectAllTop') {
            $("#selectAllBtm").prop("checked", true);
        } else if ($(this).attr('id') === 'selectAllBtm') {
            $("#selectAllTop").prop("checked", true);
        }

        var jsonObject = new Object();
        var jsonArray = new Array();
        var modelArray = new Array();
        var brand = "";
        var n = $(".models:checked").length;

        $(".models:checked").each(function () {
            var val = $(this).val();
            var temp = "";
            for (var i in val) {
                if (val.charCodeAt(i) !== 194) {
                    temp += val[i];
                }
            }

            if (i++ === 0) {
                brand = $(this).parent().children(":first").text();
                modelArray.push(temp);
            } else if (brand !== $(this).parent().children(":first").text()) {
                brand = $(this).parent().children(":first").text();
                modelArray = new Array();
                modelArray.push(temp);
                jsonObject = new Object();
                jsonObject["brand"] = brand;
                jsonObject["modelList"] = modelArray;
                jsonArray.push(jsonObject);
            } else {
                modelArray.push(temp);
            }
            if (i === n) {
                jsonObject["brand"] = brand;
                jsonObject["modelList"] = modelArray;
                jsonArray.push(jsonObject);
            }
        });
        $('#json').val(JSON.stringify(jsonArray));
    } else {
        if ($(this).attr('id') === 'selectAllTop') {
            $("#selectAllBtm").prop("checked", false);
        } else if ($(this).attr('id') === 'selectAllBtm') {
            $("#selectAllTop").prop("checked", false);
        }
        $('#json').val("");
    }
});

$('#searchBtn').click(function () {
    search();
});

function search() {
    $("#filter").css("display", "inline-block");
    setTimeout(function () {
        var searchVal = $('#search').val().toLowerCase();
        $(".brandtitle, .models, .modelsName").hide();
        $(".form-group").show();

        var results = $("input[type='checkbox']").filter(function () {
            return $(this).val().toLowerCase().indexOf(searchVal) > -1;
        });
        results.each(async function (index, input) {
            $(input).siblings().first().show();
            $(input).show();
            $(input).next().show();
        });

        $(".form-group").each(function (index, div) {
            var count = 0;
            $(div).children(":visible").each(function (index, child) {
                if (!$(child).is("br")) {
                    count++;
                }
            });
            if (count === 0) {
                $(div).hide();
            } else {
                $(div).show();
            }
        });
        $("#filter").hide();
    }, 1000);
}