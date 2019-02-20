$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Products...',
        theme: 'dark'
    });
    sn.retrieveAllProducts();
});

function deleteProduct(id, index) {
    sn.deleteProduct(id, index);
}