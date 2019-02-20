$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Unapproved Account(s)...',
        theme: 'dark'
    });

    sn.retrieveUnapprovedAccounts();
});

function approve(index, email, username) {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Approving Account... Please wait...',
        theme: 'dark'
    });
    sn.approveAccount(email, username, index);
}

function approveFb(index, email, fbId) {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Approving Account... Please wait...',
        theme: 'dark'
    });
    sn.approveFbAccount(email, fbId, index);
}

function approveGoogle(index, email, googleId) {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Approving Account... Please wait...',
        theme: 'dark'
    });
    sn.approveGoogleAccount(email, googleId, index);
}