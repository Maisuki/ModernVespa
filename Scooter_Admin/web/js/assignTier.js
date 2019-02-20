$("#tierAssignForm").submit(function (e) {
    e.preventDefault();
    var selectedTierId = $("#tierGroup").val();

    if (selectedTierId === "") {
        $.toast({
            heading: 'Error',
            text: "Please select a tier!",
            showHideTransition: 'fade',
            icon: 'error'
        });
        return;
    }

    sn.assignTier(getUrlParameter('clientId'), selectedTierId);
});