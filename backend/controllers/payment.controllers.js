const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');
const User = mongoose.model('User');
const commonHelper = require('../lib/commonHelper');
const Hotels = mongoose.model('Hotels');
const Subcription = mongoose.model('Subcription');

module.exports.checkSubscriptionStatus = async (req,res,next) =>{
  responseType = {};
  try{
    let userType = await commonHelper.checkUserType(req._id);
    if(userType.user_type == "HOTEL_OWNER"){
      let hotelData = await Hotels.findOne({owner_id:req._id});
      let paymentData = await Payment.findOne({userId:req._id});  
      const responseType = {};
      if(paymentData){		
        responseType.statusText = "success";
        responseType.userType = 'HOTEL_OWNER';
        responseType.message = "Subscription available";
      }else{
        let hotelData = await Hotels.findOne({owner_id:req._id});
        responseType.statusText = "error_subscription";
        responseType.userType = 'HOTEL_OWNER';    
        responseType.hotelId = hotelData._id;
        responseType.message = "Subscription not available";
        res.status(200).json(responseType);
      }  
    
      let userData = await User.findOne({_id:req._id,is_approved:'APPROVED'});
      if(userData){		
        responseType.statusText = "success";
        responseType.message = "Subscription available";
        res.status(200).json(responseType);
      }else{
        responseType.statusText = "inactive";
        responseType.message = "User not approved yet";
        res.status(200).json(responseType);
      }  
    }else if(userType.user_type == "FRONTDESK"){
        let userData = await User.findOne({_id:req._id});
        let HotelId = userData.frontDeskHotelId;
        let checkPayment = await Payment.findOne({hotelId: HotelId,paymentStatus:'SUCCESS'}).sort({_id:-1});
      
        let currentDate = new Date();
        var expiryDate = new Date(checkPayment.expiryDate);
  
        if(currentDate.getTime() > expiryDate.getTime()){
             subscriptionStatus = "INACTIVE";
        }else{
             subscriptionStatus = "ACTIVE";
        }
  
        responseType.subscriptionStatus = subscriptionStatus;
        responseType.statusText = "success";
        responseType.userType = "FRONTDESK";
        res.status(200).json(responseType);
  
    }else if(userType.user_type == "ADMIN"){
  
        responseType.statusText = "success";
        responseType.userType = "ADMIN";
        res.status(200).json(responseType);
  
    }else{
  
        responseType.statusText = "error";
        responseType.userType = "INVALID";
        res.status(200).json(responseType);
  
    }
  }catch(err){
    responseType.statusText = "error";
    responseType.userType = "Something Went Wrong!";
    res.status(200).json(responseType);
  }
  
}


module.exports.makePayment = async (req,res,next) =>{
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    try {

      let planData = await Subcription.findOne({_id:req.body.planId});  
      let checkPayment = await Payment.findOne({hotelId: req.body.hotelId,paymentStatus:'SUCCESS'}).sort({_id:-1});
      let currentDate = new Date();
      let expiryDate = "";
      if(checkPayment){  
        expiryDateOld =    checkPayment.expiryDate;
        if(currentDate.getTime() > expiryDateOld.getTime()){
           expiryDate = new Date(currentDate.setMonth(currentDate.getMonth()+ parseInt(planData.month)));
        }else{
           expiryDate = new Date(expiryDateOld.setMonth(expiryDateOld.getMonth()+ parseInt(planData.month)));
        }
      }else{  
          expiryDate = new Date(currentDate.setMonth(currentDate.getMonth()+ parseInt(planData.month)));
      }
      
        stripe.customers
          .create({
            name: req.body.name,
            source: req.body.token
          })
          .then(customer =>
            stripe.charges.create({
              amount: req.body.price,
              currency: "usd",
              customer: customer.id
            })
          )          
          .then((response) => {     

            var payment = new Payment();
            payment.userId = req._id;
            payment.transationId = response.id;
            payment.cardHolderName = response.name;
            payment.hotelId = req.body.hotelId;
            payment.subscriptionId = req.body.planId;
            payment.amountPaid = req.body.price;
            payment.paymentStatus = req.body.paymentStatus || "SUCCESS";
            payment.expiryDate = expiryDate;
            payment.save((err,doc)=>{
              if(!err){                 
                  res.status(200).json({statusText : "success",message:"Payment Successfull"})
              }else{
                  err.errorname = "Something went worng. Please try again later!";
                  return res.status(200).send(err.errorname);
              }
            })            
          })
          .catch(err => res.status(200).json({statusText : "err",message:"Error making payment"}))
      } catch (err) {
        res.send(res.status(200).json({statusText : "err", message:"Error outside try"}));
    }
}




