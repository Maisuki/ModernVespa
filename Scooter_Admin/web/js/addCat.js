$(document).ready(function() {
    $("#catName").focus();
});

$("#addCatForm").submit(function(e){
    e.preventDefault();
    var catName = $("#catName").val();
    
    if (catName === undefined || catName.trim().length === 0) {
        $.toast({
            heading: 'Error',
            text: "Category Name is required!<br>Blanks are not allowed!",
            showHideTransition: 'fade',
            icon: 'error'
        });
        return;
    }
    
    catName = catName.trim();    
    sn.addCategory(catName);
});