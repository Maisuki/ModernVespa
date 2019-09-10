express = require('express');
var request = require('request-promise');
var app = express();

var http = require('http');
var https = require('https');

var fs = require('fs');
//var basicAuth = require('basic-auth');
var base64ToImage = require('base64-to-image');

/** NEED TO REPLACE THE KEYS **/
var pkey = fs.readFileSync('/etc/cloudflare/private-key/private-key.pem');
var pcert = fs.readFileSync('/etc/cloudflare/origin-cert/origin-cert.pem');
var pca = fs.readFileSync('/etc/cloudflare/ca/ca.pem');
var options = {
	key: pkey,
	cert: pcert,
	ca: pca
};

var bcrypt = require('bcrypt');
const saltRounds = 10;
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var dbConnection = require("./controller/MongoConnection.js");
var bnmController = require("./controller/BrandModelController.js");
var categoryController = require("./controller/CategoryController.js");
var cartController = require("./controller/CartController.js");
var notepadController = require("./controller/NotepadController.js");
var productBrandController = require("./controller/ProductBrandController.js");
var productController = require("./controller/ProductController.js");
var reviewController = require("./controller/ReviewController.js");
var roleController = require("./controller/RoleController.js");
var shippingController = require("./controller/ShippingController.js");
//var tierController = require("./controller/TierController.js");
var transactionController = require("./controller/TransactionController.js");
var userController = require("./controller/UserController.js");
var zombieController = require("./controller/ZombieController.js");
var url = "mongodb://localhost:27017";

var allRoles, allCategories, exchangeRatesData;

app.set('httpsport', (process.env.PORT || 2053));
app.set('httpport', (process.env.PORT || 2052));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
/*
var auth = function (req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	};

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	if (user.name === 'foo' && user.pass === 'bar') {
		return next();
	} else {
		return unauthorized(res);
	};
};
*/
app.get('/', function(request, response) {
	response.send('Hello World!');
});

/***** USER MODULE *****/

