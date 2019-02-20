$(document).ready(function() {
    sn.retrieveCategory(getUrlParameter('id'));
    
    $("#updateCatForm").submit(function (e) {
        e.preventDefault();
        var catName = $("#catName").val();
        var id = getUrlParameter('id');

        if (id === undefined || id.trim().length === 0) {
            location.replace("cat.jsp");
            return;
        }

        if (catName === undefined || catName.trim().length === 0) {
            $.toast({
                heading: 'Error',
                text: "Username and Password are required!<br>Blanks are not allowed!",
                showHideTransition: 'fade',
                icon: 'error'
            });
            return;
        }
        
        sn.updateCategory(getUrlParameter('id'), catName);
    });
});