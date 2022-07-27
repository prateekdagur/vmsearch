const mongoose = require('mongoose');
var notificationSchema = new mongoose.Schema({
	guestId:{
		type:String,
        required:'guest id  is required'		
	},
	feedbackId:{
		type:String,
        required:'feedbackId  is required'		
	},
	hotelId:{
		type:String,
        required:'hotelId code is required'		
	},
    ownerId:{
		type:String,
	},	
    photos:{
		type:String,		
	},
    videos:{
		type:String,		
	},
    dnrReason:{
		type:String,		
	},
    status:{
		type:String,		
	},
    userId:{
		type:String,		
	},
    comments:{
		type:String,
       // required:'comment  is required'		
	},
	is_approved:{
		type:String,
		default: 'NO'
	},
	added_by:{
		type:String,
		default: ''
	},
	date: {
		type: Date,
		default: Date.now
	},
    latitude:{
		type:String,
	},
	longitude:{
		type:String,
	}
});


mongoose.model('Notification',notificationSchema);