const mongoose = require('mongoose');
const Hotels = mongoose.model('Hotels');
const Payment = mongoose.model('Payment');
const User = mongoose.model('User');
require('dotenv').config();

module.exports.addHotel = (req,res,next)=>{	
    
	var hotels = new Hotels();
    hotels.hotelname = req.body.hotelname;
    hotels.phonenumber = req.body.phonenumber;
    hotels.email = req.body.email;
    hotels.address = req.body.address;
    hotels.city = req.body.city;
    hotels.state = req.body.state;
    hotels.zipcode = req.body.zipcode;
    hotels.latitude = req.body.latitude;
    hotels.longitude = req.body.longitude;
    hotels.loc = {
		"type" : "Point",
		"coordinates" : [req.body.latitude,req.body.longitude]
	};
    hotels.tax_filename = req.body.tax_filename;
    hotels.bill_filename = req.body.bill_filename;
    hotels.is_approved = req.body.is_active || 'PENDING';
    hotels.owner_id = req._id || 'NO';

    hotels.save((err,doc)=>{
        if(!err){
            res.send(doc);
        }else{
            err.errorname = "Something went worng. Please try again later!";
            return res.status(422).send(err.errorname);
        }
    });	

}


module.exports.editHotel = async (req,res,next)=>{  
    let hotelDetails = await Hotels.findOne({_id:req.params.id});
    let is_approved = hotelDetails.is_approved;
    if(hotelDetails.hotelname !=req.body.hotelname || hotelDetails.phonenumber !=req.body.phonenumber || hotelDetails.email !=req.body.email || hotelDetails.address !=req.body.address || hotelDetails.state !=req.body.state || hotelDetails.zipcode !=req.body.zipcode || hotelDetails.tax_filename !=req.body.tax_filename || hotelDetails.bill_filename !=req.body.bill_filename || hotelDetails.email !=req.body.email || hotelDetails.email !=req.body.email){
        is_approved = "PENDING";
    }else{
    
        return res.status(422).send("Nothing to update");
    }
    const paramsArray = {
        hotelname: req.body.hotelname,
        phonenumber: req.body.phonenumber,
        email:req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode:req.body.zipcode,
        latitude:req.body.latitude,
        longitude: req.body.longitude,
        loc: {
            "type" : "Point",
            "coordinates" : [req.body.latitude,req.body.longitude]
        },
        tax_filename:req.body.tax_filename,
        bill_filename: req.body.bill_filename,
        is_approved: is_approved,
        owner_id: req._id || 'NO'
    }

    Hotels.findOneAndUpdate({_id:req.params.id},{$set: paramsArray},{upsert : true}, function(err, doc){
        if(!err){
            res.send(doc);
        }else{
            err.errorname = "Something went worng. Please try again later!";
            return res.status(422).send(err);
        }
    });	

}

module.exports.getMyHotels = (req,res,next)=>{
    
    Hotels.find({owner_id:req._id},
        (err,doc)=>{
            if(err)
            return res.send(err);
            else
            return res.send(doc);
        }
    ).sort({_id:-1});   
}


module.exports.getActiveHotels = async (req,res,next)=>{
    let userdata = await User.findOne({_id:req._id});
    let user_type = "";
    if(userdata){
        user_type = userdata.user_type;
    }
    
    responseType = {};
    try{
        
        let hotelData = [];
        if(user_type =="HOTEL_OWNER"){
             hotelData = await Hotels.find({owner_id:req._id,is_approved:"APPROVED"});
        }else{
             hotelData = await Hotels.find({_id:userdata.frontDeskHotelId});
        }
        
        const dataArray =[];
        let count = 0;
        for(let index=0; index < hotelData.length; index++){
            let checkPayment = await Payment.findOne({hotelId:hotelData[index]._id,paymentStatus:'SUCCESS'}).sort({_id:-1});           
            if(checkPayment){
                let currentDate = new Date();
                var expiryDate = new Date(checkPayment.expiryDate);
                if(currentDate.getTime() < expiryDate.getTime()){
                    dataArray[count] = hotelData[index];
                }else{
                    continue;
                }
            }
            count++;
        }
        ////console.log(dataArray);
        responseType = dataArray;
        responseType.statusText = "success";

    } catch (err) {
        responseType.totalMyHotels = 'Somthing Went Wrong';
        responseType.statusText = "error";
    }

    res.status(200).json(responseType);
}

module.exports.deleteHotel=(req,res,next)=>{
    Hotels.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send({'message':'User deleted successfully: '+req.params.id});
        } else {
            res.send(err);
        }
    });
}


module.exports.getHotelDetails=(req,res,next)=>{
    Hotels.findOne({_id:req.params.id},
        (err,doc)=>{
            if(err)
            return res.send(err);
            else
            return res.send(doc);
        }
    )   
}



