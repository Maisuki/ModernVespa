var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	addProductPhase1: async function(name, partNo, category, qty, fmprice, lmprice, weight, sos, ssos, cop, description, isFeatured, productBrand, tier1markup, tier2markup, tier3markup, tier4markup, gst, shippingcosts) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var data = { name: name, cat: category, qty: parseInt(qty), foreignprice: parseFloat(fmprice), localprice: parseFloat(lmprice), weight: parseFloat(weight), sos: sos, ssos: ssos, cop: parseFloat(cop), desc: description, partNo: partNo, rating: 0, featured: isFeatured, productBrand: productBrand, shippingCosts: parseFloat(shippingcosts),  gst: parseInt(gst), tier1markup: parseInt(tier1markup), tier2markup: parseInt(tier2markup), tier3markup: parseInt(tier3markup), tier4markup: parseInt(tier4markup) };
			var addProductPhase1Result = await products.insert(data);
			if (addProductPhase1Result.insertedCount === 0) {
				throw new Error('1');
			}
			return addProductPhase1Result.ops[0];
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	retrieveOneProduct: async function(productID) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			const retrieveOneProductResults = await products.find(filter).toArray();
			if (retrieveOneProductResults.length === 0) {
				throw new Error('1');
			}
			return retrieveOneProductResults[0];
		}
		catch (err) {
			console.log(err);
			if (err.message == '1') {
				throw new Error('Invalid product ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveProdDesc: async function(productID) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			const retrieveOneProductResults = await products.find(filter).toArray();
			if (retrieveOneProductResults.length === 0) {
				throw new Error('1');
			}
			return retrieveOneProductResults[0];
		}
		catch (err) {
			console.log(err);
			if (err.message == '1') {
				throw new Error('Invalid product ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
 	
	retrieveOneProductUser: async function(productID) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		var productbrand = db.collection('productbrand');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			const retrieveOneProductResults = await products.find(filter,{sos:0,ssos:0,cal:0}).toArray();
			if (retrieveOneProductResults.length === 0) {
				throw new Error('Invalid Product ID detected!');
			}
			var data = retrieveOneProductResults[0];
			var productBrand = data["productBrand"];
			filter = { name: productBrand };
			const retrieveProductBrandInfoResults = await productbrand.find(filter).toArray();
			if (retrieveProductBrandInfoResults.length === 0 || retrieveProductBrandInfoResults[0].img === undefined) {
				data['productBrandImg'] = "nil";
			}
			else {
				data['productBrandImg'] = retrieveProductBrandInfoResults[0].img;
			}
			return data;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid product ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveRelatedProductsDetails: async function(relatedProductIDs, productBrand, category, productID) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var results;
			if (relatedProductIDs.length === 0) {
				var filter = { $or: [{ $and: [ { cat: category }, { productBrand: productBrand } ] }, { cat: category }, { productBrand: productBrand }], _id: { $ne: new mongo.ObjectId(productID) } };
				results = await products.find(filter).toArray();
			}
			else {
				var idList = [];
				for (var idx in relatedProductIDs) {
					idList.push(new mongo.ObjectId(relatedProductIDs[idx]));
				}
				var filter = { _id: { $in: idList } };
				results = await products.find(filter).toArray();
			}
			var length = results.length;
			if (length === 3) {
				return results;
			}
			
			var finalList = [];
			var indexList = [];
			while (finalList.length !== 3) {
				var index = Math.floor(Math.random() * length);
				if (!indexList.includes(index)) {
					finalList.push(results[index]);
				}
			}
			return finalList;
		}
		catch (err) {
			console.log(err);
			throw new Error(err.message);
		}
	},

	updateBrandNModel: async function(productID, brandNmodel) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			var update_values = { $set: { brandNmodel: brandNmodel } };
			const updateBrandNModelResults = await products.update(filter, update_values);
			if (updateBrandNModelResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateBrandNModelResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	updateImage: async function(productID, images) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			var update_values = { $set: { img: images } };
			const updateImageResults = await products.update(filter, update_values);
			return updateImageResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	updateRelatedProducts: async function(productID, relatedProductList) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			var update_values = { $set: { relatedProducts: relatedProductList } };
			const updateRelatedProductsResults = await products.update(filter, update_values);
			return updateRelatedProductsResults;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveRelatedProducts: async function(productID) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			const relatedProductsResults = await products.find(filter).toArray();
			if (relatedProductsResults.length === 0) {
				throw new Error("Invalid product ID detected!");
			}
			return relatedProductsResults[0].relatedProducts;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	retrieveAllProducts: async function() {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			const retrieveAllProductsResults = await products.find({}).toArray();
			if (retrieveAllProductsResults.length === 0) {
				throw new Error('1');
			}
			return retrieveAllProductsResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	retrieveLatestProducts: async function() {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			const retrieveLatestProductsResults = await products.find().sort({_id:-1}).toArray();
			if (retrieveLatestProductsResults.length === 0) {
				throw new Error('1');
			}
			return retrieveLatestProductsResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	retrieveAllProductsUser: async function(filter) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			const retrieveAllProductsUserResults = await products.find({},{ img: 0}).toArray();
			if (retrieveAllProductsUserResults.length === 0) {
				throw new Error('1');
			}
			return retrieveAllProductsUserResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No products found! Please contact the administrator!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	retrieveAllProductsAdvancedSearch: async function(filter, skip, limit) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			const retrieveAllProductsAdvancedSearchResults = await products.find(filter).skip(skip).limit(limit).toArray();
			if (retrieveAllProductsAdvancedSearchResults.length === 0) {
				throw new Error('1');
			}
			return retrieveAllProductsAdvancedSearchResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No products found! Please contact the administrator!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveAllFeaturedProducts: async function() {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var retrieveFeaturedProductsResults = await products.find({ featured: true }).toArray();
			if (retrieveFeaturedProductsResults.length === 0) {
				throw new Error('1');
			}
			return retrieveFeaturedProductsResults;
		}
		catch(err) {
			if (err.message == '1') {
				throw new Error('No products found! Please contact the administrator!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveFeaturedProducts: async function(skip, limit) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var retrieveFeaturedProductsResults = await products.find({ featured: true }).skip(skip).limit(limit).toArray();
			if (retrieveFeaturedProductsResults.length === 0) {
				var another = await products.find().limit(6).toArray();
				if (another.length === 0) {
					throw new Error('1');
				}
				retrieveFeaturedProductsResults = another;
			}
			return retrieveFeaturedProductsResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No products found! Please contact the administrator!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	updateProductCatOne: async function(productID, name, partNo, category, qty, fmPrice, lmPrice, weight, sos, ssos, cop, desc, isFeatured, brand, tier1markup, tier2markup, tier3markup, tier4markup, gst, shippingcosts, bnm) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			var update = {};
			if (name !== undefined) {
				update['name'] = name;
			}
			if (partNo !== undefined) {
				update['partNo'] = partNo;
			}
			if (category !== undefined) {
				update['cat'] = category;
			}
			if (qty !== undefined) {
				update['qty'] = parseInt(qty);
			}
			if (fmPrice  !== undefined) {
				update['foreignprice'] = parseFloat(fmPrice);
			}
			if (lmPrice !== undefined) {
				update['localprice'] = parseFloat(lmPrice);
			}
			if (weight !== undefined) {
				update['weight'] = parseFloat(weight);
			}
			if (sos !== undefined) {
				update['sos'] = sos;
			}
			if (ssos !== undefined) {
				update['ssos'] = ssos;
			}
			if (cop !== undefined) {
				update['cop'] = parseFloat(cop);
			}
			if (desc !== undefined) {
				update['desc'] = desc;
			}
			if (bnm !== undefined && bnm.trim().length !== 0) {
				update['brandNmodel'] = JSON.parse(bnm);
			}
			if (isFeatured !== undefined) {
				if (isFeatured === "true" || isFeatured === true) {
					isFeatured = true;
				}
				else {
					isFeatured = false;
				}
				update['featured'] = isFeatured;
			}
			if (brand !== undefined) {
				update['productBrand'] = brand;
			}
			if (gst !== undefined) {
				update['gst'] = parseInt(gst);
			}
			if (tier1markup !== undefined) {
				update['tier1markup'] = parseInt(tier1markup);
			}
			if (tier2markup !== undefined) {
				update['tier2markup'] = parseInt(tier2markup);
			}
			if (tier3markup !== undefined) {
				update['tier3markup'] = parseInt(tier3markup);
			}
			if (tier4markup !== undefined) {
				update['tier4markup'] = parseInt(tier4markup);
			}
			/*
			if (tier1discountedprice !== undefined) {
				update['tier1discountedprice'] = parseFloat(tier1discountedprice);
			}
			if (tier2discountedprice !== undefined) {
				update['tier2discountedprice'] = parseFloat(tier2discountedprice);
			}
			if (tier3discountedprice !== undefined) {
				update['tier3discountedprice'] = parseFloat(tier3discountedprice);
			}
			if (tier4discountedprice !== undefined) {
				update['tier4discountedprice'] = parseFloat(tier4discountedprice);
			}
			*/
			if (shippingcosts !== undefined) {
				update['shippingCosts'] = parseFloat(shippingcosts);
			}
			if (!isEmpty(update)) {
				var update_values = { $set: update };
				const updateProductCatOneResult = await products.update(filter, update_values);
				/*if (updateProductCatOneResult.result.nModified === 0) {
					throw new Error('1');
				}*/
				return updateProductCatOneResult;
			}
			else {
				return true;
			}
		}
		catch (err) {
			console.log(err);
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	productSearch: async function(category, brand, model) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = {};
			if (category.length !== 0) {
				filter['cat'] = category;
			}
			if (brand.length !== 0) {
				filter['brandNmodel'] = { $elemMatch: { brand: brand } };
			}
			if (model.length !== 0) {
				filter['brandNmodel.modelList'] = model;
			}
			const productSearchResults = await products.find(filter).toArray();
			if (productSearchResults.length === 0) {
				throw new Error('1');
			}
			return productSearchResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No results found based on the search criteria!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	wildSearch: async function(query) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { $or: [ { name: { $regex: ".*" + query + ".*", $options: "i" } }, { productBrand: { $regex: ".*" + query + ".*", $options: "i" } }, { partNo: { $regex: ".*" + query + ".*", $options: "i" } } ] };
			const productSearchResults = await products.find(filter).toArray();
			if (productSearchResults.length === 0) {
				throw new Error('1');
			}
			return productSearchResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No results found based on the search criteria!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	wildSearchAdvanced: async function(query, skip, limit) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { $or: [ { name: { $regex: ".*" + query + ".*", $options: "i" } }, { productBrand: { $regex: ".*" + query + ".*", $options: "i" } }, { partNo: { $regex: ".*" + query + ".*", $options: "i" } } ] };
			const wildSearchAdvancedResults = await products.find(filter).skip(skip).limit(limit).toArray();
			if (wildSearchAdvancedResults.length === 0) {
				throw new Error('1');
			}
			return wildSearchAdvancedResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No results found based on the search criteria!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	superSearch: async function(query) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var criterias = [ "name", "productBrand", "partNo", "cat", "desc", "brandNmodel.brand", "brandNmodel.modelList" ];
			var partnerList = generatePartners(criterias);
			
			var orFilter = [];
			// Basic search
			for (var idx in criterias) {
				var criteria = criterias[idx];
				var obj = {};
				if (criteria == "brandNmodel.modelList") {
					obj[criteria] = { $elemMatch: { $regex: ".*" + query + ".*", $options: "i" } };
				}
				else {
					obj[criteria] = { $regex: ".*" + query + ".*", $options: "i" };
				}
				orFilter.push(obj);
			}
			
			// Advanced search			
			if (query.indexOf(" ") > -1) {
				var splittedquery = query.split(" ");
				
				var partners = generatePartners(criterias, splittedquery.length);
				// clockwise
				
				for (var idx in partners) {
					var partner = partners[idx];
					var andFilter = [];
					for (var i = 0; i < partner.length; i++) {
						var partnerField = partner[i];
						var currentQuery = splittedquery[i];
						var obj = {};
						if (partnerField == "brandNmodel.modelList") {
							obj[partnerField] = { $elemMatch: { $regex: ".*" + currentQuery + ".*", $options: "i" } };
						}
						else {
							obj[partnerField] = { $regex: ".*" + currentQuery + ".*", $options: "i" };
						}
						andFilter.push(obj);
					}
					orFilter.push({ $and: andFilter });
				}
				// anticlockwise
				for (var idx in partners) {
					var partner = partners[idx];
					var andFilter = [];
					var index = 0;
					for (var i = (partner.length - 1); i >= 0; i--) {
						var partnerField = partner[i];
						var currentQuery = splittedquery[index++];
						var obj = {};
						if (partnerField == "brandNmodel.modelList") {
							obj[partnerField] = { $elemMatch: { $regex: ".*" + currentQuery + ".*", $options: "i" } };
						}
						else {
							obj[partnerField] = { $regex: ".*" + currentQuery + ".*", $options: "i" };
						}
						andFilter.push(obj);
					}
					orFilter.push({ $and: andFilter });
				}
			}
			var filter = { $or: orFilter };
			const superSearchResults = await products.find(filter).toArray();
			if (superSearchResults.length === 0) {
				throw new Error('1');
			}
			return superSearchResults;
		}
		catch (err) {
			console.log(err);
			if (err.message == '1') {
				throw new Error('No results found based on the search criteria!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	superSearchAdvanced: async function(query, skip, limit) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var criterias = [ "name", "productBrand", "partNo", "cat", "desc", "brandNmodel.brand", "brandNmodel.modelList" ];
			var partnerList = generatePartners(criterias);
			
			var orFilter = [];
			// Basic search
			for (var idx in criterias) {
				var criteria = criterias[idx];
				var obj = {};
				if (criteria == "brandNmodel.modelList") {
					obj[criteria] = { $elemMatch: { $regex: ".*" + query + ".*", $options: "i" } };
				}
				else {
					obj[criteria] = { $regex: ".*" + query + ".*", $options: "i" };
				}
				orFilter.push(obj);
			}
			
			// Advanced search			
			if (query.indexOf(" ") > -1) {
				var splittedquery = query.split(" ");
				
				var partners = generatePartners(criterias, splittedquery.length);
				// clockwise
				
				for (var idx in partners) {
					var partner = partners[idx];
					var andFilter = [];
					for (var i = 0; i < partner.length; i++) {
						var partnerField = partner[i];
						var currentQuery = splittedquery[i];
						var obj = {};
						if (partnerField == "brandNmodel.modelList") {
							obj[partnerField] = { $elemMatch: { $regex: ".*" + currentQuery + ".*", $options: "i" } };
						}
						else {
							obj[partnerField] = { $regex: ".*" + currentQuery + ".*", $options: "i" };
						}
						andFilter.push(obj);
					}
					orFilter.push({ $and: andFilter });
				}
				// anticlockwise
				for (var idx in partners) {
					var partner = partners[idx];
					var andFilter = [];
					var index = 0;
					for (var i = (partner.length - 1); i >= 0; i--) {
						var partnerField = partner[i];
						var currentQuery = splittedquery[index++];
						var obj = {};
						if (partnerField == "brandNmodel.modelList") {
							obj[partnerField] = { $elemMatch: { $regex: ".*" + currentQuery + ".*", $options: "i" } };
						}
						else {
							obj[partnerField] = { $regex: ".*" + currentQuery + ".*", $options: "i" };
						}
						andFilter.push(obj);
					}
					orFilter.push({ $and: andFilter });
				}
			}
			var filter = { $or: orFilter };
			
			const superSearchAdvancedResults = await products.find(filter).skip(skip).limit(limit).toArray();
			if (superSearchAdvancedResults.length === 0) {
				throw new Error('1');
			}
			return superSearchAdvancedResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No results found based on the search criteria!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateProductCatTwo: async function(productID, curList) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			var update_values = { $set: { 'img': curList  } };
			const updateProductCatOneResult = await products.update(filter, update_values);
			if (updateProductCatOneResult.result.nModified === 0) {
				throw new Error('1');
			}
			return updateProductCatOneResult;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	deleteProduct: async function(productID) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			const deleteProductResults = await products.remove(filter);
			if (deleteProductResults.result.nRemoved === 0) {
				throw new Error('1');
			}
			return deleteProductResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	checkProductAvailability: async function(productID, qty) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			const findProductResults = await products.find(filter).toArray();
			if (findProductResults.length === 0) {
				throw new Error('1');
			}
			if (findProductResults[0].qty < qty) {
				//throw new Error("Product [" + findProductResults[0].name + "] does not sufficient quantity! We only have " + findProductResults[0].qty + " left in our storage.");
				throw new Error(findProductResults[0].qty);
			}
			return true;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	reduceQty: async function(productID, qtyRequired) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			const productSearchResult = await products.find(filter).toArray();
			if (productSearchResult.length === 0) {
				throw new Error('1');
			}
			var productInfo = productSearchResult[0];
			var qty = productInfo.qty;
			var remainingQty = qty - qtyRequired;
			
			var update_values = { $set: { qty: remainingQty } };
			const updateQtyResults = await products.update(filter, update_values);
			if (updateQtyResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateQtyResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid product ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	updateAllImages: async function(productID, imageList) {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = { _id: new mongo.ObjectId(productID) };
			var update_values = { $set: { img: imageList } };
			const updateImageResults = await products.update(filter, update_values);
			if (updateImageResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateImageResults;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	retrieveRecentlyAdded: async function() {
		var db = dbConnection.getDb();
		var products = db.collection('products');
		try {
			var filter = {};
			var sort_values = { $natural: -1 };
			const retrieveRecentlyAddedLResults = await products.find(filter).sort(sort_values).limit(5).toArray();
			if (retrieveRecentlyAddedLResults.length === 0) {
				throw new Error('1');
			}
			return retrieveRecentlyAddedLResults;
		}
		catch (err) {
			console.log(err);
			throw new Error('Something went wrong! Please contact the administrator!');
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

function generatePartners(criterias, numInGroups) {
	var num = criterias.length;
	var partnerList = [];
	
	for (var i = 0; i < num; i++) {
		var cur = criterias[i];
		var new_list = criterias.slice(i + 1);
		
		groupUp(cur, new_list, partnerList, numInGroups);
		/*
		for (var j = (i + 1); j < num; j++) {
			var another = criterias[j];
			partnerList.push({ c1: cur, c2: another });
		}*/
	}
	return partnerList;
}

function groupUp(cur, new_list, storage, numInGroups) {
	for (var i = 0; i < new_list.length; i++) {
		var arr = [];
		arr.push(cur);
		arr.push(new_list[i]);
		if (arr.length < numInGroups) {
			var another = new_list.slice(i + 1);
			addLastFew(arr, another, storage, numInGroups);
		}
		else {
			storage.push(arr);
		}
	}
}

function addLastFew(cur, new_list, storage, numInGroups) {
	for (var i = 0; i < new_list.length; i++) {
		var temp_cur = cur.slice(0);
		temp_cur.push(new_list[i]);
		if (temp_cur.length < numInGroups) {
			if ((i + 1) < new_list.length) {
				var another = new_list.slice(i + 1);
				addLastFew(temp_cur, another, storage, numInGroups);
			}
		}
		else {
			storage.push(temp_cur);
		}
	}
}