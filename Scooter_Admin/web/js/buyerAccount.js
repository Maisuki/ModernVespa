
$(document).ready(function () {
    var id = '<%=request.getParameter("_id")%>';
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Account informations...',
        theme: 'dark'
    });
    var id = getUrlParameter('id');
    sn.retrieveCRMByClientId("Buyer", id);

    sn.retrieveTransactions(id);
});