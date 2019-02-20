$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Product Brands...',
        theme: 'dark'
    });
    sn.retrieveAllPbrands();
});
function applyDiscount(id) {
    sn.applyPbrandDiscount(id);
}

function deletePBrand(id, index) {
    sn.deletePbrand(id, index);
}