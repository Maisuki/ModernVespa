var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	addCategory: async function(categoryName) {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			var data = { name: categoryName };
			var addCategoryResult = await category.insert(data);
			if (addCategoryResult.insertedCount === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return addCategoryResult.ops[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	verifyCategoryID: async function(categoryID) {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			var filter = { _id: new mongo.ObjectId(categoryID) };
			const verifyCategoryIDResult = await category.find(filter).toArray();
			if (verifyCategoryIDResult.length === 0) {
				return false;
			}
			return true;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Client ID detected!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},

	updateCategory: async function(categoryID, newCategoryName) {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			var filter = { _id: new mongo.ObjectId(categoryID) };
			var update_values = { $set: { name: newCategoryName } };
			const updateCategoryResults = await category.update(filter, update_values);
			if (updateCategoryResults.result.nModified === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return updateCategoryResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	deleteCategory: async function(categoryID) {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			var filter = { _id : new mongo.ObjectId(categoryID) };
			const deleteCategoryResults = await category.remove(filter);
			if (deleteCategoryResults.result.nRemoved === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return deleteCategoryResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	retrieveAllCategories: async function() {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			const retrieveAllCategoriesResult = await category.find().sort({ name: 1 }).toArray();
			if (retrieveAllCategoriesResult.length === 0) {
				throw new Error('No categories found! Please contact the administrator!');
			}
			return retrieveAllCategoriesResult;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	retrieveAllCategoryNames: async function() {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			var valueFilter = {};
			var sortFilter = { name: 1 };
			const retrieveAllCategoriesResults = await category.find(valueFilter).sort(sortFilter).toArray();
			if (retrieveAllCategoriesResults.length === 0) {
				throw new Error('No categories found! Please contact the administrator!');
			}
			return retrieveAllCategoriesResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	retrieveOneCategory: async function(categoryID) {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			var filter = { _id : new mongo.ObjectId(categoryID) };
			const retrieveOneCategoryResults = await category.find(filter).toArray();
			if (retrieveOneCategoryResults.length === 0) {
				throw new Error('Invalid category ID detected!');
			}
			return retrieveOneCategoryResults[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	verifyCategoryNameExists: async function(categoryName) {
		var db = dbConnection.getDb();
		var category = db.collection('category');
		try {
			var filter = { name : { '$regex': categoryName, '$options': 'i' } };
			const retrieveOneCategoryResults = await category.find(filter).toArray();
			console.log(retrieveOneCategoryResults);
			if (retrieveOneCategoryResults.length > 0) {
				console.log("hello");
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message === '1') {
				throw new Error('Category Name [' + categoryName + '] already exists!');
			}
			else {
				return true;
			}
		}
	},
};
