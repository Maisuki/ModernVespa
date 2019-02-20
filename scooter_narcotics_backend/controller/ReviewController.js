var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	retrieveReviews: async function(productId) {
		var db = dbConnection.getDb();
		var reviews = db.collection('reviews');
		try {
			var filter = { productId : new mongo.ObjectId(productId) };
			const retrieveReviewsResult = await reviews.find(filter).toArray();
			return retrieveReviewsResult;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	addReview: async function(productId, reviewer, review, rating) {
		var db = dbConnection.getDb();
		var reviews = db.collection('reviews');
		var products = db.collection('products');
		try {
			var data = { productId : new mongo.ObjectId(productId), reviewer: reviewer, review: review, rating: rating, timestamp: new Date() };
			const addReviewResult = await reviews.insert(data);
			if (addReviewResult.insertedCount === 0) {
				throw new Error('1');
			}
			var filter = { productId: new mongo.ObjectId(productId) };
			const retrieveReviewsByProductIdResult = await reviews.find(filter,{rating:1}).toArray();
			var numberOfReviews = retrieveReviewsByProductIdResult.length;
			if (numberOfReviews !== 0) {
				var averageRating = 0;
				for (var idx = 0; idx < retrieveReviewsByProductIdResult.length; idx++) {
					var item = retrieveReviewsByProductIdResult[idx];
					var itemrating = item.rating;
					averageRating += itemrating;
				}
				averageRating /= numberOfReviews;
				numberOfReviews = averageRating;
			}
			filter = { _id: new mongo.ObjectId(productId) };
			var update_values = { $set: { rating: numberOfReviews } };
			const updateRatingResult = await products.update(filter, update_values);
			/*
			if (updateRatingResult.result.nModified === 0) {
				throw new Error('1');
			}
			*/
			return updateRatingResult;
		}
		catch (err) {
			console.log(err);
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
};