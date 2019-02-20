var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	addBrandNModel: async function(brandName, modelList) {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		try {
			var data = { brand: brandName, modelList: modelList };
			const addBrandNModelResult = await bnm.insert(data);
			if (addBrandNModelResult.insertedCount === 0) {
				throw new Error('1');
			}
			return addBrandNModelResult.ops[0];
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	updateModel: async function(brandName, modelList) {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		try {
			var filter = { brand: brandName };
			var update_values = { $set: { modelList: modelList } };
			const updateModelResults = await bnm.update(filter, update_values);
			if (updateModelResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateModelResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	updateBrandNModel: async function(brandID, brandName, modelList) {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		var filter = { _id: new mongo.ObjectId(brandID) };
		var update_values;

		if (brandName !== undefined && modelList !== undefined) {
			update_values = { $set: { brand: brandName, modelList: modelList } };
		}
		else if (brandName !== undefined) {
			update_values = { $set: { brand: brandName } };
		}
		else {
			update_values = { $set: { modelList: modelList } };
		}

		try {
			const updateBrandNModelResults = await bnm.update(filter, update_values);
			/*if (updateBrandNModelResults.result.nModified === 0 || ) {
				throw new Error('1');
			}*/
			return updateBrandNModelResults;
		}
		catch (err) {
			console.log(err);
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	deleteBrandNModel: async function(brandID) {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		try {
			var filter = { _id: new mongo.ObjectId(brandID) };
			const deleteBrandNModelResults = await bnm.remove(filter);
			if (deleteBrandNModelResults.result.nRemoved === 0) {
				throw new Error('1');
			}
			return deleteBrandNModelResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	getOneBrandNModel: async function(brandID) {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		try {
			var filter = { _id: new mongo.ObjectId(brandID) };
			const getOneBrandNModelResults = await bnm.find(filter).toArray();
			if (getOneBrandNModelResults.length === 0) {
				throw new Error('1');
			}
			return getOneBrandNModelResults[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid brandId detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	retrieveBrandNModelByBrandName: async function(brandName) {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		try {
			var filter = { brand: brandName };
			const retrieveBrandNModelByBrandNameResults = await bnm.find(filter).toArray();
			if (retrieveBrandNModelByBrandNameResults.length === 0) {
				return [];
			}
			return retrieveBrandNModelByBrandNameResults[0].modelList;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	retrieveAllBrandNModels: async function() {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		try {
			var valueFilter = {};
			var attributeDisplayFilter = { brand: 1, modelList: 1, _id: 1 };
			var retrieveAllBrandNModelsResults = await bnm.find(valueFilter,attributeDisplayFilter).sort({brand: 1}).toArray();
			if (retrieveAllBrandNModelsResults.length === 0) {
				throw new Error('No brands and models found! Please contact the administrator!');
			}
			return retrieveAllBrandNModelsResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	retrieveAllBrands: async function() {
		var db = dbConnection.getDb();
		var bnm = db.collection('brandNmodel');
		try {
			var filter = {};
			var attributeDisplayFilter = { brand: 1, _id: 0 };
			var retrieveAllBrandsResults = await bnm.find(filter, attributeDisplayFilter).toArray();
			if (retrieveAllBrandsResults.length === 0) {
				throw new Error('No brands found! Please contact the administrator!');
			}
			var brands = [];
			for (var i = 0; i < retrieveAllBrandsResults.length; i++) {
				brands.push(retrieveAllBrandsResults[i].brand);
			}
			return brands;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
};
