$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving all products...',
        theme: 'dark'
    });
    sn.retrieveProductsForRelated(getUrlParameter("id"));
});

$(window).keydown(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        
        search();
        
        return false;
    }
});

$('#searchBtn').click(function () {
    search();
});

function search() {
    $("#filter").css("display", "inline-block");
    $(".form-group").hide();
    
    setTimeout(function () {
        var searchVal = $('#search').val().toLowerCase();
        $(".form-group").each((index, div) => {
            if (searchVal.trim() === "") {
                $(this).show();
            }
            else {
                var id = $(this).attr("id");
                var productName = $(this).children().first().text().toLowerCase();
                if (productName.indexOf(searchVal) > -1) {
                    $(this).show();
                }
            }
        });
        $("#filter").hide();
    }, 1000);
}