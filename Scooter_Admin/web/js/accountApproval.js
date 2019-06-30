$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Unapproved Account(s)...',
        theme: 'dark'
    });

    sn.retrieveUnapprovedAccounts();
});

function approve(index, email) {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Approving Account... Please wait...',
        theme: 'dark'
    });
    sn.approveAccount(email, index);
}