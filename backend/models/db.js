const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI,(err)=>{
	if(!err){
		console.log("Database connected");
	}else{
		console.log("Database not connected"+JSON.stringify(err,undefined,2));
	}
});

require('./notification.model'); 
require('./feedback.model');
require('./payment.model');
require('./otp.model');
require('./user.model');
require('./hotels.model');
require('./guest.model');
require('./dnrRegion');
require('./subscription');
require('./settings');