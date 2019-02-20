$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Categories...',
        theme: 'dark'
    });
    sn.retrieveAllCategories();
});


function deleteCat(id, index) {
    sn.deleteCategory(id, index);
}