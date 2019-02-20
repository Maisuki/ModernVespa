$(document).ready(function () {
    if (msg !== "" && msg !== "null") {
        if (status) {
            $.toast({
                heading: 'Success',
                text: msg,
                showHideTransition: 'slide',
                icon: 'success'
            });
        } else {
            $.toast({
                heading: 'Error',
                text: msg,
                showHideTransition: 'fade',
                icon: 'error'
            });
        }
    }
});