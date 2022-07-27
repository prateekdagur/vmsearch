const mongoose = require("mongoose");
var subcriptionSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	month: {
		type: String,
	},
	price: {
		type: Number,
	},
	benefit_title: {
		type: String,
	},
	benefits: [{
		type: String,
 }
],
});

mongoose.model("Subcription", subcriptionSchema);