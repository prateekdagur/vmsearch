const mongoose = require('mongoose');
var hotelsSchema = new mongoose.Schema({
	hotelname:{
		type:String,
		required:'hotel name is required'
	},
	phonenumber:{
		type:String,
		required:'phone number is required',
	},
	email:{
		type:String,
		required:'email is required',
	},
	address:{
		type:String,
		required:'address is required'	
	},
	city:{
		type:String,			
	},
	state:{
		type:String,		
	},
	zipcode:{
		type:String,
		required:'zip code is required'		
	},
	latitude:{
		type:String,
	},
	longitude:{
		type:String,
	},
	tax_filename:{
		type:String,
	},
	bill_filename:{
		type:String,
	},	
	is_approved:{
		type:String,
		default: 'NO'
	},
	owner_id:{
		type:String,
		default: ''
	},
	date: {
		type: Date,
		default: Date.now
	},
	loc:{
        type:{
            type:String,
            default:'Point'
        },
        coordinates: { 
			type: [Number], 
			index: '2dsphere'
		}
    },
	soft_delete_hotel:{
		type:Boolean,
		default: true
	}
});


mongoose.model('Hotels',hotelsSchema);