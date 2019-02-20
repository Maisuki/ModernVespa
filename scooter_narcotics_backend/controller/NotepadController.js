var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	createNotepad: async function(clientId, npName, cart_items) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { clientId: new mongo.ObjectId(clientId) };
			const allNotepads = await notepad.find(filter).toArray();
			var active = false;
			if (allNotepads.length === 0) {
				active = true;
			}
			
			var data = { clientId: new mongo.ObjectId(clientId), npName: npName, items:  cart_items, active: active };
			const createNotepadResults = await notepad.insert(data);
			if (createNotepadResults.insertedCount === 0) {
				throw new Error('1');
			}
			return createNotepadResults.ops[0];
		}
		catch (err) {
			if (err.message === '1') {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},
	
	setNotepadActive: async function(notepadId, clientId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { clientId: new mongo.ObjectId(clientId) };
			var omit_filter = { _id: 1 };
			const retrieveNotepadResults = await notepad.find(filter, omit_filter).toArray();
			for (var idx in retrieveNotepadResults) {
				var currentId = retrieveNotepadResults[idx]._id;
				filter = { _id : new mongo.ObjectId(currentId) };
				var update_values;
				if (currentId.toString() === notepadId.toString()) {
					update_values = { $set: { active: true } };
				}
				else {
					update_values = { $set: { active: false } };
				}
				const updateNotepadResults = await notepad.update(filter, update_values);
			}
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveNotepadNames: async function(clientId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { 'clientId': new mongo.ObjectId(clientId) };
			var omit_filter = { clientId: 1, npName: 1 };
			const retrieveNotepadResults = await notepad.find(filter, omit_filter).toArray();
			if (retrieveNotepadResults.length === 0) {
				console.log('here');
				throw new Error('1');
			}
			return retrieveNotepadResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('User do not have any notepads!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	renameNotepad: async function(npId, npName) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { _id: new mongo.ObjectId(npId) };
			var update_values = { $set: { npName: npName } };
			const renameNotepadResults = await notepad.update(filter, update_values);
			return renameNotepadResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveActiveNotepad: async function(clientId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { 'clientId': new mongo.ObjectId(clientId), active: true };
			const retrieveNotepadResults = await notepad.find(filter).toArray();
			if (retrieveNotepadResults.length === 0) {
				throw new Error('1');
			}
			return retrieveNotepadResults[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid Notepad ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveNotepad: async function(clientId, npId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter;
			if (npId === undefined) {
				filter = { 'clientId': new mongo.ObjectId(clientId), active: true };
			}
			else {
				filter = { '_id': new mongo.ObjectId(npId), 'clientId': new mongo.ObjectId(clientId) };
			}
			const retrieveNotepadResults = await notepad.find(filter).toArray();
			if (retrieveNotepadResults.length === 0) {
				throw new Error('1');
			}
			return retrieveNotepadResults[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid Notepad ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	/*
	retrieveNotepadInOrder: async function(clientId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		var notepadListObj = {};
		try {
			var filter = { 'clientId': new mongo.ObjectId(clientId), active: true };
			const activeNotepadList = await notepad.find(filter).toArray();
			notepadListObj["active"] = activeNotepadList;
			
			var omit_filter = { npName: 1, active: 1 };
			filter = { 'clientId': new mongo.ObjectId(clientId), active: false };
			const inactiveNotepadList = await notepad.find(filter, omit_filter).toArray();
			notepadListObj["inactive"] = inactiveNotepadList;
			return notepadListObj;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('User do not have any notepads!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	*/
	retrieveNotepadInOrder: async function(clientId, npId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		var notepadListObj = {};
		try {
			var filter = { 'clientId': new mongo.ObjectId(clientId) };
			const allNotepadList = await notepad.find(filter).sort({active: -1}).toArray();
			var activeNotepadList = [];
			var inactiveNotepadList = [];
			for (var idx in allNotepadList) {
				var notepad = allNotepadList[idx];
				
				if (npId === "-") {
					if (notepad.active) {
						notepad.selected = true;
						activeNotepadList.push(notepad);
					}
					else {
						notepad.selected = false;
						delete notepad.clientId;
						delete notepad.items;
						inactiveNotepadList.push(notepad);
					}
				}
				else {
					if (notepad._id.toString() === npId.toString()) {
						notepad.selected = true;
						if (notepad.active) {
							activeNotepadList.push(notepad);
						}
						else {
							inactiveNotepadList.push(notepad);
						}
					}
					else {
						notepad.selected = false;
						delete notepad.clientId;
						delete notepad.items;
						if (notepad.active) {
							activeNotepadList.push(notepad);
						}
						else {
							inactiveNotepadList.push(notepad);
						}
					}
				}
			}
			
			notepadListObj["active"] = activeNotepadList;
			notepadListObj["inactive"] = inactiveNotepadList;
			
			return notepadListObj;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('User do not have any notepads!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveNotepads: async function(clientId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { 'clientId': new mongo.ObjectId(clientId) };
			const retrieveNotepadResults = await notepad.find(filter).toArray();
			if (retrieveNotepadResults.length === 0) {
				throw new Error('1');
			}
			return retrieveNotepadResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('User do not have any notepads!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateNotepad: async function(npId, cart_items) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { _id : new mongo.ObjectId(npId) };
			var update_values = { $set: { items: cart_items } };
			const updateNotepadResults = await notepad.update(filter, update_values);
			if (updateNotepadResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateNotepadResults;
		}
		catch (err) {
			console.log(err);
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	removeNotepad: async function(npId) {
		var db = dbConnection.getDb();
		var notepad = db.collection('notepad');
		try {
			var filter = { _id : new mongo.ObjectId(npId) };
			
			// Check if notepad is active or not
			const retrieveNotepadResults = await notepad.find(filter).toArray();
			if (retrieveNotepadResults.length === 0) {
				throw new Error("Invalid notepad id detected!");
			}
			var active = retrieveNotepadResults[0].active;
			var clientId = retrieveNotepadResults[0].clientId;
			if (active) {
				// Set the next following inactive notepad to active
				filter = { clientId : new mongo.ObjectId(clientId), active: false };
				const retrieveInactiveNotepadsResults = await notepad.find(filter).toArray();
				if (retrieveInactiveNotepadsResults.length > 0) {
					var firstInactiveNotepadId = retrieveInactiveNotepadsResults[0]._id;
					filter = { _id : new mongo.ObjectId(firstInactiveNotepadId) };
					var update_values = { $set: { active: true } };
					const updateNotepadActivenessResults = await notepad.update(filter, update_values);
				}
			}
			
			filter = { _id : new mongo.ObjectId(npId) };
			
			const removeNotepadResults = await notepad.remove(filter);
			if (removeNotepadResults.result.n === 0) {
				throw new Error('1');
			}
			return removeNotepadResults;
		}
		catch (err) {
			throw new Error(err.message);
			//throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
};