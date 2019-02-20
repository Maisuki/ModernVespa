var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	retrievePendingCart: async function(clientId) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var filter = { clientId: new mongo.ObjectId(clientId), status: 'Pending' };
			const retrievePendingCartResults = await cart.find(filter).toArray();
			if (retrievePendingCartResults.length === 0) {
				return null;
			}
			return retrievePendingCartResults[0];
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
	
	retrievePendingCartv2: async function(clientId, ipR, ipL) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			if (clientId === undefined || clientId.trim() === "") {
				clientId = "";
			}
			else {
				clientId = new mongo.ObjectId(clientId);
			}
			if (ipR === undefined || ipR.trim() === "" || ipL === undefined || ipL.trim() === "") {
				throw new Error("ip is required!");
			}
			
			var filter = { $or: [ { $and: [ { clientId: clientId }, { ipR: ipR }, { ipL: ipL }, { status: 'Pending' } ] }, { $and: [ { clientId: clientId }, { status: 'Pending' } ] } ] };
			
			const retrievePendingCartResults = await cart.find(filter).toArray();
			if (retrievePendingCartResults.length === 0) {
				return null;
			}
			return retrievePendingCartResults[0];
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
	
	retrieveCartByCartID: async function(clientId, cartId) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var aggregate_lookup_values = { $lookup: { from: 'transaction', localField: '_id', foreignField: 'cartId', as: 'transaction' } };
			var aggregate_match_values = { $match: { clientId: new mongo.ObjectId(clientId), _id: new mongo.ObjectId(cartId) } };
			//var filter = { "_id" : new mongo.ObjectId(cartId) };
			//const retrieveCartByCartIDResults = await cart.find(filter).toArray();
			const retrieveCartByCartIDResults = await cart.aggregate([ aggregate_match_values, aggregate_lookup_values ]).toArray();
			if (retrieveCartByCartIDResults.length === 0) {
				throw new Error('1');
			}
			return retrieveCartByCartIDResults[0];
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' || err.message == '1') {
				throw new Error('Invalid Cart ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveTransactionIdFromCart: async function(cartId) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var filter = { "_id" : new mongo.ObjectId(cartId) };
			const retrieveTransactionIdFromCartResults = await cart.find(filter).toArray();
			if (retrieveTransactionIdFromCartResults.length === 0) {
				throw new Error('1');
			}
			return retrieveTransactionIdFromCartResults[0].transactionId;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' || err.message == '1') {
				throw new Error('Invalid Cart ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	createNewCart: async function(clientId) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var data = { clientId: new mongo.ObjectId(clientId), created_on: new Date(), cart_items: [], status: "Pending" };
			var createNewCartResults = await cart.insert(data);
			if (createNewCartResults.insertedCount === 0) {
				throw new Error('1');
			}
			return createNewCartResults.ops[0];
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
	
	createNewCartv2: async function(clientId, ipR, ipL) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var data = {};
			if (clientId === "") {
				data["clientId"] = "";
			}
			else {
				data["clientId"] = new mongo.ObjectId(clientId);
			}
			data["ipR"] = ipR;
			data["ipL"] = ipL;
			data["created_on"] = new Date();
			data["cart_items"] = [];
			data["status"] = "Pending";
			
			var createNewCartResults = await cart.insert(data);
			if (createNewCartResults.insertedCount === 0) {
				throw new Error('1');
			}
			return createNewCartResults.ops[0];
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
	
	updateCartItem: function(cart, action, qty, item, price, img, name, weight) {
		if (cart.length ===  0) {
			if (action == "+") {
				cart.push({ item: new mongo.ObjectId(item), name: name, img: img, qty: parseInt(qty), price: parseFloat(price), weight: weight });
				return cart;
			}
			else if (action == "-") {
				throw new Error('Cart is empty! Nothing to remove!');
			}
		}
		var updated = false;
		for (var i in cart) {
			currentItem = cart[i];
			if (currentItem.item == item && action == '+') {
				updated = true;
				var currentQty = parseInt(currentItem.qty);
				currentQty += parseInt(qty);
				currentItem.qty = currentQty;
				break;
			}
			else if (currentItem.item == item && action == '-') {
				updated = true;
				var currentQty = currentItem.qty;
				if (parseInt(currentQty) < parseInt(qty)) {
					throw new Error('Quantity specified is more than what the user have in the cart!');
				}
				currentQty -= qty;
				if (currentQty <= 0) {
					cart.splice(i, 1);
				}
				else {
					currentItem.qty = currentQty;
				}
				break;
			}
		}
		if (action == '-' && !updated) {
			throw new Error('Cart does not contain that item to remove!');
		}
		else if (action == '+' && !updated) {
			cart.push({ item: new mongo.ObjectId(item), name: name, img: img, qty: parseInt(qty), price: parseFloat(price), weight: weight });
		}
		else if (action != '-' && action != '+') {
			throw new Error('Invalid actions detected!');
		}
		return cart;
	},
	
	populateCart: function(cart, obj) {
		if (cart.length === 0) {
			cart.push(obj);
			return cart;
		}
		var updated = false;
		for (var i in cart) {
			var item = cart[i];
			var id = item.item;
			if (id.toString() === obj.item.toString()) {
				var curQty = parseInt(cart[i].qty);
				curQty += parseInt(obj.qty);
				cart[i].qty = curQty;
				updated = true;
				break;
			}
		}
		if (updated) {
			return cart;
		}
		cart.push(obj);
		return cart;
	},
	
	updateCart: async function(cartId, cartItems) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var filter = { _id : cartId };
			var update_values = { $set: { cart_items: cartItems } };
			const updateCartResults = await cart.update(filter, update_values);
			if (updateCartResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateCartResults;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Cart ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	// type 0: Wire Transfer
	// type 1: Complete Payment
	// type 2: Shipped
	// type 3: Partial Shipped
	updateTransactionStatus: async function(cartId, transactionId, type, isAvailable) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		var status = type == 0 ? 'Pending Wire Transfer' : type == 1 ? 'Paid' : type == 2 ? 'Shipped' : 'Partial Shipped';
		try {
			var filter = { _id : new mongo.ObjectId(cartId) };
			var values = {};
			if ((type != 2 && type != 3) && !isAvailable) {
				values['isAvailable'] = isAvailable;
			}
			values['status'] = status;
			if (type != 2 && type != 3) {
				values['transactionId'] = transactionId;
			}
			var update_values = { $set: values };
			const updateWireTransferStatusResults = await cart.update(filter, update_values);
			if (updateWireTransferStatusResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateWireTransferStatusResults;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Cart/Trasaction ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateWireTransferTransactionStatus: async function(cartId) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var filter = { _id : new mongo.ObjectId(cartId) };
			var update_values = { $set: { status: 'Paid' } };
			const updateWireTransferTransactionStatusResults = await cart.update(filter, update_values);
			if (updateWireTransferTransactionStatusResults.result.nModified === 0) {
				throw new Error('1');
			}
			return updateWireTransferTransactionStatusResults;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' || err.message == '1') {
				throw new Error('Invalid Trasaction ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	removeCart: async function(cartId) {
		var db = dbConnection.getDb();
		var cart = db.collection('cart');
		try {
			var filter = { _id : cartId };
			const removeCartResults = await cart.remove(filter);
			if (removeCartResults.result.n === 0) {
				throw new Error('1');
			}
			return removeCartResults;
		}
		catch (err) {
			if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Cart ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
};