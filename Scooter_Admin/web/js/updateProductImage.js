$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: true,
        message: 'Retrieving photos...',
        theme: 'dark'
    });
    sn.retrieveProductImage(getUrlParameter('pid'));
});

function deleteImage(index) {
    sn.deleteProductImage(getUrlParameter('pid'), index);
}