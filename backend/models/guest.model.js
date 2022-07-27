const mongoose = require('mongoose');
var guestSchema = new mongoose.Schema({
	firstName:{
		type:String,
		required:'First name is required'
	},
    lastName:{
		type:String,
		required:'Last Name is required'
	},
    dlImage:{
		type:String,
	},
	dob:{
		type:Date,
	},
	dlNumber:{
		type:String,
		required:'dlNumber is required',
	},	
	dlExpiryDate:{
		type:Date,
	},
    dlState:{
		type:String,
		required:'dlState is required'		
	},
	city:{
		type:String,
	},
	address:{
		type:String
	},
	state:{
		type:String,	
	},
	zipCode:{
		type:String		
	}	
});


mongoose.model('Guest',guestSchema);