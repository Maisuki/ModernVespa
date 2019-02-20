$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving all Brand and Model...',
        theme: 'dark'
    });
    sn.retrieveAllBMs();
});

function deleteBrand(id, index) {
    sn.deleteBM(id, index);
}