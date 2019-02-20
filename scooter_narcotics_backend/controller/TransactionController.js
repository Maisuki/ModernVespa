var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	createTransaction: async function(cartId, clientId, transactionId, shippingCosts, shippingDetails, paymentType, carrier, service, shipmentInfo, currency) {
		var db = dbConnection.getDb();
		var transaction = db.collection('transaction');
		try {
			var data = { cartId: new mongo.ObjectId(cartId), clientId: new mongo.ObjectId(clientId), transactionId: transactionId, shippingCosts: shippingCosts, shippingDetails: shippingDetails, paymentType: paymentType, carrier: carrier, service: service, shipmentInfo: shipmentInfo, currency: currency, transaction_date: new Date()  };
			const createTransactionResults = await transaction.insert(data);
			if (createTransactionResults.insertedCount === 0) {
				throw new Error('1');
			}
			return createTransactionResults.ops[0];
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Client ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveTransactionByClientID: async function(clientId) {
		var db = dbConnection.getDb();
		var transaction = db.collection('transaction');
		try {
			var aggregate_match_values = { $match: { clientId: new mongo.ObjectId(clientId) } };
			var aggregate_lookup_values = { $lookup: { from: 'cart', localField: 'cartId', foreignField: '_id', as: 'cart' } };
			const retrieveTransactionByClientIDResults = await transaction.aggregate([ aggregate_match_values, aggregate_lookup_values ]).toArray();
			if (retrieveTransactionByClientIDResults.length === 0) {
				throw new Error('1');
			}
			return retrieveTransactionByClientIDResults;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Client ID detected!');
			}
			else if (err.message == '1') {
				throw new Error('No history transactions detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveTransactionByClientID_Month_Year: async function(clientId, yearFilter, monthFilter) {
		var db = dbConnection.getDb();
		var transaction = db.collection('transaction');
		try {
			var aggregate_lookup_values = { $lookup: { from: 'cart', localField: 'cartId', foreignField: '_id', as: 'cart' } };
			var aggregate_project_values = { $project: { paymentType: 0, 'year': { '$year': '$transaction_date' }, 'month': { '$month': '$transaction_date' } } };
			//var aggregate_project_values = { $project: { '_id': 1, 'cartId': 1, 'clientId': 1, 'transactionId': 1, 'shippingId': 1, 'shippingCosts': 1, shippingDetails: 1, 'cart': 1, 'transaction_date': 1, 'year': { '$year': '$transaction_date' }, 'month': { '$month': '$transaction_date' } } };
			var aggregate_match_values = { $match: { year: parseInt(yearFilter), month: parseInt(monthFilter), clientId: new mongo.ObjectId(clientId) } };
			
			const retrieveTransactionByClientID_Month_YearResults = await transaction.aggregate([ aggregate_lookup_values, aggregate_project_values, aggregate_match_values ]).toArray();
			if (retrieveTransactionByClientID_Month_YearResults.length === 0) {
				throw new Error('1');
			}
			return retrieveTransactionByClientID_Month_YearResults;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Client ID detected!');
			}
			else if (err.message == '1') {
				throw new Error('No transactions detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveAllTransactions: async function() {
		var db = dbConnection.getDb();
		var transaction = db.collection('transaction');
		try {
			var aggregate_lookup_values = { $lookup: { from: 'cart', localField: 'cartId', foreignField: '_id', as: 'cart' } };
			const retrieveAllTransactionsResults = await transaction.aggregate([ aggregate_lookup_values ]).toArray();
			if (retrieveAllTransactionsResults.length === 0) {
				throw new Error('1');
			}
			return retrieveAllTransactionsResults;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('No transactions detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');				
			}
		}
	},
	
	retrieveTransactionByTransactionID: async function(transactionId) {
		var db = dbConnection.getDb();
		var transaction = db.collection('transaction');
		try {
			var filter = { _id: new mongo.ObjectId(transactionId) };
			const retrieveTransactionByTransactionIDResults = await transaction.find(filter).toArray();
			if (retrieveTransactionByTransactionIDResults.length === 0) {
				throw new Error('1');
			}
			return retrieveTransactionByTransactionIDResults[0];
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' || err.message == '1') {
				throw new Error('Invalid Transaction ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateAdditionalFieldForWireTransfer: async function(transactionId, courier) {
		var db = dbConnection.getDb();
		var transaction = db.collection('transaction');
		try {
			var filter = { _id: transactionId };
			var update_values = { $set: { courier: courier } };
			const updateAdditionalFieldForWireTransferResults = await transaction.update(filter, update_values);
			if (updateAdditionalFieldForWireTransferResults.result.nModified === 0) {
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' || err.message == '1') {
				throw new Error('Invalid Transaction ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateShipmentInfo: async function(transactionId, shipmentInfo) {
		var db = dbConnection.getDb();
		var transaction = db.collection('transaction');
		try {
			var filter = { _id: new mongo.ObjectId(transactionId) };
			var update_values = { $set: { shipmentInfo: shipmentInfo } };
			const updateShipmentInfoResults = await transaction.update(filter, update_values);
			/*if (updateShipmentInfoResults.result.nModified === 0) {
				throw new Error('1');
			}*/
			return true;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' || err.message == '1') {
				throw new Error('Invalid Transaction ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
};
