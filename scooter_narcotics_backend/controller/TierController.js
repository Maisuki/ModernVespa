var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	addTierGroupRecord: async function(brandList, discountT1, discountT2, discountT3, discountT4, discountT5) {
		var db = dbConnection.getDb();
		var tiergroup = db.collection('tiergroup');
		try {
			var data = { 'discounted_brands' : brandList , 'tier1' : discountT1 , 'tier2' : discountT2, 'tier3' : discountT3 , 'tier4' : discountT4, 'tier5' : discountT5 };
			var addTierGroupRecordResult = await tiergroup.insert(data);
			if (addTierGroupRecordResult.insertedCount === 0) {
				throw new Error('1');
			}
			return addTierGroupRecordResult.ops[0];
		}
		catch (err) {
			console.log(err);
			if (err.message == '1') {
				throw new Error('Adding Tier Group failed! Please contact the administrator!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveTierGroupRecord: async function() {
		var db = dbConnection.getDb();
		var tiergroup = db.collection('tiergroup');
		try {
			var filter = {};
			const retrieveTierGroupRecordResult = await tiergroup.find(filter).toArray();
			return retrieveTierGroupRecordResult;
		}
		catch (err) {
			console.log(err);
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	updateTierDiscount: async function(tierGroupId, discountTier, discountValue) {
		var db = dbConnection.getDb();
		var tiergroup = db.collection('tiergroup');
		try {
			var filter = { _id: new mongo.ObjectId(tierGroupId)};
			var update_values;
			if (discountTier == '1') {
				update_values = { $set: { 'tier1' : discountValue } };
			}
			else if (discountTier == '2') {
				update_values = { $set: { 'tier2' : discountValue } };
			}
			else if (discountTier == '3') {
				update_values = { $set: { 'tier3' : discountValue } };
			}
			else if (discountTier == '4') {
				update_values = { $set: { 'tier4' : discountValue } };
			}
			else if (discountTier == '5') {
				update_values = { $set: { 'tier5' : discountValue } };
			}
			const updateTierDiscountResult = await tiergroup.update(filter, update_values);
			if (updateTierDiscountResult.result.nModified === 0) {
				throw new Error('1');
			}
			return updateTierDiscountResult;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Tier Group ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateTierCategory: async function(tierGroupId, categoryList) {
		var db = dbConnection.getDb();
		var tiergroup = db.collection('tiergroup');
		try {
			var filter = { _id: new mongo.ObjectId(tierGroupId)};
			var update_values = { $set: { 'discounted_brands' : categoryList } };
			const updateTierDiscountResult = await tiergroup.update(filter, update_values);
			if (updateTierDiscountResult.result.nModified === 0) {
				throw new Error('1');
			}
			return updateTierDiscountResult;
		}
		catch (err) {
			console.log(err);
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Tier Group ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveTierBrands: async function(tierGroupId) {
		var db = dbConnection.getDb();
		var tiergroup = db.collection('tiergroup');
		try {
			var filter = { _id: new mongo.ObjectId(tierGroupId) };
			const retrieveTierBrandsResult = await tiergroup.find(filter).toArray();
			if (retrieveTierBrandsResult.length === 0) {
				throw new Error('1');
			}
			return retrieveTierBrandsResult[0].discounted_brands;
		}
		catch (err) {
			console.log(err);
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Tier Group ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
};
