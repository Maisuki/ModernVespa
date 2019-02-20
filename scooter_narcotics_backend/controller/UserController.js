var mongo = require('mongodb');
var dbConnection = require('./MongoConnection.js');

module.exports = {
	registerUser: async function(username, password, fname, lname, email, billAddress, contact, roleId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var data = { 'username' : username , 'password' : password , 'fname' : fname, 'lname' : lname , 'email' : email, 'billAddress' : billAddress , 'contact' : contact , 'role_id' : roleId , 'created_on' : new Date() };
			var registerResult = await user.insert(data);
			if (registerResult.insertedCount === 0) {
				throw new Error('Registration failed! Please contact the administrator!');
			}
			return registerResult.ops[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	accountActivationLog: async function(username, email, verification_key, clientId) {
		var db = dbConnection.getDb();
		var accountactivationlog = db.collection('accountactivationlog');
		try {
			var data = { username: username, email: email , clientId: new mongo.ObjectId(clientId), verification_key : verification_key , timestamp : new Date() , activated: false };
			var accountActivationLogResult = await accountactivationlog.insert(data);
			if (accountActivationLogResult.insertedCount === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return accountActivationLogResult.ops[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	activateAccount: async function(email, verification_key) {
		var db = dbConnection.getDb();
		var accountactivationlog = db.collection('accountactivationlog');
		try {
			var filter = { email : email , verification_key : verification_key };
			const activateAccountResult = await accountactivationlog.find(filter).toArray();
			if (activateAccountResult.length === 0) {
				throw new Error('Invalid email or verification_key!');
			}
			var update_values = { $set: { activated: true } };
			const updateAccountActivationStatus = await accountactivationlog.update(filter, update_values);
			if (updateAccountActivationStatus.result.nModified === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return true;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	accountApprovalLog: async function(username, email, clientId) {
		var db = dbConnection.getDb();
		var accountapprovallog = db.collection('accountapprovallog');
		try {
			var data = { username: username, email: email, clientId: new mongo.ObjectId(clientId), timestamp: new Date(), approved: false };
			var accountApprovalLogResult = await accountapprovallog.insert(data);
			if (accountApprovalLogResult.insertedCount === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return accountApprovalLogResult.ops[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	updateRelevantInfo: async function(clientId, username, email) {
		var db = dbConnection.getDb();
		var accountapprovallog = db.collection('accountapprovallog');
		var accountactivationlog = db.collection('accountactivationlog');
		try {
			var filter = { clientId: new mongo.ObjectId(clientId) };
			var update_values = { $set: { username: username, email: email } };
			
			accountactivationlog.update(filter, update_values);
			accountapprovallog.update(filter, update_values);
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveUnapprovedAccounts: async function() {
		var db = dbConnection.getDb();
		var accountapprovallog = db.collection('accountapprovallog');
		try {
			var filter = { 'approved' : false };
			const retrieveUnapprovedAccountsResult = await accountapprovallog.find(filter).toArray();
			return retrieveUnapprovedAccountsResult;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	approveAccount: async function(email, username) {
		var db = dbConnection.getDb();
		var accountapprovallog = db.collection('accountapprovallog');
		try {
			var filter = { 'username' : username , 'email' : email };
			const approveAccountResult = await accountapprovallog.find(filter).toArray();
			if (approveAccountResult.length === 0) {
				throw new Error('Invalid email or username detected!');
			}
			var update_values = { $set: { approved: true } };
			const updateAccountApprovalStatus = await accountapprovallog.update(filter, update_values);
			if (updateAccountApprovalStatus.result.nModified === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return true;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveUserBrandDiscountByUsername: async function(username) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { 'username' : username };
			const retrieveUserBrandDiscountByUsernameResult = await user.find(filter).toArray();
			if (retrieveUserBrandDiscountByUsernameResult.length === 0) {
				throw new Error('Invalid username detected!');
			}
			return retrieveUserBrandDiscountByUsernameResult[0].brand_discount;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	updateUserBrandDiscountByUsername: async function(username, brand_discount) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { 'username' : username };
			const retrieveUserBrandDiscountByUsernameResult = await user.find(filter).toArray();
			if (retrieveUserBrandDiscountByUsernameResult.length === 0) {
				throw new Error('1');
			}
			var tierGroup = retrieveUserBrandDiscountByUsernameResult[0].tierGroup;
			
			// Future required codes
			/*
			var discounted_brands = tierGroup.discounted_brands;
			for (var idx = 0; idx < brand_discount.length; idx++) {
				var obj = brand_discount[idx];
				var brand = obj.brand;
				if (!discounted_brands.includes(brand)) {
					discounted_brands.push(brand);
				}
			}
			tierGroup["discounted_brands"] = discounted_brands;
			var update_values = { $set: { tierGroup: tierGroup, brand_discount: brand_discount } };
			*/
			var update_values = { $set: { brand_discount: brand_discount } };
			const updateUserBrandDiscountByUsernameResult = await user.update(filter, update_values);
			if (updateUserBrandDiscountByUsernameResult.result.nModified === 0) {
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid username!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveUserBrandDiscountByUserId: async function(userId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { '_id' : new mongo.ObjectId(userId) };
			const retrieveUserBrandDiscountByUserIdResult = await user.find(filter).toArray();
			if (retrieveUserBrandDiscountByUserIdResult.length === 0) {
				throw new Error('1');
			}
			return retrieveUserBrandDiscountByUserIdResult[0].brand_discount;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid username!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateUserBrandDiscountByUserId: async function(userId, brand_discount) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { '_id' : new mongo.ObjectId(userId) };
			const retrieveUserBrandDiscountByUserIdResult = await user.find(filter).toArray();
			if (retrieveUserBrandDiscountByUserIdResult.length === 0) {
				throw new Error('1');
			}
			var tierGroup = retrieveUserBrandDiscountByUserIdResult[0].tierGroup;
			
			// Future required codes
			/*
			var discounted_brands = tierGroup.discounted_brands;
			for (var idx = 0; idx < brand_discount.length; idx++) {
				var obj = brand_discount[idx];
				var brand = obj.brand;
				if (!discounted_brands.includes(brand)) {
					discounted_brands.push(brand);
				}
			}
			tierGroup["discounted_brands"] = discounted_brands;
			var update_values = { $set: { tierGroup: tierGroup, brand_discount: brand_discount } };
			*/
			var update_values = { $set: { brand_discount: brand_discount } };
			const updateUserBrandDiscountByUserIdResult = await user.update(filter, update_values);
			if (updateUserBrandDiscountByUserIdResult.result.nModified === 0) {
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid userId!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	retrieveDealerTier: async function(userId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id: new mongo.ObjectId(userId) };
			const retrieveDealerTierResult = await user.find(filter).toArray();
			if (retrieveDealerTierResult.length === 0) {
				throw new Error('1');
			}
			return retrieveDealerTierResult[0].tierNo;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid userId detected!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},
	
	setTierInfo: async function(email, username, tierNo) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			if (tierNo < 1 || tierNo > 4) {
				throw new Error('Invalid Tier No detected! Only 1 - 4 allowed!');
			}
			var filter = { email: email, username: username };
			var update_values = { $set: { tierNo: tierNo, discounted_brands: [], discounted_brands_value: [] } };
			const updateTierInfoResult = await user.update(filter, update_values);
			return updateTierInfoResult;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	updateTierInfo: async function(userId, tierNo) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			if (tierNo < 1 || tierNo > 4) {
				throw new Error('1');
			}
			var filter = { _id: new mongo.ObjectId(userId) };
			var update_values = { $set: { tierNo: tierNo } };
			const updateTierInfoResult = await user.update(filter, update_values);
			if (updateTierInfoResult.result.nModified === 0) {
				throw new Error('3');
			}
			return updateTierInfoResult;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid Tier No! Only 1 - 4 allowed!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	updateProductBrandDiscount: async function(userId, tierNo) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		var productbrand = db.collection('productbrand');
		try {
			var filter = { _id: new mongo.ObjectId(userId) };
			const retrieveUserDiscountedBrandsResults = await user.find(filter).toArray();
			if (retrieveUserDiscountedBrandsResults.length === 0) {
				throw new Error('Invalid userId detected!');
			}
			
			var discounted_brands = retrieveUserDiscountedBrandsResults[0].discounted_brands;
			var discounted_brands_value = retrieveUserDiscountedBrandsResults[0].discounted_brands_value;
			
			for (var idx in discounted_brands) {
				var brandName = discounted_brands[idx];
				filter = { name: brandName };
				var retrieveOneResult = await productbrand.find(filter).toArray();
				var selected_discount = 0;
				switch(tierNo) {
					case 1:
						selected_discount = retrieveOneResult[0].tier1;
						break;
					case 2:
						selected_discount = retrieveOneResult[0].tier2;
						break;
					case 3:
						selected_discount = retrieveOneResult[0].tier3;
						break;
					case 4:
						selected_discount = retrieveOneResult[0].tier4;
						break;
				}
				discounted_brands_value[idx] = selected_discount;
			}
			
			filter = { _id: new mongo.ObjectId(userId) };
			var update_values = { $set: { discounted_brands: discounted_brands, discounted_brands_value: discounted_brands_value } };
			const updateTierInfoResult = await user.update(filter, update_values);
			return updateTierInfoResult;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveUserDiscountedBrands: async function(userId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id: new mongo.ObjectId(userId) };
			const retrieveUserDiscountedBrandsResults = await user.find(filter).toArray();
			if (retrieveUserDiscountedBrandsResults.length === 0) {
				throw new Error('1');
			}
			return retrieveUserDiscountedBrandsResults[0].discounted_brands;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid userId detected!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},
	
	updateUserDiscountedBrands: async function(userId, productbrand, discount) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id: new mongo.ObjectId(userId) };
			const retrieveUserResults = await user.find(filter).toArray();
			if (retrieveUserResults.length === 0) {
				throw new Error('1');
			}
			var discountedBrands = retrieveUserResults[0].discounted_brands;
			var discountedBrandsValues = retrieveUserResults[0].discounted_brands_value;
			
			if (discountedBrands.includes(productbrand)) {
				var index = discountedBrands.indexOf(productbrand);
				discountedBrandsValues[index] = discount
			}
			else {
				discountedBrands.push(productbrand);
				discountedBrandsValues.push(discount);
			}
			
			var update_values = { $set: { discounted_brands: discountedBrands, discounted_brands_value: discountedBrandsValues } };
			const updateUserDiscountedBrandsResult = await user.update(filter, update_values);
			return updateUserDiscountedBrandsResult;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid userId detected!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},
	
	retrieveUserProductDiscounts: async function(userId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id: new mongo.ObjectId(userId) };
			const retrieveUserResults = await user.find(filter).toArray();
			if (retrieveUserResults.length === 0) {
				throw new Error('1');
			}
			return retrieveUserResults[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid userId detected!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},
	
	updateAllUsersDiscountedBrands: async function(productbrand, tier1, tier2, tier3, tier4) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { role_id: 909 };
			const retrieveUserResults = await user.find(filter).toArray();
			for (var idx in retrieveUserResults) {
				var userObj = retrieveUserResults[idx];
				var discountedBrands = userObj.discounted_brands;
				if (discountedBrands.includes(productbrand)) {
					var id = userObj._id;
					var index = discountedBrands.indexOf(productbrand);
					var tierNo = userObj.tierNo;
					var discountedBrandsValues = userObj.discounted_brands_value;
					switch (tierNo) {
						case 1:
							discountedBrandsValues[index] = tier1;
							break;
						case 2:
							discountedBrandsValues[index] = tier2;
							break;
						case 3:
							discountedBrandsValues[index] = tier3;
							break;
						case 4:
							discountedBrandsValues[index] = tier4;
							break;
					}
					filter = { _id: new mongo.ObjectId(id) };
					var update_values = { $set: { discounted_brands: discountedBrands, discounted_brands_value: discountedBrandsValues } };
					
					const updateUserDiscountedBrandsResult = await user.update(filter, update_values);
					
					continue;
				}
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid userId detected!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},
	
	
	deleteUserProductDiscounts: async function(userId, productbrand) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id: new mongo.ObjectId(userId) };
			const retrieveUserResults = await user.find(filter).toArray();
			if (retrieveUserResults.length === 0) {
				throw new Error('1');
			}
			var discountedBrands = retrieveUserResults[0].discounted_brands;
			var discountedBrandsValues = retrieveUserResults[0].discounted_brands_value;
			
			if (discountedBrands.includes(productbrand)) {
				var index = discountedBrands.indexOf(productbrand);
				
				discountedBrands.splice(index, 1);
				discountedBrandsValues.splice(index, 1);
			}
			else {
				throw new Error('User do not have this product brand discount');
			}
			
			var update_values = { $set: { discounted_brands: discountedBrands, discounted_brands_value: discountedBrandsValues } };
			const updateUserDiscountedBrandsResult = await user.update(filter, update_values);
			if (updateUserDiscountedBrandsResult.result.nModified === 0) {
				throw new Error('3');
			}
			return updateUserDiscountedBrandsResult;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid userId detected!');
			}
			else {
				throw new Error(err.message);
			}
		}
	},
	
	verifyUserIsActivated: async function(username) {
		var db = dbConnection.getDb();
		var accountactivationlog = db.collection('accountactivationlog');
		var user = db.collection('user');
		try {
			var filter = { username : username };
			const retrieveUserResult = await user.find(filter).toArray();
			if (retrieveUserResult.length === 0) {
				throw new Error('Invalid username detected! Username not registered!');
			}
			if (retrieveUserResult[0].role_id == 999) {
				return true;
			}
			const activateAccountResult = await accountactivationlog.find(filter).toArray();
			if (activateAccountResult.length === 0) {
				throw new Error('Invalid username detected! Username not registered!');
			}
			return activateAccountResult[0].activated;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	verifyUserIsApproved: async function(username) {
		var db = dbConnection.getDb();
		var accountapprovallog = db.collection('accountapprovallog');
		var user = db.collection('user');
		try {
			var filter = { username : username };
			const retrieveUserResult = await user.find(filter).toArray();
			if (retrieveUserResult.length === 0) {
				throw new Error('Invalid username detected! Username not registered!');
			}
			if (retrieveUserResult[0].role_id == 999) {
				return true;
			}
			const activateApprovedResult = await accountapprovallog.find(filter).toArray();
			if (activateApprovedResult.length === 0) {
				throw new Error('Invalid username detected! Username not registered!');
			}
			return activateApprovedResult[0].approved;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	authenticateUser: async function(username, password) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var data = { username : username , password : password };
			var authenticateResult = await user.find(data, { password: 0 }).toArray();
			if (authenticateResult.length === 0) {
				throw new Error('Invalid credentials detected!');
			}
			return authenticateResult[0];
		}
		catch (err) {
			throw new Error(err.message);
		}
	},

	retrieveUser: async function(clientId) {
		if (clientId.trim() === "") {
			return null;
		}
		
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { '_id' : new mongo.ObjectId(clientId) };
			const retrieveUserResult = await user.find(filter, { password: 0 }).toArray();
			if (retrieveUserResult.length === 0) {
				throw new Error('1');
			}
			return retrieveUserResult[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Invalid Client ID detected!');
			}
			else if (err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
				throw new Error('Invalid Client ID detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	retrievePassword: async function(username) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { 'username' : username };
			const verifyUsernameResult = await user.find(filter).toArray();
			if (verifyUsernameResult.length === 0) {
				throw new Error('1');
			}
			return verifyUsernameResult[0].password;
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
	
	retrievePasswordByClientId: async function(clientId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id : new mongo.ObjectId(clientId) };
			const retrieveUserDetails = await user.find(filter).toArray();
			if (retrieveUserDetails.length === 0) {
				throw new Error('Invalid clientId detected!');
			}
			return retrieveUserDetails[0].password;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	verifyUsername: async function(username) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { 'username' : username };
			const verifyUsernameResult = await user.find(filter).toArray();
			if (verifyUsernameResult.length === 0) {
				return false;
			}
			return true;
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

	verifyEmail: async function(email) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { 'email' : email };
			const verifyEmailResult = await user.find(filter).toArray();
			if (verifyEmailResult.length === 0) {
				throw new Error('1');
			}
			return verifyEmailResult[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('This email is not registered!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	generateRandomResetKey: function(length) {
		var resetKey = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for(var i = 0; i < length; i++) {
        	resetKey += possible.charAt(Math.floor(Math.random() * possible.length));
      	}
      	return resetKey;
	},

	forgetPasswordLog: async function(username, email, verification_reset_key) {
		var db = dbConnection.getDb();
		var forgetpasslog = db.collection('forgetpasslog');
		try {
			var data = { 'username' : username , 'email' : email ,'verification_key' : verification_reset_key , 'timestamp' : new Date() };
			var forgetPasswordLogResult = await forgetpasslog.insert(data);
			if (forgetPasswordLogResult.insertedCount === 0) {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
			return forgetPasswordLogResult.ops[0];
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},

	verifyResetKey: async function(verification_reset_key) {
		var db = dbConnection.getDb();
		var forgetpasslog = db.collection('forgetpasslog');
		try {
			var filter = { 'verification_key' : verification_reset_key };
			const verifyResetKeyResult = await forgetpasslog.find(filter).toArray();
		    if (verifyResetKeyResult.length === 0) {
		    	throw new Error('1');
		    }
		    return verifyResetKeyResult[0];
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Verification failed! Invalid key detected!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},

	// KIV
	/*
	verifyResetKey: async function(verification_reset_key, username) {
		var db = dbConnection.getDb();
		var forgetpasslog = db.collection('forgetpasslog');
		try {
			var filter = { 'username': username, 'verification_key' : key };
			const verifyResetKeyResult = await forgetpasslog.find(filter).toArray();
		    if (verifyResetKeyResult.length === 0) {
		    	throw new Error('Verification failed! Invalid Key or Username detected!');
		    }
		    return verifyResetKeyResult[0];
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	*/

	resetPassword: async function(username, newPassword) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { 'username': username };
			var update_values = { $set: { 'password': newPassword } };
			const resetPasswordResult = await user.update(filter, update_values);
			if (resetPasswordResult.result.nModified === 0) {
				throw new Error('1');
			}
			return true;
		}
		catch (err) {
			if (err.message == '1') {
				throw new Error('Reset Password failed! Username is invalid!');
			}
			else {
				throw new Error('Something went wrong! Please contact the administrator!');
			}
		}
	},
	
	changePassword: async function(clientId, newPassword) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id: new mongo.ObjectId(clientId) };
			var update_values = { $set: { password: newPassword } };
			const resetPasswordResult = await user.update(filter, update_values);
			if (resetPasswordResult.result.nModified === 0) {
				throw new Error('clientId is invalid!');
			}
			return true;
		}
		catch (err) {
			throw new Error(err.message);
		}
	},
	
	retrieveCRM: async function(roleId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var aggregate_lookup_value = { $lookup: { from: 'cart', localField: '_id', foreignField: 'clientId', as: 'mycart' } };
			var aggregate_project_value = { $project: { "username": 1, "fname": 1, "lname": 1, "email": 1, "billAddress": 1, "contact": 1, "role_id": 1, "mycart": 1, total: { $cond: { if: { $eq: [ "$mycart.status", "Paid" ] }, then: { $sum: { $map: { input: "$mycart.cart_items", as: "cart_items", in: { $sum: { $map: { input: "$$cart_items", as: "items", in: { $multiply: [ { $ifNull: [ "$$items.qty", 0 ] }, { $ifNull: [ "$$items.price", 0 ] } ] } } } } } } }, else: 0 } } } };			
			var aggregate_match_value = { $match: { "role_id": roleId } };
			
			const retrieveCRMResult = await user.aggregate([ aggregate_lookup_value, aggregate_project_value, aggregate_match_value ]).toArray();
			return retrieveCRMResult;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	retrieveCRMByClientId: async function(roleId, clientId) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var aggregate_lookup_value = { $lookup: { from: 'cart', localField: "_id", foreignField: "clientId", as: "mycart" } };
			var aggregate_project_value = { $project: { "username": 1, "fname": 1, "lname": 1, "email": 1, "billAddress": 1, "contact": 1, "role_id": 1, "mycart.cart_items.qty": 1, "mycart.cart_items.price": 1, total: { $sum: { $map: { input: "$mycart.cart_items", as: "cart_items", in: { $sum: { $map: { input: "$$cart_items", as: "items", in: { $multiply: [ { $ifNull: [ "$$items.qty", 0 ] }, { $ifNull: [ "$$items.price", 0 ] } ] } } } } } } } } };
			var aggregate_match_value = { $match: { "role_id": roleId, _id: new mongo.ObjectId(clientId) } };
			
			const retrieveCRMResult = await user.aggregate([ aggregate_lookup_value, aggregate_project_value, aggregate_match_value ]).toArray();
			return retrieveCRMResult;
		}
		catch (err) {
			throw new Error('Something went wrong! Please contact the administrator!');
		}
	},
	
	updateUserInfo: async function(clientId, fname, lname, username, email, contact, billAddress) {
		var db = dbConnection.getDb();
		var user = db.collection('user');
		try {
			var filter = { _id: new mongo.ObjectId(clientId) };
			var update_values = { $set: { fname: fname, lname: lname, username: username, email: email, contact: contact, billAddress: billAddress } };
			
			const updateUserInfoResult = await user.update(filter, update_values);
			return updateUserInfoResult;
		}
		catch (err) {
			throw new Error(err.message);
		}
	}
};