app.post('/register', async function(req, res) {
	/***** RETRIEVE USER DETAILS *****/
	var body = req.body;
	var username = body.username;
	var password = body.password;
	var fname = body.fname;
	var lname = body.lname;
	var email = body.email;
	var billAddress = body.billAddress;
	var contact = body.contact;
	var role = body.role;

	/***** VERIFY IF ALL DETAILS ARE PRESENT *****/
	if (username === undefined || username.trim().length === 0 || password === undefined || password.trim().length === 0 || 
		fname === undefined || fname.trim().length === 0 || lname === undefined || lname.trim().length === 0 || 
		email === undefined || email.trim().length === 0 || billAddress === undefined || billAddress.trim().length === 0 || 
		contact === undefined || contact.trim().length === 0 || role === undefined || role.trim().length === 0) {
		res.json({ status: false , message: 'Registration failed! Some fields are not detected! The following field are required: Username, Password, First Name, Last Name, Email, Billing Address, Contact and Role are required! Please check!' });
		return;
	}

	/***** DETERMINE THE ROLE ID BASED ON THE ROLE NAME GIVEN *****/
	var roleId = getRoleID(role);
	if (roleId == -1) {
		res.json( { status : false , message : 'Invalid role detected!' });
		return;
	}
	
	billAddress = JSON.parse(billAddress);
	
	/***** EXECUTE THE REGISTRATION PROCESS *****/
	try {
		// Verify username if it exists or not
		const isUserExists = await userController.verifyUsername(username);

		// Username exists!
		if (isUserExists) {
			res.json({ status: false, message: 'Registration failed! Username already exist!' });
			return;
		}

		var salt = bcrypt.genSaltSync(saltRounds);
		var hashedPassword = bcrypt.hashSync(password, salt);
		
		// Username is free to be used!
		// Register now!
		const registrationResult = await userController.registerUser(username, hashedPassword, fname, lname, email, billAddress, contact, roleId);
		var key = userController.generateRandomResetKey(45);
		const insertActivationLogResults = await userController.accountActivationLog(username, email, key, registrationResult._id);
		if (role == "Dealer") {
			const insertApprovalAccountResults = await userController.accountApprovalLog(username, email, registrationResult._id);
		}
		res.json({ status: true , message: 'Successfully registered..An account activation email has been sent to the following email address: ' + email, 'user': registrationResult, key: key });
	}
	// Registration failed!
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateUserDetails', async function(req, res) {
	/***** RETRIEVE USER DETAILS *****/
	var clientId = req.body.clientId;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var username = req.body.username;
	var email = req.body.email;
	var contact = req.body.contact;
	var billAddress = req.body.billAddress;

	/***** VERIFY IF ALL DETAILS ARE PRESENT *****/
	if (fname === undefined || fname.trim().length === 0 ||
		lname === undefined || lname.trim().length === 0 || 
		username === undefined || username.trim().length === 0 ||
		email === undefined || email.trim().length === 0 ||
		contact === undefined || contact.trim().length === 0 ||
		billAddress === undefined || billAddress.trim().length === 0) {
		res.json({ status: false , message: 'fname, lname, username, email, contact and billAddress are required!' });
		return;
	}
	
	billAddress = JSON.parse(billAddress);
	
	/***** EXECUTE THE REGISTRATION PROCESS *****/
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		
		// Verify username if it exists or not
		const isUserExists = await userController.verifyUsername(username);

		// Username exists!
		if (isUserExists) {
			res.json({ status: false, message: 'Username already exist! Please choose another username!' });
			return;
		}
		
		// Username is free to be used!
		const updateUserInfoResults = await userController.updateUserInfo(clientId, fname, lname, username, email, contact, billAddress);
		const updateRelevantInfo = await userController.updateRelevantInfo(clientId, username, email);
		res.json({ status: true , message: 'Successfully updated your information.' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveUser', async function(req, res) {
	var clientId = req.body.clientId;
	
	if (clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: "clientId is required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const userDetails = await userController.retrieveUser(clientId);
		res.json({ status: true , user: userDetails });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/activateAccount', async function(req, res) {
	var email = req.body.email;
	var verification_key = req.body.key;
	
	if (email === undefined || email.trim().length === 0 ||
		verification_key === undefined || verification_key.trim().length === 0) {
		res.json({ status: false, message: "Email and Key are required!" });
		return;
	}
	
	try {
		const accountActivationResults = await userController.activateAccount(email, verification_key);
		res.json({ status: true, message: "Successfully verified! You may log in now!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/login', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	
	if (username === undefined || username.trim().length === 0 || password === undefined || password.trim().length === 0) {
		res.json({ status: false, message: "Login failed! Username and Password are required!" });
		return;
	}

	try {
		const checkAccountIfActivated = await userController.verifyUserIsActivated(username);
		if (!checkAccountIfActivated) {
			throw new Error('Account is not activated!');
		}
		
		const accountPassword = await userController.retrievePassword(username);
		if (!bcrypt.compareSync(password, accountPassword)) {
			throw new Error('Incorrect Password detected!');
		}
		const loginResult = await userController.authenticateUser(username, accountPassword);
		
		var role_id = loginResult.role_id;
		if (role_id === 909) {	
			const checkAccountIfApproved = await userController.verifyUserIsApproved(username);
			if (!checkAccountIfApproved) {
				throw new Error('Account is not approved!');
			}
		}
		res.json({ status: true, message: "Successfully logged in", user: loginResult, role: getRoleName(loginResult.role_id) });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/loginv2', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var ipR = req.body.remoteIP;
	var ipL = req.body.localIP;
	
	if (username === undefined || username.trim().length === 0 || password === undefined || password.trim().length === 0 ||
		ipR === undefined || ipR.trim().length === 0 || ipL === undefined || ipL.trim().length === 0) {
		res.json({ status: false, message: "Login failed! Username and Password are required!" });
		return;
	}

	try {
		const checkAccountIfActivated = await userController.verifyUserIsActivated(username);
		if (!checkAccountIfActivated) {
			throw new Error('Account is not activated!');
		}
		
		const accountPassword = await userController.retrievePassword(username);
		if (!bcrypt.compareSync(password, accountPassword)) {
			throw new Error('Incorrect Password detected!');
		}
		const loginResult = await userController.authenticateUser(username, accountPassword);
		
		var role_id = loginResult.role_id;
		if (role_id === 909) {	
			const checkAccountIfApproved = await userController.verifyUserIsApproved(username);
			if (!checkAccountIfApproved) {
				throw new Error('Account is not approved!');
			}
		}
		
		// Check if there's a need to merge cart
		var clientId = "";
		// Retrieve offline cart
		const pendingCartOffline = await cartController.retrievePendingCartv2(clientId, ipR, ipL);
		// if there's a offline cart with items, merge with the current authenticated one and remove the offline one
		if (pendingCartOffline != null && pendingCartOffline.cart_items.length > 0) {
			// Retrieve authenticated cart
			const pendingCartAuthenticated = await cartController.retrievePendingCartv2(loginResult._id.toString(), ipR, ipL);
			
			var authenticatedCartId;
			var authenticatedCartItems;
			
			if (pendingCartAuthenticated == null) {
				//  Create a new cart
				const createNewCartResults = await cartController.createNewCartv2(clientId, ipR, ipL);
				authenticatedCartId = new mongo.ObjectId(createNewCartResults.ops[0]._id);
				authenticatedCartItems = createNewCartResults.ops[0].cart_items;
			}
			else {
				authenticatedCartId = new mongo.ObjectId(pendingCartAuthenticated._id);
				authenticatedCartItems = pendingCartAuthenticated.cart_items;
			}
			
			var offlineCartId = pendingCartOffline._id;
			var offlineCartItems = pendingCartOffline.cart_items;
			
			// Consolidate all items from two carts
			for (var idx in offlineCartItems) {
				authenticatedCartItems = cartController.populateCart(authenticatedCartItems, offlineCartItems[idx]);
			}
			// Update authenticated cart
			const updateCartResults = await cartController.updateCart(authenticatedCartId, authenticatedCartItems);
			
			// Remove offline cart
			await cartController.removeCart(offlineCartId);
		}
		
		res.json({ status: true, message: "Successfully logged in", user: loginResult, role: getRoleName(loginResult.role_id) });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/verifyUser', async function(req, res) {
	var email = req.body.email;

	if (email === undefined || email.trim().length === 0) {
		res.json({ status: false, message: "Verification failed! Email is required!" });
		return;
	}
	try {
		const verifyEmailResult = await userController.verifyEmail(email);
		var username = verifyEmailResult.username;
		var fname = verifyEmailResult.fname;
		var lname = verifyEmailResult.lname;

		// Generate a key for verification purposes
		var verification_reset_key = userController.generateRandomResetKey(45);

		const forgetPasswordLogResult = await userController.forgetPasswordLog(username, email, verification_reset_key);

		var response = { 'name' : fname + " " + lname , 'key' : verification_reset_key };
		res.json({ status: true, message: "Successfully verified", response: response });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/verifyKey', async function(req, res) {
	var key = req.body.key;
	// KIV
	// var username = req.body.username;

	if (key === undefined || key.trim().length === 0) {
		res.json({ status: false, message: "Verification failed! Key is required!" });
		return;
	}

	// KIV
	/*if (key === undefined || username === undefined) {
		res.json({ status: false, message: "Verification failed! Key and Username are required!" });
		return;
	}*/

	try {
		const verifyResetKeyResult = await userController.verifyResetKey(key);
		// KIV
		//const verifyResetKeyResult = await userController.verifyResetKey(key, username);
		res.json({ status: true, message: "Successfully verified", response: verifyResetKeyResult });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/resetPassword', async function(req, res) {
	var password = req.body.password;
	var cfmPassword = req.body.cfmPassword;
	var username = req.body.username;

	if (password === undefined || password.trim().length === 0 ||
		cfmPassword === undefined || cfmPassword.trim().length === 0 ||
		username === undefined || username.trim().length === 0) {
		res.json({ status: false, message: 'Reset Password failed! Username, Password and Confirm Password are required!' });
		return;
	}

	if (password != cfmPassword) {
		res.json({ status: false, message: 'Reset Password failed! Password and Confirm Password are not the same!' });
		return;
	}

	try {
		// Verify username if it exists or not
		const isUserExists = await userController.verifyUsername(username);
		if (!isUserExists) {
			res.json({ status: false, message: 'Reset Password failed! Invalid username detected!' });
			return;
		}
		
		var salt = bcrypt.genSaltSync(saltRounds);
		var hashedPassword = bcrypt.hashSync(password, salt);
		
		const resetPasswordResult = await userController.resetPassword(username, hashedPassword);
		res.json({ status: true, message: 'Password updated successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/changePassword', async function(req, res) {
	var clientId = req.body.clientId;
	var currentPassword = req.body.currentPass;
	var newPassword = req.body.newPass;
	var cfmPassword = req.body.cfmPass;
	
	if (clientId === undefined || clientId.trim().length === 0 ||
		currentPassword === undefined || currentPassword.trim().length === 0 ||
		newPassword === undefined || newPassword.trim().length === 0 ||
		cfmPassword === undefined || cfmPassword.trim().length === 0) {
		res.json({ status: false, message: 'clientId, currentPass, newPass and cfmPass are required!' });
		return;
	}
	
	try {
		// verify if the current password is correct
		const accountPassword = await userController.retrievePasswordByClientId(clientId);
		if (!bcrypt.compareSync(currentPassword, accountPassword)) {
			throw new Error('Incorrect Current Password detected!');
		}
		
		if (newPassword != cfmPassword) {
			throw new Error("New password doesn't match Confirm Password!");
		}
		
		var salt = bcrypt.genSaltSync(saltRounds);
		var hashedPassword = bcrypt.hashSync(newPassword, salt);
		
		const resetPasswordResult = await userController.changePassword(clientId, hashedPassword);
		res.json({ status: true, message: 'Password updated successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/bnm', async function(req, res) {
	try {
		const allBnMs = await bnmController.retrieveAllBrandNModels();
		res.json({ status: true, bnm: allBnMs });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/products', async function(req, res) {
	var filter = req.query.filter === undefined || req.query.filter.trim().length === 0 ? {} : { cat : req.query.filter };
	var page = req.query.page;
	var skip = 0;
	var currentPage = 1;

	try {
		if (page !== undefined && page.trim().length !== 0) {
			if (isNaN(page)) {
				throw new Error('Page must be a number!');
			}
			currentPage = parseInt(page);
			skip = (parseInt(page) - 1) * 9;
		}
		const allProducts = await productController.retrieveAllProductsUser(filter);
		var totalPages = Math.ceil(allProducts.length / 9);
		if (page > totalPages) {
			throw new Error('Only ' + totalPages + ' pages are available to query!');
		}
		const searchResults = await productController.retrieveAllProductsAdvancedSearch(filter, skip, 9);
		var currency = req.query.currency;
		if (currency === undefined || currency.trim() === undefined || currency.trim().toLowerCase() === 'sgd') {
			res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
			return;
		}
		if (currency.trim().toLowerCase() === 'vnd' || currency.trim().toLowerCase() === 'twd') {
			currency = 'usd';
		}
		var results = exchangeRatesData.result;
		var record = results.records[0];
		var keys = Object.keys(record);
		var fieldName = '';
		var requiresDivision = false;
		for (var idx in keys) {
			if (keys[idx].includes(currency.trim().toLowerCase())) {
				fieldName = keys[idx];
				if (fieldName.includes("100")) {
				  requiresDivision = true;
				}
				break;
			}
		}
		var rate = requiresDivision ? (parseFloat(record[fieldName]) / 100.0) : record[fieldName];
		for (var idx in searchResults) {
			var item = searchResults[idx];
			var price = parseFloat(item['foreignprice']);
			price = price / rate;
			item['foreignprice'] = price.toFixed(2) + '';
		}
		res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/additionalInfo', async function(req, res) {
	var id = req.query.id;
	
	try {
		const productResults = await productController.retrieveProdDesc(id);
		res.json({status: true, desc: productResults.desc, id: id, productBrand: productResults.productBrand, partNo: productResults.partNo });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/featured', async function(req, res) {
	var page = req.query.page;
	var skip = 0;
	var currentPage = 1;
	try {
		if (page !== undefined && page.trim().length !== 0) {
			if (isNaN(page)) {
				throw new Error('Page must be a number!');
			}
			currentPage = parseInt(page);
			skip = (parseInt(page) - 1) * 9;
		}
		const allFeaturedProducts = await productController.retrieveAllFeaturedProducts();
		var totalPages = Math.ceil(allFeaturedProducts.length / 9);
		if (page > totalPages) {
			throw new Error('Only ' + totalPages + ' pages are available to query!');
		}
		
		const featuredProducts = await productController.retrieveFeaturedProducts(skip, 9);
		var currency = req.query.currency;
		if (currency === undefined || currency.trim() === undefined || currency.trim().toLowerCase() === 'sgd') {
			res.json({ status: true, products: featuredProducts, totalPages: totalPages, currentPage: currentPage });
			return;
		}
		if (currency.trim().toLowerCase() === 'vnd' || currency.trim().toLowerCase() === 'twd') {
			currency = 'usd';
		}
		
		var results = exchangeRatesData.result;
		var record = results.records[0];
		var keys = Object.keys(record);
		var fieldName = '';
		var requiresDivision = false;
		for (var idx in keys) {
			if (keys[idx].includes(currency.trim().toLowerCase())) {
				fieldName = keys[idx];
				if (fieldName.includes("100")) {
				  requiresDivision = true;
				}
				break;
			}
		}
		var rate = requiresDivision ? (parseFloat(record[fieldName]) / 100.0) : record[fieldName];
		for (var idx in featuredProducts) {
		  var item = featuredProducts[idx];
		  var price = parseFloat(item['foreignprice']);
		  price = price / rate;
		  item['foreignprice'] = price.toFixed(2) + '';
		}
		res.json({ status: true, products: featuredProducts, totalPages: totalPages, currentPage: currentPage });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/latestproducts', async function(req, res) {
	var page = req.query.page;
	var skip = 0;
	var currentPage = 1;
	try {
		if (page !== undefined && page.trim().length !== 0) {
			if (isNaN(page)) {
				throw new Error('Page must be a number!');
			}
			currentPage = parseInt(page);
			skip = (parseInt(page) - 1) * 9;
		}
		const allFeaturedProducts = await productController.retrieveLatestProducts();
		var totalPages = Math.ceil(allFeaturedProducts.length / 9);
		if (page > totalPages) {
			throw new Error('Only ' + totalPages + ' pages are available to query!');
		}
		
		const featuredProducts = await productControllerretrieveLatestProducts();
		var currency = req.query.currency;
		if (currency === undefined || currency.trim() === undefined || currency.trim().toLowerCase() === 'sgd') {
			res.json({ status: true, products: featuredProducts, totalPages: totalPages, currentPage: currentPage });
			return;
		}
		if (currency.trim().toLowerCase() === 'vnd' || currency.trim().toLowerCase() === 'twd') {
			currency = 'usd';
		}
		
		var results = exchangeRatesData.result;
		var record = results.records[0];
		var keys = Object.keys(record);
		var fieldName = '';
		var requiresDivision = false;
		for (var idx in keys) {
			if (keys[idx].includes(currency.trim().toLowerCase())) {
				fieldName = keys[idx];
				if (fieldName.includes("100")) {
				  requiresDivision = true;
				}
				break;
			}
		}
		var rate = requiresDivision ? (parseFloat(record[fieldName]) / 100.0) : record[fieldName];
		for (var idx in featuredProducts) {
		  var item = featuredProducts[idx];
		  var price = parseFloat(item['foreignprice']);
		  price = price / rate;
		  item['foreignprice'] = price.toFixed(2) + '';
		}
		res.json({ status: true, products: featuredProducts, totalPages: totalPages, currentPage: currentPage });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});


app.get('/productDetails', async function(req, res) {
	var query = req.query.query;
	if (query === undefined || query.trim().length === 0) {
		res.json({ status: false, message: "Query not found!" });
		return;
	}
	try {
		const productDetailsResults = await productController.retrieveOneProductUser(query);
		var relatedProducts = productDetailsResults.relatedProducts;
		var cat = productDetailsResults.cat;
		var productBrand = productDetailsResults.productBrand;
		var prodID = productDetailsResults._id;
		if (relatedProducts === undefined) {
			relatedProducts = [];
		}
		var relProductsList = await productController.retrieveRelatedProductsDetails(relatedProducts, productBrand, cat, prodID);
		res.json({ status: true, product: productDetailsResults, related: relProductsList });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/productReviews', async function(req, res) {
	var productId = req.query.productId;
	if (productId === undefined || productId.trim().length === 0) {
		res.json({ status: false, message: "productId not found!" });
		return;
	}
	try {
		const productReviewsResults = await reviewController.retrieveReviews(productId);
		res.json({ status: true, reviews: productReviewsResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/writeReview', async function(req, res) {
	var productId = req.body.productId;
	var productReview = req.body.productReview;
	var productRating = req.body.productRating;
	var productReviewer = req.body.productReviewer;
	if (productId === undefined || productId.trim().length === 0 || productReview === undefined || productReview.trim().length === 0 ||
		productRating === undefined || productRating.trim().length === 0 || productReviewer === undefined || productReviewer.trim().length === 0) {
		res.json({ status: false, message: "productId, productReview, productRating and productReviewer are required!" });
		return;
	}
	
	productRating = parseInt(productRating);
	
	try {
		const writeReviewResults = await reviewController.addReview(productId, productReviewer, productReview, productRating);
		res.json({ status: true, message: 'Review added successfully' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/buyShipment', async function(req, res) {
	var orderId = req.body.orderId;
	var service = req.body.service;
	var cartId = req.body.cartId;
	var isShipped = req.body.isShipped;
	
	if (orderId === undefined || orderId.trim().length === 0 ||
		service === undefined || service.trim().length === 0 ||
		cartId === undefined || cartId.trim().length === 0 ||
		isShipped === undefined || isShipped.trim().length === 0) {
		res.json({ status: false, message: "orderId, carrier and service are required!" });
		return;
	}
	
	try {
		const orderObj = await shippingController.buyOrder(orderId, carrier, service);
		res.json({ status: true, purchaseResult: orderObj });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/createOrder', async function(req, res) {
	var to = req.body.to;
	var parcelData = req.body.parcelData;
	if (to === undefined || to.trim().length === 0 ||
		parcelData === undefined || parcelData.trim().length === 0) {
		res.json({ status: false, message: "to and parcelData are required!" });
		return;
	}
	
	try {
		var toAddress = JSON.parse(to);
		var parcelData = JSON.parse(parcelData);
		var fromAddress = shippingController.retrieveFromAddress();
		var shipments = shippingController.craftShipments(parcelData);
		const orderObj = await shippingController.craftOrder(toAddress, fromAddress, shipments);
		res.json({ status: true, order: orderObj });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/buyOrder', async function(req, res) {
	var orderId = req.body.orderId;
	var carrier = req.body.carrier;
	var service = req.body.service;
	
	if (orderId === undefined || orderId.trim().length === 0 ||
		carrier === undefined || carrier.trim().length === 0 ||
		service === undefined || service.trim().length === 0) {
		res.json({ status: false, message: "orderId, carrier and service are required!" });
		return;
	}
	
	try {
		const orderObj = await shippingController.buyOrder(orderId, carrier, service);
		res.json({ status: true, purchaseResult: orderObj });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
/*
app.post('/cartAction', async function(req, res) {
	var clientId = req.body.clientId;
	var action = req.body.action;

	if (clientId === undefined || clientId.trim().length === 0 || action === undefined || action.trim().length === 0) {
		res.json({ status: false, message: 'Client ID and Action are required!' });
		return;
	}

	var cartId, cartItems;
  
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrievePendingCartResults = await cartController.retrievePendingCart(clientId);
		// no pending cart
		if (retrievePendingCartResults == null) {
			if (action == "+") {
				//  Create a new cart
				const createNewCartResults = await cartController.createNewCart(clientId);
				cartId = new mongo.ObjectId(createNewCartResults.ops[0]._id);
				cartItems = createNewCartResults.ops[0].cart_items;
			}
			else {
				throw new Error('No cart available for specified action!');
			}
		}
		// found pending cart
		else {
			cartId = new mongo.ObjectId(retrievePendingCartResults._id);
			cartItems = retrievePendingCartResults.cart_items;
		}
	  
		if (action == "+" || action == "-") {
			var item = req.body.item;
			var qty = req.body.qty;
			var price = req.body.price;
			var name, image, weight;
			if (qty === undefined || item === undefined || price === undefined) {
				res.json({ status: false, message: 'Quantity, Item and Price are required!' });
				return;
			}
			// retrieve product details
			if (action == "+") {
				const retrieveProductDetailsResults = await productController.retrieveOneProductUser(item);
				name = retrieveProductDetailsResults.name;
				weight = retrieveProductDetailsResults.weight;
				image = retrieveProductDetailsResults.img;
			}
			var mycart = cartController.updateCartItem(cartItems, action, qty, item, price, image, name, weight);
			const updateCartResults = await cartController.updateCart(cartId, mycart);
			res.json({ status: true, message: "Cart updated successfully!" });
		}
		else if (action == "remove") {
			const removeCartResults = await productController.removeCart(cartId);
			res.json({ status: true, message: "Cart successfully removed!" });
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
*/
app.post('/cartAction', async function(req, res) {
	var clientId = req.body.clientId;
	var ipR = req.body.remoteIP;
	var ipL = req.body.localIP;
	var action = req.body.action;

	if (clientId === undefined || clientId.trim().length === 0 || ipR === undefined || ipR.trim().length === 0 ||
		ipL === undefined || ipL.trim().length === 0 || action === undefined || action.trim().length === 0) {
		res.json({ status: false, message: 'clientId, ips and action is required!' });
		return;
	}

	if (clientId === "-") {
		clientId = "";
	}
	
	var cartId, cartItems;
  
	try {
		const isValidUser = await userController.retrieveUser(clientId);
		const pendingCart = await cartController.retrievePendingCartv2(clientId, ipR, ipL);
		// no pending cart
		if (pendingCart == null) {
			if (action == "+") {
				//  Create a new cart
				const newCart = await cartController.createNewCartv2(clientId, ipR, ipL);
				cartId = new mongo.ObjectId(newCart._id);
				cartItems = newCart.cart_items;
			}
			else {
				throw new Error('No cart available for specified action!');
			}
		}
		// found pending cart
		else {
			cartId = new mongo.ObjectId(pendingCart._id);
			cartItems = pendingCart.cart_items;
		}
	  
		if (action == "+" || action == "-") {
			var item = req.body.item;
			var qty = req.body.qty;
			var price = req.body.price;
			var name, image, weight;
			if (qty === undefined || item === undefined || price === undefined) {
				res.json({ status: false, message: 'Quantity, Item and Price are required!' });
				return;
			}
			// retrieve product details
			if (action == "+") {
				const retrieveProductDetailsResults = await productController.retrieveOneProductUser(item);
				name = retrieveProductDetailsResults.name;
				weight = retrieveProductDetailsResults.weight;
				image = retrieveProductDetailsResults.img;
			}
			var mycart = cartController.updateCartItem(cartItems, action, qty, item, price, image, name, weight);
			const updateCartResults = await cartController.updateCart(cartId, mycart);
			res.json({ status: true, message: "Cart updated successfully!" });
		}
		else if (action == "remove") {
			const removeCartResults = await productController.removeCart(cartId);
			res.json({ status: true, message: "Cart successfully removed!" });
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
/*
app.post('/retrieveCart', async function(req, res) {
	var clientId = req.body.clientId;
	if (clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: 'Client ID is required!' });
		return;
	}
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrievePendingCartResults = await cartController.retrievePendingCart(clientId);
		if (retrievePendingCartResults == null) {
			throw new Error('User do not have a cart yet!');
		}
		const retrieveAllPB = await productBrandController.retrieveAll();
		var data = {};
		retrieveAllPB.forEach(function (pb) {
			if (pb.img === undefined) {
				data[pb.name] = "";
			}
			else {
				data[pb.name] = pb.img;
			}
		});
		res.json({ status: true, cart: retrievePendingCartResults, pbs: data });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
*/
app.post('/retrieveCart', async function(req, res) {
	var clientId = req.body.clientId;
	var ipR = req.body.remoteIP;
	var ipL = req.body.localIP;
	
	if (clientId === undefined || clientId.trim().length === 0 || ipR === undefined || ipR.trim().length === 0 ||
		ipL === undefined || ipL.trim().length === 0) {
		res.json({ status: false, message: 'clientId and ips are required!' });
		return;
	}
	
	if (clientId === "-") {
		clientId = "";
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const pendingCart = await cartController.retrievePendingCartv2(clientId, ipR, ipL);
		if (pendingCart == null) {
			throw new Error('User do not have a cart yet!');
		}
		const retrieveAllPB = await productBrandController.retrieveAll();
		var data = {};
		retrieveAllPB.forEach(function (pb) {
			if (pb.img === undefined) {
				data[pb.name] = "";
			}
			else {
				data[pb.name] = pb.img;
			}
		});
		res.json({ status: true, cart: pendingCart, pbs: data });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
/*
app.post('/verifyAvailability', async function(req, res) {
	var clientId = req.body.clientId;
	if (clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: 'Client ID is required!' });
		return;
	}
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrievePendingCartResults = await cartController.retrievePendingCart(clientId);
		if (retrievePendingCartResults == null) {
			throw new Error('User do not have a cart yet!');
		}
		var cart_items = retrievePendingCartResults.cart_items;
		var message_arr = [];
		for (var idx in cart_items) {
			var item = cart_items[idx];
			var productID = item.item;
			var qty = item.qty;
			try {
				await productController.checkProductAvailability(productID, qty);
			}
			catch (error) {
				var availableQty = parseInt(error.message);
				message_arr.push({ item: item, availableQty: availableQty });
			}
		}
		if (message_arr.length === 0) {
			res.json({ status: true, message: "All items are available!" });
		}
		else {
			res.json({ status: false, messages: message_arr });
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
*/
app.post('/verifyAvailability', async function(req, res) {
	var clientId = req.body.clientId;
	var ipR = req.body.remoteIP;
	var ipL = req.body.localIP;
	
	if (clientId === undefined || clientId.trim().length === 0 || ipR === undefined || ipR.trim().length === 0 ||
		ipL === undefined || ipL.trim().length === 0) {
		res.json({ status: false, message: 'clientId and ips are required!' });
		return;
	}
	
	if (clientId === "-") {
		clientId = "";
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const pendingCart = await cartController.retrievePendingCartv2(clientId, ipR, ipL);
		if (pendingCart == null) {
			throw new Error('User do not have a cart yet!');
		}
		var cart_items = pendingCart.cart_items;
		var message_arr = [];
		for (var idx in cart_items) {
			var item = cart_items[idx];
			var productID = item.item;
			var qty = item.qty;
			try {
				await productController.checkProductAvailability(productID, qty);
			}
			catch (error) {
				var availableQty = parseInt(error.message);
				message_arr.push({ item: item, availableQty: availableQty });
			}
		}
		if (message_arr.length === 0) {
			res.json({ status: true, message: "All items are available!" });
		}
		else {
			res.json({ status: false, messages: message_arr });
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/renameNp', async function(req, res) {
	var clientId = req.body.clientId;
	var npId = req.body.npId;
	var npName = req.body.npName;
	
	if (clientId === undefined || clientId.trim().length === 0 ||
		npId === undefined || npId.trim().length === 0 ||
		npName === undefined || npName.trim().length === 0) {
		res.json({ status: false, message: "clientId, npId and npName are required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const renameNotepadResults = await notepadController.renameNotepad(npId, npName);
		res.json({ status: true, message: "Notepad renamed successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addEmptyNp', async function(req, res) {
	var clientId = req.body.clientId;
	var npName = req.body.npName;
	
	if (npName === undefined || npName.trim().length === 0 || clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: "npName and clientId are required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const createNotepadResults = await notepadController.createNotepad(clientId, npName, []);
		res.json({ status: true , message: 'Notepad added successfully', 'notepad': createNotepadResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/setNpActive', async function(req, res) {
	var clientId = req.body.clientId;
	var npId = req.body.npId;
	
	if (clientId === undefined || clientId.trim().length === 0 ||
		npId === undefined || npId.trim().length === 0) {
		res.json({ status: false, message: "clientId and npId are required!" });
		return;
	}
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const createNotepadResults = await notepadController.setNotepadActive(npId, clientId);
		res.json({ status: true , message: 'Activeness of notepad updated' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addNp', async function (req, res) {
	var clientId = req.body.clientId;
	var npName = req.body.npName;
	var ipR = req.body.remoteIP;
	var ipL = req.body.localIP;
	
	if (npName === undefined || npName.trim().length === 0 || clientId === undefined || clientId.trim().length === 0 ||
		ipR === undefined || ipR.trim().length === 0 || ipL === undefined || ipL.trim().length === 0) {
		res.json({ status: false, message: "npName, clientId and ips are required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrievePendingCartResults = await cartController.retrievePendingCart(clientId, ipR, ipL);
		var cart_items = retrievePendingCartResults.cart_items;
		const createNotepadResults = await notepadController.createNotepad(clientId, npName, cart_items);
		res.json({ status: true , message: 'Notepad added successfully', 'notepad': createNotepadResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/npAction', async function(req, res) {
	var clientId = req.body.clientId;
	var npId = req.body.npId;
	var action = req.body.action;
	
	if (action === undefined || action.trim().length === 0 ||
		clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: "clientId and action are required!" });
		return;
	}
	
	if (action === "remove" && npId === undefined) {
		res.json({ status: false, message: "npId is required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		if (action == "+" || action == "-") {
			if (npId === undefined) {
				const activeNotepad = await notepadController.retrieveActiveNotepad(clientId);
				npId = activeNotepad._id;
			}
			
			const retrieveNotepadResults = await notepadController.retrieveNotepad(clientId, npId);
			var cart_items = retrieveNotepadResults.items;
			
			var qty = req.body.qty;
			var item = req.body.item;
			var price = req.body.price;
			var name, image, weight;
			if (qty === undefined || item === undefined || price === undefined) {
				throw new Error('Quantity, Item and Price are required!');
			}
			if (action == "+") {
				const retrieveProductDetailsResults = await productController.retrieveOneProductUser(item);
				name = retrieveProductDetailsResults.name;
				weight = retrieveProductDetailsResults.weight;
				image = retrieveProductDetailsResults.img;
			}
			
			var mycart = cartController.updateCartItem(cart_items, action, qty, item, price, image, name, weight);
			const updateNotepadResults = await notepadController.updateNotepad(npId, mycart);
			res.json({ status: true, message: "Notepad updated successfully!" });
		}
		else if (action == "remove") {
			const removeNotepadResults = await notepadController.removeNotepad(npId);
			res.json({ status: true, message: "Notepad successfully removed!" });
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/getNpNames', async function(req, res) {
	var clientId = req.body.clientId;
	if (clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: "clientId is required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrieveNotepadNamesResults = await notepadController.retrieveNotepadNames(clientId);
		res.json({ status: true, notepads: retrieveNotepadNamesResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/getNpList', async function(req, res) {
	var clientId = req.body.clientId;
	var npId = req.body.npId;
	if (clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: "clientId is required!" });
		return;
	}
	
	if (npId === undefined || npId.trim().length === 0) {
		npId = "-";
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrieveNotepadResults = await notepadController.retrieveNotepadInOrder(clientId, npId);
		res.json({ status: true, notepads: retrieveNotepadResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/getNp', async function(req, res) {
	var clientId = req.body.clientId;
	if (clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: "clientId is required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrieveNotepadResults = await notepadController.retrieveNotepads(clientId);
		res.json({ status: true, notepads: retrieveNotepadResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/npToCart', async function(req, res) {
	var clientId = req.body.clientId;
	var npId = req.body.npId;
	var ipR = req.body.remoteIP;
	var ipL = req.body.localIP;
	
	if (clientId === undefined || clientId.trim().length === 0 || npId === undefined || npId.trim().length === 0 ||
		ipR === undefined || ipR.trim().length === 0 || ipL === undefined || ipL.trim().length === 0) {
		res.json({ status: false, message: "clientId, npId and ips are required!" });
		return;
	}
	
	var npCart;
	var cartId, cartItems;
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrieveNotepadResults = await notepadController.retrieveNotepad(clientId, npId);
		npCart = retrieveNotepadResults.items;
		const retrievePendingCartResults = await cartController.retrievePendingCart(clientId, ipR, ipL);
		// no pending cart
		if (retrievePendingCartResults == null) {
			//  Create a new cart
			const createNewCartResults = await cartController.createNewCart(clientId, ipR, ipL);
			cartId = new mongo.ObjectId(createNewCartResults.ops[0]._id);
			cartItems = createNewCartResults.ops[0].cart_items;
		}
		else {
			cartId = new mongo.ObjectId(retrievePendingCartResults._id);
			cartItems = retrievePendingCartResults.cart_items;
		}
		var updatedCart = cartItems;
		// Consolidate all items from two carts
		for (var idx in npCart) {
			updatedCart = cartController.populateCart(updatedCart, npCart[idx]);
		}
		const updateCartResults = await cartController.updateCart(cartId, updatedCart);
		res.json({ status: true, message: "Notepad successfully added to cart!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/payNow', async function(req, res) {
	var cartId = req.body.cartId;
	var transactionId = req.body.transactionId;
	var shippingId = req.body.shippingId;
	var shippingCosts = req.body.shippingCosts;
	var shippingDetails = req.body.shippingDetails;
	var paymentType = req.body.paymentType;
	var carrier = req.body.carrier;
	var service = req.body.service;
	var shipmentInfo = req.body.shipmentInfo;
	var clientId = req.body.clientId;
	var currency = req.body.currency;
	
	if (cartId === undefined || cartId.trim().length === 0 ||
		transactionId === undefined || transactionId.trim().length === 0 ||
		shippingId === undefined || shippingId.trim().length === 0 ||
		shippingCosts === undefined || shippingCosts.trim().length === 0 ||
		shippingDetails === undefined || shippingDetails.trim().length === 0 ||
		paymentType === undefined || paymentType.trim().length === 0 ||
		carrier === undefined || carrier.trim().length === 0 ||
		service === undefined || service.trim().length === 0 ||
		shipmentInfo === undefined || shipmentInfo.trim().length === 0 ||
		clientId === undefined || clientId.trim().length === 0 ||
		currency === undefined || currency.trim().length === 0) {
		res.json({ status: false, message: "cartId, transactionId, shippingId, shippingCosts, shippingDetails, paymentType, carrier, service, shipmentInfo, clientId and currency are required!" });
		return;
	}
	
	var transId;
	shipmentInfo = JSON.parse(shipmentInfo);
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const verifyCartResults = await cartController.retrieveCartByCartID(clientId, cartId);
		const createTransactionResults = await transactionController.createTransaction(cartId, clientId, transactionId, shippingCosts, shippingDetails, paymentType, carrier, service, shipmentInfo, currency);
		transId = new mongo.ObjectId(createTransactionResults._id);
		if (paymentType == "Wire Transfer") {
			const updateTransactionStatusResults = await cartController.updateTransactionStatus(cartId, transId, 0);
			res.json({ status: true, message: "Thank you for your purchase! We have successfully submitted your purchase request!", transactionId: transId });
		}
		else {
			const updateTransactionStatusResults = await cartController.updateTransactionStatus(cartId, transId, 1);
			res.json({ status: true, message: "Thank you for your purchase! We have successfully submitted your purchase request!" });
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post("/retrieveTransactions", async function(req, res) {
	var clientId = req.body.clientId;

	if (clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: "clientId is required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrieveTransactionByClientIDResults = await transactionController.retrieveTransactionByClientID(clientId);
		res.json({ status: true, transactions: retrieveTransactionByClientIDResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveCartForInvoice', async function(req, res) {
	var clientId = req.body.clientId;
	var cartId = req.body.cartId;
	if (clientId === undefined || clientId.trim().length === 0 || cartId === undefined || cartId.trim().length === 0) {
		res.json({ status: false, message: 'clientId and cartId are required!' });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const verifyCartResults = await cartController.retrieveCartByCartID(clientId, cartId);
		res.json({ status: true, cart: verifyCartResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/search', async function(req, res) {
	var category = req.body.category;
	var brand = req.body.brand;
	var model = req.body.model;
	
	var page = req.body.page;
	var skip = 0;
	var currentPage = 1;
	var currency = req.body.currency;
	if (category === undefined || brand === undefined || model === undefined) {
		res.json({ status: false, message: 'category, brand and model are required!' });
		return;
	}
	category = category.replace(/%26/g, "&");
	brand = brand.replace(/%26/g, "&");
	model = model.replace(/%26/g, "&");
	
	try {
		if (page !== undefined && page.trim().length !== 0) {
			if (isNaN(page)) {
				throw new Error('Page must be a number!');
			}
			currentPage = parseInt(page);
			skip = (parseInt(page) - 1) * 9;
		}
		const productSearchResults = await productController.productSearch(category, brand, model);
		var totalPages = Math.ceil(productSearchResults.length / 9);
		if (page > totalPages) {
			throw new Error('Only ' + totalPages + ' pages are available to query!');
		}
		
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
		
		const searchResults = await productController.retrieveAllProductsAdvancedSearch(filter, skip, 9);
		var currency = req.body.currency;
		if (currency === undefined || currency.trim() === undefined || currency.trim().toLowerCase() === 'sgd') {
			res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
			return;
		}
		if (currency.trim().toLowerCase() === 'vnd' || currency.trim().toLowerCase() === 'twd') {
			currency = 'usd';
		}
		var results = exchangeRatesData.result;
		var record = results.records[0];
		var keys = Object.keys(record);
		var fieldName = '';
		var requiresDivision = false;
		for (var idx in keys) {
			if (keys[idx].includes(currency.trim().toLowerCase())) {
				fieldName = keys[idx];
				if (fieldName.includes("100")) {
				  requiresDivision = true;
				}
				break;
			}
		}
		var rate = requiresDivision ? (parseFloat(record[fieldName]) / 100.0) : record[fieldName];
		for (var idx in searchResults) {
			var item = searchResults[idx];
			var price = parseFloat(item['foreignprice']);
			price = price / rate;
			item['foreignprice'] = price.toFixed(2) + '';
		}
		res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/wildSearch', async function(req, res) {
	var query = req.body.query;
	var page = req.body.page;
	var skip = 0;
	var currentPage = 1;
	var currency = req.body.currency;
	if (query === undefined) {
		res.json({ status: false, message: 'query is required!' });
		return;
	}
	query = query.replace(/%26/g, "&");
	
	try {
		if (page !== undefined && page.trim().length !== 0) {
			if (isNaN(page)) {
				throw new Error('Page must be a number!');
			}
			currentPage = parseInt(page);
			skip = (parseInt(page) - 1) * 9;
		}
		const wildSearchResults = await productController.wildSearch(query);
		var totalPages = Math.ceil(wildSearchResults.length / 9);
		if (page > totalPages) {
			throw new Error('Only ' + totalPages + ' pages are available to query!');
		}
		
		const searchResults = await productController.wildSearchAdvanced(query, skip, 9);
		var currency = req.body.currency;
		if (currency === undefined || currency.trim() === undefined || currency.trim().toLowerCase() === 'sgd') {
			res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
			return;
		}
		if (currency.trim().toLowerCase() === 'vnd' || currency.trim().toLowerCase() === 'twd') {
			currency = 'usd';
		}
		var results = exchangeRatesData.result;
		var record = results.records[0];
		var keys = Object.keys(record);
		var fieldName = '';
		var requiresDivision = false;
		for (var idx in keys) {
			if (keys[idx].includes(currency.trim().toLowerCase())) {
				fieldName = keys[idx];
				if (fieldName.includes("100")) {
				  requiresDivision = true;
				}
				break;
			}
		}
		var rate = requiresDivision ? (parseFloat(record[fieldName]) / 100.0) : record[fieldName];
		for (var idx in searchResults) {
			var item = searchResults[idx];
			var price = parseFloat(item['foreignprice']);
			price = price / rate;
			item['foreignprice'] = price.toFixed(2) + '';
		}
		res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
		//res.json({ status: true, products: productSearchResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/superSearch', async function(req, res) {
	var query = req.body.query;
	var page = req.body.page;
	var skip = 0;
	var currentPage = 1;
	var currency = req.body.currency;
	if (query === undefined) {
		res.json({ status: false, message: 'query is required!' });
		return;
	}
	query = query.replace(/%26/g, "&");
	
	try {
		if (page !== undefined && page.trim().length !== 0) {
			if (isNaN(page)) {
				throw new Error('Page must be a number!');
			}
			currentPage = parseInt(page);
			skip = (parseInt(page) - 1) * 9;
		}
		const wildSearchResults = await productController.superSearch(query);
		var totalPages = Math.ceil(wildSearchResults.length / 9);
		if (page > totalPages) {
			throw new Error('Only ' + totalPages + ' pages are available to query!');
		}
		
		const searchResults = await productController.superSearchAdvanced(query, skip, 9);
		if (currency === undefined || currency.trim() === undefined || currency.trim().toLowerCase() === 'sgd') {
			res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
			return;
		}
		if (currency.trim().toLowerCase() === 'vnd' || currency.trim().toLowerCase() === 'twd') {
			currency = 'usd';
		}
		var results = exchangeRatesData.result;
		var record = results.records[0];
		var keys = Object.keys(record);
		var fieldName = '';
		var requiresDivision = false;
		for (var idx in keys) {
			if (keys[idx].includes(currency.trim().toLowerCase())) {
				fieldName = keys[idx];
				if (fieldName.includes("100")) {
				  requiresDivision = true;
				}
				break;
			}
		}
		var rate = requiresDivision ? (parseFloat(record[fieldName]) / 100.0) : record[fieldName];
		for (var idx in searchResults) {
			var item = searchResults[idx];
			var price = parseFloat(item['foreignprice']);
			price = price / rate;
			item['foreignprice'] = price.toFixed(2) + '';
		}
		res.json({ status: true, products: searchResults, totalPages: totalPages, currentPage: currentPage });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/roles', async function(req, res) {
	try {
		var items = [];
		const retrieveAllRolesResults = await roleController.retrieveAllRoles();
		allRoles = retrieveAllRolesResults;
		for (var key in allRoles) {
			var name = allRoles[key].name;
			if (name != "Admin" && name != "Zombie") {
				items.push(allRoles[key].name);
			}
		}
		res.json({ status: true, roles: items});
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.get('/cat', async function(req, res) {
	try {
		var items = [];
		const retrieveAllCategoriesResults = await categoryController.retrieveAllCategoryNames();
		allCategories = retrieveAllCategoriesResults;
		for (key in allCategories) {
			var name = allCategories[key].name;
			items.push(name);
		}
		res.json({ status: true, categories : items});
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});



/********* FOR ADMIN ***********/

app.post('/retrieveRecentlyAdded', async function(req, res) {
	try {
		const retrieveRecentlyAddedResults = await productController.retrieveRecentlyAdded();
		res.json({ status: true, products: retrieveRecentlyAddedResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addZombie', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	if (username === undefined || username.trim().length === 0 ||
		password === undefined || password.trim().length === 0) {
		res.json({ status: false, message: "username and password are required!" });
		return;
	}

	try {
		var salt = bcrypt.genSaltSync(saltRounds);
		var hashedPassword = bcrypt.hashSync(password, salt);
		
		const addZombieResults = await zombieController.addZombie(username, password, hashedPassword);
		res.json({ status: true, message: "Zombie Account added successfully!", data: addZombieResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveZombies', async function(req, res) {	
	try {
		const retrieveZombiesResults = await zombieController.retrieveAll();
		res.json({ status: true, zombies: retrieveZombiesResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveOneZombie', async function(req, res) {
	var zombieId = req.body.zombieId;
	
	if (zombieId === undefined || zombieId.trim().length === 0) {
		res.json({ status: false, message: "zombieId is required!" });
		return;
	}
	
	try {
		await zombieController.verifyZombie(zombieId);
		const retrieveOneZombieResults = await zombieController.retrieveOne(zombieId);
		res.json({ status: true, zombie: retrieveOneZombieResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateZombie', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var zombieId = req.body.zombieId;

	if (zombieId === undefined || zombieId.trim().length === 0) {
		res.json({ status: false, message: "zombieId is required!" });
		return;
	}

	try {
		await zombieController.verifyZombie(zombieId);
		var hashedPassword = undefined;
		if (password !== undefined) {
			var salt = bcrypt.genSaltSync(saltRounds);
			hashedPassword = bcrypt.hashSync(password, salt);
		}
		
		const updateZombieResults = await zombieController.updateZombie(zombieId, username, password, hashedPassword);
		res.json({ status: true, message: "Zombie Account updated successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/removeZombie', async function(req, res) {
	var zombieId = req.body.zombieId;

	if (zombieId === undefined || zombieId.trim().length === 0) {
		res.json({ status: false, message: "zombieId is required!" });
		return;
	}

	try {
		await zombieController.verifyZombie(zombieId);
		const removeZombieResults = await zombieController.removeZombie(zombieId);
		res.json({ status: true, message: "Zombie Account deleted successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/loginZ', async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	
	if (username === undefined || username.trim().length === 0 ||
		password === undefined || password.trim().length === 0) {
		res.json({ status: false, message: "username and password are required!" });
		return;
	}
	
	try {
		await zombieController.verifyZombieByUsername(username);
		const accountPassword = await zombieController.retrieveZombiePassword(username);
		if (!bcrypt.compareSync(password, accountPassword)) {
			throw new Error('Incorrect Password detected!');
		}
		const zombieLoginResults = await zombieController.zombieLogin(username, accountPassword);
		res.json({ status: true, message: "Successfully logged in", zombie: zombieLoginResults, role: getRoleName(zombieLoginResults.role_id) });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addCat', async function(req, res) {
	var catName = req.body.catName;

	if (catName === undefined || catName.trim().length === 0) {
		res.json({ status: false, message: "catName is required!" });
		return;
	}

	try {
		await categoryController.verifyCategoryNameExists(catName);
		const addCategoriesResults = await categoryController.addCategory(catName);
		res.json({ status: true, message: "Category added successfully!", data: addCategoriesResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/oneCat', async function(req, res) {
	var catId = req.body.catId;

	if (catId === undefined || catId.trim().length === 0) {
		res.json({ status: false, message: "catId is required!" });
		return;
	}

	try {
		const retrieveOneCategoryResults = await categoryController.retrieveOneCategory(catId);
		res.json({ status: true, category: retrieveOneCategoryResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/allCat', async function(req, res) {
	try {
		const retrieveAllCategoriesResults = await categoryController.retrieveAllCategories();
		res.json({ status: true, categories: retrieveAllCategoriesResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateCat', async function(req, res) {
	var catId = req.body.catId;
	var catName = req.body.catName;

	if (catId === undefined || catId.trim().length === 0 || catName === undefined || catName.trim().length === 0) {
		res.json({ status: false, message: "catId and catName is required!" });
		return;
	}

	try {
		const verifyCategoryIDResults = await categoryController.verifyCategoryID(catId);
		if (!verifyCategoryIDResults) {
			res.json({ status: false, message: "Invalid catId detected!" });
			return;
		}
		const updateCategoriesResults = await categoryController.updateCategory(catId, catName);
		res.json({ status: true, message: "Category updated successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/deleteCat', async function(req, res) {
	var catId = req.body.catId;

	if (catId === undefined || catId.trim().length === 0) {
		res.json({ status: false, message: "catId is required!" });
		return;
	}

	try {
		const verifyCategoryIDResults = await categoryController.verifyCategoryID(catId);
		if (!verifyCategoryIDResults) {
			res.json({ status: false, message: "Invalid catId detected!" });
			return;
		}
		const deleteCategoriesResults = await categoryController.deleteCategory(catId);
		res.json({ status: true, message: "Category deleted successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addBrand', async function(req, res) {
	var brandName = req.body.brandName;
	var modelList = req.body.modelList === undefined || req.body.modelList.trim().length === 0 ? "" : req.body.modelList;

	if (brandName === undefined || brandName.trim().length === 0) {
		res.json({ status: false, message: "brandName are required" });
		return;
	}

	if (modelList === "" || modelList.trim().length === 0) {
		modelList = [];
	}
	else {
		var tempList = [];
		if (modelList.indexOf("~") == -1) {
			tempList.push(modelList);
		}
		else {
			var splittedList = modelList.split("~");
			for (var i in splittedList) {
				tempList.push(splittedList[i]);
			}
		}
		modelList = tempList;
	}

	var existingModelList;
	var isUpdate = false;

	try {
		const retrieveBrandNModelByBrandNameResults = await bnmController.retrieveBrandNModelByBrandName(brandName);
		existingModelList = retrieveBrandNModelByBrandNameResults;
		if (retrieveBrandNModelByBrandNameResults.length !== 0) {
			isUpdate = true;
		}
		existingModelList = existingModelList.concat(modelList);

		if (isUpdate) {
			const updateModelResults = await bnmController.updateModel(brandName, existingModelList);
			res.json({ status: true, message: "Models updated successfully for " + brandName + "!" });
		}
		else {
			const addBrandNModelResults = await bnmController.addBrandNModel(brandName, existingModelList);
			res.json({ status: true, message: "Brand added successfully!", data: addBrandNModelResults });
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/getOneBrand', async function(req, res) {
	var brandId = req.body.brandId;

	if (brandId === undefined || brandId.trim().length === 0) {
		res.json({ status: false, message: "brandId is required!" });
		return;
	}

	try {
		const getOneBrandNModelResults = await bnmController.getOneBrandNModel(brandId);
		res.json({ status: true, brandObj: getOneBrandNModelResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateBrand', async function(req, res) {
	var brandId = req.body.brandId;
	var brandName = req.body.brandName;
	var modelList = req.body.modelList;

	if (brandId === undefined || brandId.trim().length === 0) {
		res.json({ status: false, message: "brandId is required!" });
		return;
	}

	if (modelList === "" || modelList.trim().length === 0) {
		modelList = [];
	}
	else {
		var tempList = [];
		if (modelList.indexOf("~") == -1) {
			tempList.push(modelList);
		}
		else {
			var splittedList = modelList.split("~");
			for (var i in splittedList) {
				tempList.push(splittedList[i]);
			}
		}
		modelList = tempList;
	}

	try {
		const getOneBrandNModelResults = await bnmController.getOneBrandNModel(brandId);
		const updateBrandNModelResults = await bnmController.updateBrandNModel(brandId, brandName, modelList);
		res.json({ status: true, message: "Brand and models updated successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/removeModel', async function(req, res) {
	var brandId = req.body.bid;
	var indexToRemove = req.body.indexToRemove;
	
	if (brandId === undefined || brandId.trim().length === 0 || indexToRemove === undefined || indexToRemove.trim().length === 0) {
		res.json({ status: false, message: "brandId and indexToRemove are required!" });
		return;
	}
	
	try {
		const getOneBrandNModelResults = await bnmController.getOneBrandNModel(brandId);
		var modelList = getOneBrandNModelResults.modelList;
		var brandName = getOneBrandNModelResults.brand;
		if(isNaN(indexToRemove)){
			throw new Error('indexToRemove must be a number!');
		}
		indexToRemove = parseInt(indexToRemove);
		modelList.splice(indexToRemove, 1);
		const updateBrandNModelResults = await bnmController.updateBrandNModel(brandId, brandName, modelList);
		res.json({ status: true, message: 'Model removed successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/deleteBrand', async function(req, res) {
	var brandId = req.body.brandId;

	if (brandId === undefined || brandId.trim().length === 0) {
		res.json({ status: false, message: "brandId is required!" });
	}

	try {
		const getOneBrandNModelResults = await bnmController.getOneBrandNModel(brandId);
		const deleteBrandNModelResults = await bnmController.deleteBrandNModel(brandId);
		res.json({ status: true, message: "Brand deleted successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/transactionSearch', async function(req, res) {
	var clientId = req.body.clientId;
	var monthFilter = req.body.monthFilter;
	var yearFilter = req.body.yearFilter;
	
	if (clientId === undefined || clientId.trim().length || monthFilter === undefined || yearFilter === undefined) {
		res.json({ status: false, message: "clientId, monthFilter and yearFilter are required!" });
		return;
	}
	
	try {
		const verifyUserResults = await userController.retrieveUser(clientId);
		const retrieveTransactionByClientID_Month_YearResults = await transactionController.retrieveTransactionByClientID_Month_Year(clientId, yearFilter, monthFilter);
		res.json({ status: true, transactions: retrieveTransactionByClientID_Month_YearResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/allTransaction', async function(req, res) {
	try {
		const retrieveAllTransactionsResults = await transactionController.retrieveAllTransactions();
		res.json({ status: true, transactions: retrieveAllTransactionsResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateWTStatus', async function(req, res) {
	var transactionId = req.body.transactionId;
	
	if (transactionId === undefined) {
		res.json({ status: false, message: 'transactionId is required!' });
		return;
	}
	
	var cartId;
	
	try {
		const verifyTransactionIdResults = await transactionController.retrieveTransactionByTransactionID(transactionId);
		cartId = verifyTransactionIdResults.cartId;
		const updateWireTransferTransactionStatusResults = await transactionController.updateWireTransferTransactionStatus(transactionId);
		res.json({ status: true, message: 'Transaction updated to Paid successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addProductPhase1', async function(req, res) {
	console.log(req.body);
	var pName = req.body.pName;
	var partNo = req.body.partNo;
	var pCategory = req.body.pCategory;
	var pQty = req.body.pQty;
	// Foreign market price
	var pFMPrice = req.body.pFMPrice;
	// Local market price
	var pLMPrice = req.body.pLMPrice;
	var pWeight = req.body.pWeight;
	var pSourceOfSupply = req.body.sos;
	var pSecSourceOfSupply = req.body.ssos;
	var pCostOfProduct = req.body.cop;
	var pDesc = req.body.pDesc;
	var pFeatured = req.body.pFeatured;
	var pBrand = req.body.pBrand;
	/*var tier1discountedprice = req.body.tier1discountedprice;
	var tier2discountedprice = req.body.tier2discountedprice;
	var tier3discountedprice = req.body.tier3discountedprice;
	var tier4discountedprice = req.body.tier4discountedprice;*/
	var tier1markup = req.body.tier1markup;
	var tier2markup = req.body.tier2markup;
	var tier3markup = req.body.tier3markup;
	var tier4markup = req.body.tier4markup;
	var gst = req.body.gst;
	var shippingcosts = req.body.shippingcosts;
	
	if (tier1markup === "0" && tier2markup === "0" && tier3markup === "0" && tier4markup === "0" &&
		pBrand !== "Product Brand coming soon...") {
		// check if the product brand has got tier discount data
		const productBrandInfo = await productBrandController.retrieveOneByName(pBrand);
		tier1markup = productBrandInfo.tier1;
		tier2markup = productBrandInfo.tier2;
		tier3markup = productBrandInfo.tier3;
		tier4markup = productBrandInfo.tier4;
	}

	if (pName === undefined || pName.trim().length === 0 ||
		partNo === undefined || partNo.trim().length === 0 ||
		pCategory === undefined || pCategory.trim().length === 0 ||
		pQty === undefined || pQty.trim().length === 0 ||
		pFMPrice === undefined || pFMPrice.trim().length === 0 ||
		pLMPrice === undefined || pLMPrice.trim().length === 0 ||
		pWeight === undefined || pWeight.trim().length === 0 ||
		pSourceOfSupply === undefined || pSourceOfSupply.trim().length === 0 ||
		pSecSourceOfSupply === undefined || pSecSourceOfSupply.trim().length === 0 ||
		pCostOfProduct === undefined || pCostOfProduct.trim().length === 0 ||
		pDesc === undefined || pDesc.trim().length === 0 ||
		pFeatured === undefined || pFeatured.trim().length === 0 ||
		pBrand === undefined || pBrand.trim().length === 0 ||
		tier1markup === undefined || tier1markup.trim().length === 0 ||
		tier2markup === undefined || tier2markup.trim().length === 0 ||
		tier3markup === undefined || tier3markup.trim().length === 0 ||
		tier4markup === undefined || tier4markup.trim().length === 0 ||
		gst === undefined || gst.trim().length === 0 ||
		shippingcosts === undefined || shippingcosts.trim().length === 0) {
		console.log("hello");
		res.json({ status: false, message: 'pName, partNo, pCategory, pQty, pFMPrice, pLMPrice, pWeight, cop, sos, ssos, pDesc, pFeatured, pBrand, tier1markup, tier2markup, tier3markup, tier4markup, gst, shippingcosts are required!' });
		return;
	}
	
	try {
		if (pFeatured === "true") {
			pFeatured = true;
		}
		else {
			pFeatured = false;
		}
		const addProductPhase1Results = await productController.addProductPhase1(pName, partNo, pCategory, pQty, pFMPrice, pLMPrice, pWeight, pSourceOfSupply, pSecSourceOfSupply, pCostOfProduct, pDesc, pFeatured, pBrand, tier1markup, tier2markup, tier3markup, tier4markup, gst, shippingcosts);
		res.json({ status: true, message: 'Product added siccessfully!', data: addProductPhase1Results });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addProductPhase2', async function(req, res) {
	var brandNmodel = req.body.brandNmodel;
	var pId = req.body.pId;

	if (brandNmodel === undefined || brandNmodel.trim().length === 0 ||
		pId === undefined || pId.trim().length === 0) {
		res.json({ status: false, message: 'brandNmodel and pId are required!' });
		return;
	}

	brandNmodel = JSON.parse(brandNmodel);

	try {
		const retrieveOneProductResults = await productController.retrieveOneProduct(pId);
		const updateBrandNModelResults = await productController.updateBrandNModel(pId, brandNmodel);
		res.json({ status: true, message: 'Brand and model are updated to product successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addProductPhase3', async function(req, res) {
	var productImage = req.body.productImage;
	var pId = req.body.pId;
	var fileType = req.body.fileType;

	if (productImage === undefined || productImage.trim().length === 0 ||
		pId === undefined || pId.trim().length === 0 ||
		fileType === undefined || fileType.trim().length === 0) {
		res.json({ status: false, message: 'productImage, fileType and pId are required!' });
		return;
	}

	var curList;

	try {
		var fileName = uploadImage(productImage, fileType);

		const retrieveOneProductResults = await productController.retrieveOneProduct(pId);
		var img = retrieveOneProductResults.img;
		if (img === undefined) {
			curList = [];
		}
		else if (img instanceof Array) {
			curList = img;
		}
		else {
			if (img.indexOf('[') == -1 || img.indexOf(']') == -1) {
				curList = JSON.parse("[" + img + "]");
			}
			else {
				curList = JSON.parse(img);
			}
		}

		curList.push(fileName);

		const updateImageResults = await productController.updateImage(pId, curList);
		res.json({ status: true, message: 'Images are updated to product successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

function uploadImage(base64Image, fileType) {
	if (fileType == 'png') {
		base64Image = "data:image/png;base64," + base64Image;
	}
	else if (fileType == 'jpg' || fileType == 'jpeg') {
		base64Image = "data:image/jpeg;base64," + base64Image;
	}

	var fileName = "";

	while (fileName == "" || fs.existsSync("public/images/" + fileName)) {
		fileName = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 20; i++) {
			fileName += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		if (fileType == 'png') {
			fileName += ".png";
		}
		else if (fileType == 'jpg' || fileType == 'jpeg') {
			fileName += ".jpeg";
		}
	}
	var path = __dirname + '/public/images/';
	var optionalObj = {};
	optionalObj["fileName"] = fileName;
	if (fileType == 'png') {
		optionalObj["type"] = "png";
	}
	else if (fileType == 'jpg' || fileType == 'jpeg') {
		optionalObj["type"] = "jpeg";
	}
	//optionalObj["debug"] = true;
	base64ToImage(base64Image, path, optionalObj);
	return "images/" + fileName;
}

app.post('/addProductPhase4', async function(req, res) {
	var pId = req.body.pId;
	var selectedProducts = req.body.selectedProducts;

	if (pId === undefined || pId.trim().length === 0) {
		res.json({ status: false, message: 'pId is required!' });
		return;
	}
	
	var productList = [];
	
	if (selectedProducts !== undefined && selectedProducts.trim().length !== 0) {
		productList = selectedProducts.split(",");
	}
	
	try {
		const updateImageResults = await productController.updateRelatedProducts(pId, productList);
		res.json({ status: true, message: 'Related products are updated to product successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveProductsForRelated', async function(req, res) {
	var pId = req.body.pId;
	
	if (pId === undefined || pId.trim().length === 0) {
		res.json({ status: false, message: 'pId is required!' });
		return;
	}
	
	try {
		var retrieveRelatedProductsResults = await productController.retrieveRelatedProducts(pId);
		if (retrieveRelatedProductsResults === undefined) {
			retrieveRelatedProductsResults = [];
		}
		const retrieveAllProductsResults = await productController.retrieveAllProducts();
		var resultContainer = [];
		for (var idx in retrieveAllProductsResults) {
			var product = retrieveAllProductsResults[idx];
			var productID = product._id.toString();
			var relatedObject = new Object();
			if (retrieveRelatedProductsResults.indexOf(productID) > -1) {
				relatedObject["product"] = product;
				relatedObject["isSelected"] = true;
			}
			else {
				relatedObject["product"] = product;
				relatedObject["isSelected"] = false;
			}
			resultContainer.push(relatedObject);
		}
		res.json({ status: true, relatedProducts: resultContainer });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/allProducts', async function(req, res) {
	try {
		const retrieveAllProductsResults = await productController.retrieveAllProducts();
		res.json({ status: true, products: retrieveAllProductsResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveOne', async function(req, res) {
	var pId = req.body.pId;

	if (pId === undefined || pId.trim().length === 0) {
		res.json({ status: false, message: 'pId is required!' });
		return;
	}

	try {
		const retrieveOneProductResults = await productController.retrieveOneProduct(pId);
		res.json({ status: true, products: retrieveOneProductResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateProduct', async function(req, res) {
	var pId = req.body.pId;
	// img / text
	var action = req.body.action;

	if (pId === undefined || pId.trim().length === 0) {
		res.json({ status: false, message: 'pId is required!' });
		return;
	}
	var curList;
	try {
		const retrieveOneProductResults = await productController.retrieveOneProduct(pId);
		var img = retrieveOneProductResults.img;
		if (img === undefined) {
			curList = [];
		}
		else if (img instanceof Array) {
			curList = img;
		}
		else {
			if (img.indexOf('[') == -1 || img.indexOf(']') == -1) {
				curList = JSON.parse("[" + img + "]");
			}
			else {
				curList = JSON.parse(img);
			}
		}
		if (action === undefined || action.trim().length === 0) {
			throw new Error('action is required!');
		}

		if (action == 'text') {
			var pName = req.body.pName;
			var partNo = req.body.partNo;
			var pCategory = req.body.pCategory;
			var pQty = req.body.pQty;
			// Foreign market price
			var pFMPrice = req.body.pFMPrice;
			// Local market price
			var pLMPrice = req.body.pLMPrice;
			var pWeight = req.body.pWeight;
			var pSourceOfSupply = req.body.sos;
			var pSecSourceOfSupply = req.body.ssos;
			var pCostOfProduct = req.body.cop;
			var pDesc = req.body.pDesc;
			var pFeatured = req.body.pFeatured;
			var pBrand = req.body.pBrand;
			/*
			var tier1discountedprice = req.body.tier1discountedprice;
			var tier2discountedprice = req.body.tier2discountedprice;
			var tier3discountedprice = req.body.tier3discountedprice;
			var tier4discountedprice = req.body.tier4discountedprice;
			*/
			var tier1markup = req.body.tier1markup;
			var tier2markup = req.body.tier2markup;
			var tier3markup = req.body.tier3markup;
			var tier4markup = req.body.tier4markup;
			var gst = req.body.gst;
			var shippingcosts = req.body.shippingcosts;
			var brandNmodel = req.body.brandNmodel;
			
			const updateProductResults = await productController.updateProductCatOne(pId, pName, partNo, pCategory, pQty, pFMPrice, pLMPrice, pWeight, pSourceOfSupply, pSecSourceOfSupply, pCostOfProduct, pDesc, pFeatured, pBrand, tier1markup, tier2markup, tier3markup, tier4markup, gst, shippingcosts, brandNmodel);
			res.json({ status: true, message: 'Product updated successfully!' });
		}
		else if (action == 'image') {
			var productImage = req.body.productImage;
			var fileType = req.body.fileType;
			var addOrRemove = req.body.addOrRemove;
			if (addOrRemove === undefined) {
				throw new Error('addOrRemove is required!');
			}
			if (addOrRemove == "+") {
				if (productImage === undefined || productImage.trim().length === 0 ||
					fileType === undefined || fileType.trim().length === 0) {
					throw new Error('productImage and fileType are required!');
				}
				var fileName = uploadImage(productImage, fileType);
				curList.push(fileName);
			}
			else if (addOrRemove == "-") {
				var indexToRemove = req.body.indexToRemove;
				if (indexToRemove === undefined) {
					throw new Error('indexToRemove is required!');
				}
				curList.splice(indexToRemove, 1);
			}
			const updateProductResults = await productController.updateProductCatTwo(pId, curList);
			res.json({ status: true, message: 'Product updated successfully!' });
		}
		else {
			throw new Error('Invalid action detected!');
		}
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/deleteProduct', async function(req, res) {
	var pId = req.body.pId;

	if (pId === undefined || pId.trim().length === 0) {
		res.json({ status: false, message: 'pId is required!' });
		return;
	}

	try {
		const retrieveOneProductResults = await productController.retrieveOneProduct(pId);
		const deleteProductResults = await productController.deleteProduct(pId);
		res.json({ status: true, message: 'Product deleted successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateShippedStatus', async function(req, res) {
	var cartId = req.body.cartId;
	var shippingId = req.body.shippingId;
	
	if (cartId === undefined || cartId.trim().length === 0 ||
		shippingId === undefined || shippingId.trim().length === 0) {
		res.json({ status: false, message: 'cartId and shippingId are required!' });
		return;
	}
	
	try {
		var transactionId = await cartController.retrieveTransactionIdFromCart(cartId);
		const transaction = await transactionController.retrieveTransactionByTransactionID(transactionId);
		var shipmentInfo = transaction.shipmentInfo;
		var isPartialShipped = false;
		
		for (var idx in shipmentInfo) {
			var shipment = shipmentInfo[idx];
			if (shipment.shipmentId == shippingId && !shipment.isShipped) {
				shipment["isShipped"] = true;
			}
			else if (!shipment.isShipped) {
				isPartialShipped = true;
			}
		}
		const updateShipmentInfoResults = await transactionController.updateShipmentInfo(transactionId, shipmentInfo);
		var statusCode = 2;
		if (isPartialShipped) {
			statusCode = 3;
		}
		const updateTransactionStatusResults = await cartController.updateTransactionStatus(cartId, transactionId, statusCode, true);
		res.json({ status: true, message: "Transaction status updated successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addProductBrand', async function(req, res) {
	var name = req.body.name;
	var tier1discountrate = req.body.tier1discountrate;
	var tier2discountrate = req.body.tier2discountrate;
	var tier3discountrate = req.body.tier3discountrate;
	var tier4discountrate = req.body.tier4discountrate;
	
	if (name === undefined || name.trim().length === 0 ||
		tier1discountrate === undefined || tier1discountrate.trim().length === 0 ||
		tier2discountrate === undefined || tier2discountrate.trim().length === 0 ||
		tier3discountrate === undefined || tier3discountrate.trim().length === 0 ||
		tier4discountrate === undefined || tier4discountrate.trim().length === 0) {
		res.json({ status: false, message: 'name, tier1discountrate, tier2discountrate, tier3discountrate and tier4discountrate are required!' });
		return;
	}
	
	name = name.trim();
	
	try {
		await productBrandController.verifyProductBrandNameExists(name);
		const addProductBrandResults = await productBrandController.addProductBrand(name, tier1discountrate, tier2discountrate, tier3discountrate, tier4discountrate);
		res.json({ status: true, message: 'Product Brand added successfully!', data: addProductBrandResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addProductBrandImage', async function(req, res) {
	var pbImage = req.body.pbImage;
	var pbId = req.body.pbId;
	var fileType = req.body.fileType;

	if (pbImage === undefined || pbImage.trim().length === 0 ||
		pbId === undefined || pbId.trim().length === 0 ||
		fileType === undefined || fileType.trim().length === 0) {
		res.json({ status: false, message: 'pbImage, fileType and pbId are required!' });
		return;
	}

	try {
		var fileName = uploadBrandImage(pbImage, fileType);
		const updateImageResults = await productBrandController.updateImage(pbId, fileName);
		res.json({ status: true, message: 'Images are updated to product successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

function uploadBrandImage(base64Image, fileType) {
	if (fileType == 'png') {
		base64Image = "data:image/png;base64," + base64Image;
	}
	else if (fileType == 'jpg' || fileType == 'jpeg') {
		base64Image = "data:image/jpeg;base64," + base64Image;
	}
	
	var fileName = "";
	
	while (fileName == "" || fs.existsSync("public/brandimages/" + fileName)) {
		fileName = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
		for (var i = 0; i < 20; i++) {
			fileName += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		
		if (fileType == 'png') {
			fileName += ".png";
		}
		else if (fileType == 'jpg' || fileType == 'jpeg') {
			fileName += ".jpeg";
		}
	}
	var path = __dirname + '/public/brandimages/';
	var optionalObj = {};
	optionalObj["fileName"] = fileName;
	if (fileType == 'png') {
		optionalObj["type"] = "png";
	}
	else if (fileType == 'jpg' || fileType == 'jpeg') {
		optionalObj["type"] = "jpeg";
	}
	//optionalObj["debug"] = true;
	base64ToImage(base64Image, path, optionalObj);
	return "brandimages/" + fileName;
}

app.post('/retrieveProductBrandNames', async function(req, res) {
	try {
		const retrieveAllProductBrandsResults = await productBrandController.retrieveAll();
		var productBrandArr = [];
		for (var idx in retrieveAllProductBrandsResults) {
			var productBrandObj = retrieveAllProductBrandsResults[idx];
			var name = productBrandObj.name;
			productBrandArr.push(name);
		}
		res.json({ status: true, productBrands: productBrandArr });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveProductBrandDetails', async function(req, res) {
	try {
		const retrieveAllProductBrandsResults = await productBrandController.retrieveAll();
		res.json({ status: true, productBrands: retrieveAllProductBrandsResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveOneProductBrand', async function(req, res) {
	var pbID = req.body.pbID;

	if (pbID === undefined || pbID.trim().length === 0) {
		res.json({ status: false, message: 'pbID is required!' });
		return;
	}

	try {
		const retrieveOneProductBrandResults = await productBrandController.retrieveOne(pbID);
		res.json({ status: true, productBrand: retrieveOneProductBrandResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateProductBrand', async function(req, res) {
	var pbID = req.body.pbID;
	var name = req.body.name;
	var tier1discountrate = req.body.tier1discountrate;
	var tier2discountrate = req.body.tier2discountrate;
	var tier3discountrate = req.body.tier3discountrate;
	var tier4discountrate = req.body.tier4discountrate;

	if (pbID === undefined || pbID.trim().length === 0) {
		res.json({ status: false, message: 'pbID is required!' });
		return;
	}

	try {
		await productBrandController.verifyProductBrandNameExists(name);
		const updateProductBrandResults = await productBrandController.updateProductBrand(pbID, name, tier1discountrate, tier2discountrate, tier3discountrate, tier4discountrate);
		res.json({ status: true, message: 'Product Brand updated siccessfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/deleteProductBrand', async function(req, res) {
	var pbID = req.body.pbID;

	if (pbID === undefined || pbID.trim().length === 0) {
		res.json({ status: false, message: 'pbID is required!' });
		return;
	}

	try {
		const deleteProductBrandResults = await productBrandController.deleteProductBrand(pbID);
		res.json({ status: true, message: 'Product Brand deleted successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/assignProductBrandDiscount', async function(req, res) {
	var pbID = req.body.pbID;

	if (pbID === undefined || pbID.trim().length === 0) {
		res.json({ status: false, message: 'pbID is required!' });
		return;
	}

	try {
		const assignProductBrandDiscountResults = await productBrandController.assignProductBrandDiscount(pbID);
		res.json({ status: true, message: 'Product Brand discounts are being assigned siccessfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/brands', async function(req, res) {
	try {
		const retrieveAllBrandsResults = await bnmController.retrieveAllBrands();
		res.json({ status: true, brands: retrieveAllBrandsResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/approveAccount', async function(req, res) {
	var email = req.body.email;
	var username = req.body.username;

	if (email === undefined || email.trim().length === 0 || username === undefined || username.trim().length === 0) {
		res.json({ status: false, message: "Email and Username are required!" });
		return;
	}

	try {
		const accountApprovalResults = await userController.approveAccount(email, username);
		res.json({ status: true, message: "Successfully approved!", email: email });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveUnapprovedAccounts', async function(req, res) {
	try {
		const retrieveUnapprovedAccountsResults = await userController.retrieveUnapprovedAccounts();
		res.json({ status: true, accounts: retrieveUnapprovedAccountsResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/setTierInfo', async function(req, res) {
	var email = req.body.email;
	var username = req.body.username;
	var tierNo = req.body.tierNo;

	if (email === undefined || email.trim().length === 0 ||
		username === undefined || username.trim().length === 0 ||
		tierNo === undefined || tierNo.trim().length === 0) {
		res.json({ status: false, message: "Email, Username and Tier No are required!" });
		return;
	}

	tierNo = parseInt(tierNo);

	try {
		const accountApprovalResults = await userController.setTierInfo(email, username, tierNo);
		res.json({ status: true, message: "Tier Information updated!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateUserTier', async function(req, res) {
	var userId = req.body.userId;
	var tierNo = req.body.tierNo;

	if (userId === undefined || userId.trim().length === 0 ||
		tierNo === undefined || tierNo.trim().length === 0) {
		res.json({ status: false, message: "userId and tierNo are required!" });
		return;
	}

	tierNo = parseInt(tierNo);

	try {
		const updateTierInfoResults = await userController.updateTierInfo(userId, tierNo);
		const updateProductBrandDiscount = await userController.updateProductBrandDiscount(userId, tierNo);
		res.json({ status: true, message: "Tier Information updated!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/applyProductBrandDiscount', async function(req, res) {
	var pbID = req.body.pbID;

	if (pbID === undefined || pbID.trim().length === 0) {
		res.json({ status: false, message: "pbID is required!" });
		return;
	}

	try {
		const pBrand = await productBrandController.retrieveOne(pbID);
		var name = pBrand.name;
		var tier1 = pBrand.tier1;
		var tier2 = pBrand.tier2;
		var tier3 = pBrand.tier3;
		var tier4 = pBrand.tier4;

		const updateTierInfoResults = await userController.updateAllUsersDiscountedBrands(name, tier1, tier2, tier3, tier4);
		res.json({ status: true, message: "Discounted Brand applied to dealers!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveUserTier', async function(req, res) {
	var userId = req.body.userId;

	if (userId === undefined || userId.trim().length === 0) {
		res.json({ status: false, message: "userId are required!" });
		return;
	}

	try {
		const retrieveDealerTierResults = await userController.retrieveDealerTier(userId);
		res.json({ status: true, tierNo: retrieveDealerTierResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveProductBrandsByUserId', async function(req, res) {
	var userId = req.body.userId;

	if (userId === undefined || userId.trim().length === 0) {
		res.json({ status: false, message: "userId are required!" });
		return;
	}

	try {
		const retrieveAllProductBrands = await productBrandController.retrieveAll();
		var productBrands = [];
		for (var item in retrieveAllProductBrands) {
			productBrands.push(retrieveAllProductBrands[item].name);
		}
		const retrieveUserDiscountedBrandsResults = await userController.retrieveUserDiscountedBrands(userId);
		for (var item in retrieveUserDiscountedBrandsResults) {
			if (productBrands.includes(retrieveUserDiscountedBrandsResults[item])) {
				var index = productBrands.indexOf(retrieveUserDiscountedBrandsResults[item]);
				productBrands.splice(index, 1);
				continue;
			}
		}
		res.json({ status: true, productbrands: productBrands });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveProductBrandsDiscountByUserId', async function(req, res) {
	var userId = req.body.userId;

	if (userId === undefined || userId.trim().length === 0) {
		res.json({ status: false, message: "userId are required!" });
		return;
	}

	try {
		const retrieveAllProductBrands = await productBrandController.retrieveAll();
		var productBrands = [];
		for (var item in retrieveAllProductBrands) {
			productBrands.push(retrieveAllProductBrands[item].name);
		}
		const retrieveUserDiscountedBrandsResults = await userController.retrieveUserDiscountedBrands(userId);
		for (var item in retrieveUserDiscountedBrandsResults) {
			if (productBrands.includes(retrieveUserDiscountedBrandsResults[item])) {
				var index = productBrands.indexOf(retrieveUserDiscountedBrandsResults[item]);
				productBrands.splice(index, 1);
				continue;
			}
		}
		res.json({ status: true, productbrands: productBrands });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/addUserProductBrandDiscount', async function(req, res) {
	var userId = req.body.userId;
	var productbrand = req.body.productbrand;

	if (userId === undefined || userId.trim().length === 0 ||
		productbrand === undefined || productbrand.trim().length === 0) {
		res.json({ status: false, message: "userId and productbrand are required!" });
		return;
	}
	
	try {
		const tierNo = await userController.retrieveDealerTier(userId);
		const productBrandDiscountDetails = await productBrandController.retrieveOneByName(productbrand);
		var selectedDiscount = 0;
		switch (tierNo) {
			case 1:
				selectedDiscount = productBrandDiscountDetails.tier1;
				break;
			case 2:
				selectedDiscount = productBrandDiscountDetails.tier2;
				break;
			case 3:
				selectedDiscount = productBrandDiscountDetails.tier3;
				break;
			case 4:
				selectedDiscount = productBrandDiscountDetails.tier4;
				break;
		}
		const updateUserDiscountedBrandsResults = await userController.updateUserDiscountedBrands(userId, productbrand, selectedDiscount);
		res.json({ status: true, message: "Product Brand Discount added" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveBrandDiscountsByUserId', async function(req, res) {
	var userId = req.body.userId;

	if (userId === undefined || userId.trim().length === 0) {
		res.json({ status: false, message: "userId are required!" });
		return;
	}

	try {
		const retrieveUserProductDiscountsResults = await userController.retrieveUserProductDiscounts(userId);
		res.json({ status: true, details: retrieveUserProductDiscountsResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateUserProductBrandDiscount', async function(req, res) {
	var userId = req.body.userId;
	var pBrand = req.body.pBrand;
	var pDiscount = req.body.pDiscount;
	
	if (userId === undefined || userId.trim().length === 0 ||
		pBrand === undefined || pBrand.trim().length === 0 ||
		pDiscount === undefined || pDiscount.trim().length === 0) {
		res.json({ status: false, message: "userId, pBrand, pDiscount are required!" });
		return;
	}
	
	try {
		const isValidProductBrandName = await productBrandController.isValidProductBrandName(pBrand);
		if (!isValidProductBrandName) {
			throw new Error("Invalid Product Name detected!");
		}
		pDiscount = parseFloat(pDiscount).toFixed(2);
		const updateUserDiscountedBrandsResults = userController.updateUserDiscountedBrands(userId, pBrand, pDiscount);
		
		res.json({ status: true, message: "Product Brand discount updated!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/deleteUserProductBrandDiscount', async function(req, res) {
	var userId = req.body.userId;
	var pBrand = req.body.pBrand;
	
	if (userId === undefined || userId.trim().length === 0 ||
		pBrand === undefined || pBrand.trim().length === 0) {
		res.json({ status: false, message: "userId, pBrand are required!" });
		return;
	}
	
	try {
		const isValidProductBrandName = await productBrandController.isValidProductBrandName(pBrand);
		if (!isValidProductBrandName) {
			throw new Error("Invalid Product Name detected!");
		}
		const updateUserDiscountedBrandsResults = userController.deleteUserProductDiscounts(userId, pBrand);
		
		res.json({ status: true, message: "Product Brand discount deleted!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
/*
app.post('/addTierGroup', async function(req, res) {
	var brandList = req.body.brandList;
	var discountTier1 = req.body.discountTier1;
	var discountTier2 = req.body.discountTier2;
	var discountTier3 = req.body.discountTier3;
	var discountTier4 = req.body.discountTier4;
	var discountTier5 = req.body.discountTier5;
	
	if (brandList === undefined || discountTier1 === undefined || discountTier2 === undefined || discountTier3 === undefined || discountTier4 === undefined || discountTier5 === undefined) {
		res.json({ status: false, message: 'brandList, discountTier1, discountTier2, discountTier3, discountTier4 and discountTier5 are required!' });
		return;
	}
	try {
		discountTier1 = parseFloat(discountTier1).toFixed(2);
		discountTier2 = parseFloat(discountTier2).toFixed(2);
		discountTier3 = parseFloat(discountTier3).toFixed(2);
		discountTier4 = parseFloat(discountTier4).toFixed(2);
		discountTier5 = parseFloat(discountTier5).toFixed(2);
		brandList = JSON.parse(brandList);
		const addTierGroupRecordResults = await tierController.addTierGroupRecord(brandList, discountTier1, discountTier2, discountTier3, discountTier4, discountTier5);
		res.json({ status: true, message: "Tier Group added successfully!" });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveTierGroup', async function(req, res) {
	try {
		const retrieveTierGroupRecordResults = await tierController.retrieveTierGroupRecord();
		res.json({ status: true, tierGroups: retrieveTierGroupRecordResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateTierDiscount', async function(req, res) {
	var tierGroupId = req.body.tierGroupId;
	var discountTier = req.body.discountTier;
	var discountValue = req.body.discountValue;
	
	if (tierGroupId === undefined || tierGroupId.trim().length === 0 || 
		discountTier === undefined || discountTier.trim().length === 0 ||
		discountValue === undefined || discountValue.trim().length === 0) {
		res.json({ status: false, message: 'tierGroupId, discountTier, discountValue are required!' });
		return;
	}
	
	try {
		const updateTierDiscountResults = await tierController.updateTierDiscount(tierGroupId, discountTier, discountValue);
		res.json({ status: true, message: 'Tier Discount updated successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/updateTierCategory', async function(req, res) {
	var tierGroupId = req.body.tierGroupId;
	var categoryList = req.body.categoryList;
	
	if (tierGroupId === undefined || tierGroupId.trim().length === 0 || 
		categoryList === undefined || categoryList.trim().length === 0) {
		res.json({ status: false, message: 'tierGroupId and categoryList are required!' });
		return;
	}
	
	categoryList = JSON.parse(categoryList);
	
	try {
		const retrieveTierGroupRecordResults = await tierController.updateTierCategory(tierGroupId, categoryList);
		res.json({ status: true, message: 'Tier Group Category updated successfully!' });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});
*/
app.post('/retrieveCRM', async function(req, res) {
	var type = req.body.type;
	
	if (type === undefined || type.trim().length === 0) {
		res.json({ status: false, message: 'type is required!' });
		return;
	}
	
	try {
		var role_id = getRoleID(type);
		const retrieveCRMResults = await userController.retrieveCRM(role_id);
		res.json({ status: true, users: retrieveCRMResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

app.post('/retrieveCRMByClientId', async function(req, res) {
	var type = req.body.type;
	var clientId = req.body.clientId;
	
	if (type === undefined || type.trim().length === 0 ||
		clientId === undefined || clientId.trim().length === 0) {
		res.json({ status: false, message: 'type and clientId are required!' });
		return;
	}
	
	try {
		var role_id = getRoleID(type);
		const retrieveCRMResults = await userController.retrieveCRMByClientId(role_id, clientId);
		res.json({ status: true, user: retrieveCRMResults });
	}
	catch (err) {
		res.json({ status: false, message: err.message });
	}
});

/********  MISC *******/

function getRoleID(role) {
	for (var key in allRoles) {
		if (allRoles[key].name == role) {
			return allRoles[key].role_id;
		}
	}
	return -1;
}

function getRoleName(roleId) {
	for (var key in allRoles) {
		if (allRoles[key].role_id == roleId) {
			return allRoles[key].name;
		}
	}
	return null;
}

app.get('/rates', function(req, res) {
	var currency = req.query.currency;

	if (exchangeRatesData === undefined) {
		res.json({ status: false, message: 'No exchange rates detected! Please contact the administrator!' });
		return;
	}

	if (currency === undefined || currency.trim() === undefined) {
		res.json({ status: true, exchangeRates: exchangeRatesData });
		return;
	}
	
	var currencyList = currency.split(';');
	var listSize = currencyList.length;	

	var result = exchangeRatesData.result;
	
	var record = result.records[0];
	var keys = Object.keys(record);
	var results = [];

	for (var idx in keys) {
		for (var index in currencyList) {
			var cur = currencyList[index];
			var fieldName = keys[idx];
			if (fieldName.includes(cur.trim().toLowerCase())) {
				var rate = parseFloat(record[fieldName]);
				if (fieldName.includes('100')) {
					rate = rate / 100.0;
				}
				results.push({ name: fieldName, rate: rate });
				break;
			}
		}
	}
	res.json({ status: true, rates: results });
});

dbConnection.connect(url, async function(err){
	var db = dbConnection.getDb();
	allRoles = await db.collection('role').find().toArray();
	allCategories = await db.collection('category').find().toArray();

	var interval = setInterval(async function() {
		try {
			var masUrl = 'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=95932927-c8bc-4e7a-b484-68a66a24edfe&limit=5&sort=end_of_day%20desc';
			var options = {
				url: masUrl
			};
			const exchangeRateData = await request.get(options);
			var exchangeRates = JSON.parse(exchangeRateData);
			exchangeRatesData = exchangeRates;
			var json = JSON.stringify(exchangeRates);
			await fs.writeFile('masrates.json', json, 'utf8', function(err) {
				if (err) {
					return console.log(err);
				}
				console.log("MAS Data updated locally.");
			});
		}
		catch (err) {
			await fs.readFile('masrates.json', 'utf8', function dataCallback(err, exchangeRateData) {
				if (err){
					console.log(err);
				}
				else {
					var exchangeRates = JSON.parse(exchangeRateData);
					exchangeRatesData = exchangeRates;
				}
			});
		}
	}, 86400000);
	try {
		var masUrl = 'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=95932927-c8bc-4e7a-b484-68a66a24edfe&limit=5&sort=end_of_day%20desc';
		var options = {
			url: masUrl
		};
		const exchangeRateData = await request.get(options);
		var exchangeRates = JSON.parse(exchangeRateData);
		exchangeRatesData = exchangeRates;
		var json = JSON.stringify(exchangeRates);
		await fs.writeFile('masrates.json', json, 'utf8', function(err) {
			if (err) {
				return console.log(err);
			}
			console.log("MAS Data updated locally.");
		});
	}
	catch (err) {
		await fs.readFile('masrates.json', 'utf8', function dataCallback(err, exchangeRateData) {
			if (err){
				console.log(err);
			}
			else {
				var exchangeRates = JSON.parse(exchangeRateData);
				exchangeRatesData = exchangeRates;
			}
		});
	}
});
try {
	var httpServer = http.createServer(app);
	var httpsServer = https.createServer(options, app);

	httpServer.listen(app.get('httpport'));
	httpsServer.listen(app.get('httpsport'));
}
catch (err) {
	console.log(err);
}
