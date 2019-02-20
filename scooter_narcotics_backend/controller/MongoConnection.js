var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

module.exports = {

    connect: function(dbName,  callback ) {
       MongoClient.connect(dbName, { useNewUrlParser: true }, function(err, client) {

       _db = client.db('scooter');
       return callback( err );
    });
},

     getDb: function() {
        return _db;
     }
};
