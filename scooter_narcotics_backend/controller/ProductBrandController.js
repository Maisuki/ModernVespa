var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	addProductBrand: async function(name, tier1discountrate, tier2discountrate, tier3discountrate, tier4discountrate) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			tier1discountrate = parseFloat(tier1discountrate).toFixed(2);
			tier2discountrate = parseFloat(tier2discountrate).toFixed(2);
			tier3discountrate = parseFloat(tier3discountrate).toFixed(2);
			tier4discountrate = parseFloat(tier4discountrate).toFixed(2);
			var data = { name: name, tier1: tier1discountrate, tier2: tier2discountrate, tier3: tier3discountrate, tier4: tier4discountrate };
			var addProductBrandResult = await productbrand.insert(data);
			if (addProductBrandResult.insertedCount === 0) {
				throw new Error('1');
			}
			return addProductBrandResult.ops[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	updateImage: async function(pbId, image) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = { _id: new mongo.ObjectId(pbId) };
			var update_values = { $set: { img: image } };
			const updateImageResults = await productbrand.update(filter, update_values);
			return updateImageResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	isValidProductBrandName: async function(pName) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = { name: pName };
			var retrieveOneResult = await productbrand.find(filter).toArray();
			if (retrieveOneResult.length === 0) {
				return false;
			}
			return true;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveOne: async function(pbID) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = { _id: new mongo.ObjectId(pbID) };
			var retrieveOneResult = await productbrand.find(filter).toArray();
			return retrieveOneResult[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveOneByName: async function(pName) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = { name: pName };
			var retrieveOneResult = await productbrand.find(filter).toArray();
			return retrieveOneResult[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	verifyProductBrandNameExists: async function(pName) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = { name : { '$regex': pName, '$options': 'i' } };
			var retrieveOneResult = await productbrand.find(filter).toArray();
			if (retrieveOneResult.length > 0) {
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message === '1') {
				throw new Error('Product Brand Name [' + pName + '] already exists!');
			}
			else {
				return true;
			}
		}
	},
	
	retrieveAll: async function() {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = {};
			var retrieveAllResult = await productbrand.find(filter).sort({name: 1}).toArray();
			return retrieveAllResult;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	updateProductBrand: async function(pbID, name, tier1discountrate, tier2discountrate, tier3discountrate, tier4discountrate) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = { _id: new mongo.ObjectId(pbID) };
			var update = {};
			if (name !== undefined) {
				update['name'] = name;
			}
			if (tier1discountrate !== undefined) {
				update['tier1'] = parseFloat(tier1discountrate).toFixed(2);
			}
			if (tier2discountrate !== undefined) {
				update['tier2'] = parseFloat(tier2discountrate).toFixed(2);
			}
			if (tier3discountrate !== undefined) {
				update['tier3'] = parseFloat(tier3discountrate).toFixed(2);
			}
			if (tier4discountrate  !== undefined) {
				update['tier4'] = parseFloat(tier4discountrate).toFixed(2);
			}
			console.log(update);
			if (!isEmpty(update)) {
				var update_values = { $set: update };
				const updateProductBrandResult = await productbrand.update(filter, update_values);
				return updateProductBrandResult;
			}
			else {
				return true;
			}
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	deleteProductBrand: async function(pbID) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		try {
			var filter = { _id: new mongo.ObjectId(pbID) };
			const deleteProductBrandResults = await productbrand.remove(filter);
			if (deleteProductBrandResults.result.nRemoved === 0) {
				throw new Error('1');
			}
			return deleteProductBrandResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	assignProductBrandDiscount: async function(pbID) {
		var db = dbConnection.getDb();
		var productbrand = db.collection('productbrand');
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(pbID) };
			var retrieveOneResult = await productbrand.find(filter).toArray();
			if (retrieveOneResult.length === 0) {
				throw new Error('1');
			}
			var pbName = retrieveOneResult[0].name;
			var tier1discountrate = retrieveOneResult[0].tier1;
			var tier2discountrate = retrieveOneResult[0].tier2;
			var tier3discountrate = retrieveOneResult[0].tier3;
			var tier4discountrate = retrieveOneResult[0].tier4;
			
			
			filter = { productBrand: pbName };
			var retrieveAllRelatedProductsResult = await products.find(filter).toArray();
			for (var idx = 0; idx < retrieveAllRelatedProductsResult.length; idx++) {
				var product = retrieveAllRelatedProductsResult[idx];
				
				var id = product._id;
				
				var cop = product.cop;
				var gst = product.gst;
				var tier1markup = product.tier1markup;
				var tier2markup = product.tier2markup;
				var tier3markup = product.tier3markup;
				var tier4markup = product.tier4markup;
				
				var tier1markupval = cop * ((100 + tier1markup) / 100.0) * ((100 + gst) / 100.0);
				var tier2markupval = cop * ((100 + tier2markup) / 100.0) * ((100 + gst) / 100.0);
				var tier3markupval = cop * ((100 + tier3markup) / 100.0) * ((100 + gst) / 100.0);
				var tier4markupval = cop * ((100 + tier4markup) / 100.0) * ((100 + gst) / 100.0);
				
				var tier1newdiscountedval = (tier1markupval * ((100.0 - tier1discountrate) / 100.0)).toFixed(2);
				var tier2newdiscountedval = (tier2markupval * ((100.0 - tier2discountrate) / 100.0)).toFixed(2);
				var tier3newdiscountedval = (tier3markupval * ((100.0 - tier3discountrate) / 100.0)).toFixed(2);
				var tier4newdiscountedval = (tier4markupval * ((100.0 - tier4discountrate) / 100.0)).toFixed(2);
				
				filter = { _id: new mongo.ObjectId(id) };
				var update_values = { $set: { tier1discountedprice: parseFloat(tier1newdiscountedval), tier2discountedprice: parseFloat(tier2newdiscountedval), tier3discountedprice: parseFloat(tier3newdiscountedval), tier4discountedprice: parseFloat(tier4newdiscountedval) } };
				
				const updateProductBrandDiscountResult = await products.update(filter, update_values);
				
				if (updateProductBrandDiscountResult.result.nModified === 0) {
					throw new Error('2');
				}
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid pbID detected!');
			}
			else if (err.message == '2') {
				throw new Error('Database faced an issue in updating records! Please inform the administrator!');
			}
			else {
				throw new Error(err.message);
			}
		}
	}
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}