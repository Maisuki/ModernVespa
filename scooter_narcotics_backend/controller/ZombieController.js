var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	addZombie: async function(username, password, hashedPassword) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			const retrieveZombieAcctsResults =  await zombie.find().toArray();
			var size = retrieveZombieAcctsResults.length;
			
			var acctName = 'Zombie ' + (size + 1);
			var data = { 'username' : username , 'password' : password , 'hashedPassword': hashedPassword, 'name': acctName, 'role_id' : 998 , 'created_on' : new Date() };
			var addZombieResult = await zombie.insert(data);
			if (addZombieResult.insertedCount === 0) {
				throw new Error('1');
			}
			return addZombieResult.ops[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Add Zombie failed! Please contact the administrator!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	verifyZombie: async function(zombieId) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			var filter = { _id: new mongo.ObjectId(zombieId) };
			const retrieveZombieAcctResults =  await zombie.find(filter).toArray();
			if (retrieveZombieAcctResults.length === 0) {
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid zombieId detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	removeZombie: async function(zombieId) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			var filter = { _id: new mongo.ObjectId(zombieId) };
			const removeZombieResults = await zombie.remove(filter);
			if (removeZombieResults.result.n === 0) {
				throw new Error('1');
			}
			return removeZombieResults;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid zombieId detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveAll: async function() {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			const retrieveZombieAcctsResults =  await zombie.find().toArray();
			return retrieveZombieAcctsResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	retrieveOne: async function(zombieId) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			var filter = { _id: new mongo.ObjectId(zombieId) };
			const retrieveZombieAcctResults =  await zombie.find(filter).toArray();
			if (retrieveZombieAcctResults.length === 0) {
				throw new Error('1');
			}
			return retrieveZombieAcctResults[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid zombieId detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateZombie: async function(zombieId, username, password, hashedPassword) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			var filter = { _id: new mongo.ObjectId(zombieId) };
			var update = {};
			if (username !== undefined) {
				update['username'] = username;
			}
			if (password !== undefined) {
				update['password'] = password;
			}
			if (hashedPassword !== undefined) {
				update['hashedPassword'] = hashedPassword;
			}
			if (!isEmpty(update)) {
				var update_values = { $set: update }
				const updateZombieAcctResults =  await zombie.update(filter, update_values);
				if (updateZombieAcctResults.result.nModified === 0) {
					throw new Error('1');
				}
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Nothing is being updated!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	zombieLogin: async function(username, password) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			var filter = { username: username, hashedPassword: password };
			const zombieLoginResults =  await zombie.find(filter).toArray();
			if (zombieLoginResults.length === 0) {
				throw new Error('1');
			}
			return zombieLoginResults[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid zombie credentials detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	verifyZombieByUsername: async function(username) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			var filter = { username: username };
			const retrieveZombieAcctResults =  await zombie.find(filter).toArray();
			if (retrieveZombieAcctResults.length === 0) {
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid zombieId detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveZombiePassword: async function(username) {
		var db = dbConnection.getDb();
		var zombie = db.collection('zombie');
		try {
			var filter = { username: username };
			const zombieLoginResults =  await zombie.find(filter).toArray();
			if (zombieLoginResults.length === 0) {
				throw new Error('1');
			}
			return zombieLoginResults[0].hashedPassword;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid username detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
};
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}