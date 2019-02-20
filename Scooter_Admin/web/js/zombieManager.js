$(document).ready(function () {
    $('.content-wrapper').loading({
        stoppable: false,
        message: 'Retrieving Zombie Accounts...',
        theme: 'dark'
    });
    sn.retrieveAllZombies();
});

function deleteZombie(zombieId, index) {
    sn.deleteZombie(zombieId, index);
}