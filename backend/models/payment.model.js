const mongoose = require('mongoose');
var paymentSchema = new mongoose.Schema({
	userId:{
		type:String,
		//required:'user ID is required'
	},
	cardHolderName:{
		type:String,
		//required:'user ID is required'
	},
    transationId:{
		type:String,
		//required:'hotel ID is required'
	},
    hotelId:{
		type:String,
		//required:'hotel ID is required'
	},
	subscriptionId:{
		type:String,
		//required:'Subscription ID  is required',
	},
	amountPaid:{
		type:String,
		//required:'Amount is required',
	},	
    paymentStatus:{
		type:String,
		//required:'Amount is required',
	},
	date: {
		type: Date,
		default: Date.now
	},
	expiryDate: {
		type: Date
	}
});

mongoose.model('Payment',paymentSchema);