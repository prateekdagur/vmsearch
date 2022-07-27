const mongoose = require('mongoose');
var otpSchema = new mongoose.Schema({
	email:{
		type:String,
	},
	code:{
		type:String,
	},
	expireIn:{
		type:String,
	}

});

mongoose.model('Otp',otpSchema);