const apiTestKey = 'e5kencHuBNHfzNp36Z12bA';
const apiLiveKey = 's4chB5aZ6Ep6SPNNpdVBcw';
const EasyPost = require('@easypost/api');
const api = new EasyPost(apiLiveKey);

module.exports = {
	retrieveFromAddress: function() {
		const fromAddress = new api.Address({
		  name: 'Mark',
		  street1: '25 Kaki Bukit Road 4, #01-35 (SYNERGY)',
		  street2: '',
		  city: 'Singapore',
		  state: 'SG',
		  zip: '417800',
		  phone: '(+65) 8687 8551',
		  country: 'SG'
		});
		return fromAddress;
	},
	
	craftToAddress: function(name, street1, street2, city, state, zip, phone, country) {
		const toAddress = new api.Address({
		  name: name,
		  street1: street1,
		  street2: street2,
		  city: city,
		  state: state,
		  zip: zip,
		  phone: phone,
		  country: country
		});
		return toAddress;
	},
	
	craftParcel: function(weight) {
		const parcel = new api.Parcel({
			weight: weight
		});
		return parcel;
	},
	
	craftShipmentDefaults: async function(toAddress, fromAddress, parcel, customsInfo) {
		const shipment = new api.Shipment({
			to_address: toAddress,
			from_address: fromAddress,
			parcel: parcel,
			customs_info: customsInfo
		});
		const data = await shipment.save();
		return data;
	},
	
	craftShipmentOrder: async function(parcel) {
		const shipment = new api.Shipment({
			parcel: parcel
		});
		const data = await shipment.save();
		return data;
	},
	
	craftShipments: function(parcels) {
		var shipments = [];
		for (var idx in parcels) {
			var parcel = parcels[idx];
			var shipment = new api.Shipment({
				parcel: parcel
			});
			shipments.push(shipment);
		}
		return shipments;
	},
	
	craftOrder: async function(toAddress, fromAddress, shipments) {
		const order = new api.Order({
			to_address: toAddress,
			from_address: fromAddress,
			shipments: shipments
		});
		const data = await order.save();
		console.log(data);
		return data;
	},
	
	buyShipment: async function(shipmentId, rateId) {
		const shipment = await api.Shipment.retrieve(shipmentId);
		const buyShipmentResult = await shipment.buy(rateId);
		return buyShipmentResult;
	},
	
	buyOrder: async function(orderId, carrier, service) {
		const order = await api.Order.retrieve(orderId);
		const buyOrderResult = await order.buy(carrier, service);
		return buyOrderResult;
	},
	
	retrieveRatesFromShipment: async function(shipmentId) {
		const shipment = await api.Shipment.retrieve(shipmentId);
		return shipment.rates;	
	},
	
	retrieveRatesFromOrder: async function(orderId) {
		const order = await api.Order.retrieve(orderId);
		return order.rates;
	},
};