var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	retrieveAllRoles: async function() {
		var db = dbConnection.getDb();
	    	var role = db.collection('role');
    		try {
    			var valueFilter = {};
	    		const retrieveAllRolesResults = await role.find(valueFilter).toArray();
    			if (retrieveAllRolesResults.length === 0) {
    				throw new Error('No roles found! Please contact the administrator!');
				}
				return retrieveAllRolesResults;
    		}
	    	catch (err) {
    			throw new Error('Something went wrong! Please contact the administrator!');
	    	}
	},
};
