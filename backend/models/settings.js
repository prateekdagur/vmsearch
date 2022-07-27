const mongoose = require('mongoose');
var settingsSchema = new mongoose.Schema({
    nearby_distance: {
        type: Number,
        default: 5
    },
    introduction_video_url: {
        type: String,
 },
 contact_us_name: {
    type: String,
},
contact_us_email: {
    type: String,
},
contact_us_phone_number: {
    type: String,
},
contact_us_address: {
    type: String,
},
});


mongoose.model('Settings', settingsSchema);