const mongoose = require('mongoose');
var dnrSchema = new mongoose.Schema({
    Dnr_title:{
		type:String,
        required: true		
	},
    status:{
            type:String,
            default: 'INACTIVE'		
	},
	date: {
		type: Date,
		default: Date.now
	},
	modifiedate: {
		type: Date,
	}
});


mongoose.model('Dnr',dnrSchema);