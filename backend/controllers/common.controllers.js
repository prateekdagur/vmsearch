const mongoose = require('mongoose');
const User = mongoose.model('User');
const Hotels = mongoose.model('Hotels');
const Payment = mongoose.model('Payment');
const Guest = mongoose.model('Guest');
const Feedback = mongoose.model('Feedback');
const Settings = mongoose.model('Settings');
const Dnr = mongoose.model('Dnr');
const _ = require('lodash');
const Subcription = mongoose.model('Subcription');

module.exports.dashboard = async (req,res,next)=>{
    responseType = {};
    let userId = req._id;
    let totalLiveEvents = 0;
  //  let liveEvents =  Feedback.find();
    let liveEvents = await Feedback.aggregate([
          {"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) },"is_approved":'APPROVED'}}, 
          { $sort: {_id:-1, date: -1} },       
          {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
          {"$replaceRoot":{"newRoot":"$doc"}}
     ])

     if(liveEvents){
          totalLiveEvents = (await liveEvents).length;
     }
   
   // let dnrList =  Feedback.find({ownerId:userId});

    let dnrList = await Feedback.aggregate([
          {"$match":{"ownerId":req._id,"is_approved":'APPROVED'}},            
          {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
          {"$replaceRoot":{"newRoot":"$doc"}},     
     ]);

    let totalDnrList = (await dnrList).length;
    let myHotels = Hotels.find({owner_id:userId});
    let totalMyHotels = (await myHotels).length;


     let eventData = await Feedback.aggregate([
          {"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) },"is_approved":'APPROVED'}}, 
          { $sort: {_id:-1, date: -1} },       
          {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
          {"$replaceRoot":{"newRoot":"$doc"}}
     ]).sort({date: -1}).limit(3).exec();

     const dataArray =[];
     for ( let index=0; index < eventData.length; index++ ) {
          let guestDataEvent = await Guest.findOne({_id:eventData[index].guestId});
          let hotelDataEvent = await Hotels.findOne({_id:eventData[index].hotelId});
          dataArray[index] = {
               'eventData':eventData[index],
               guestDataEvent,
               hotelDataEvent
          } 
     }


    // let dnrData = await Feedback.find({ownerId:userId}).limit(3).sort({_id:-1});
     let dnrData = await Feedback.aggregate([
          {"$match":{"ownerId":req._id,"is_approved":'APPROVED'}},
          { $sort: {_id:-1, date: -1} },       
          {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
          {"$replaceRoot":{"newRoot":"$doc"}}
     ]).sort({date: -1}).limit(3).exec();

     const dataArrayDnr =[];
     for ( let index=0; index < dnrData.length; index++ ) {
          let guestDataDnr = await Guest.findOne({_id:dnrData[index].guestId});
          let hotelDataDnr = await Hotels.findOne({_id:dnrData[index].hotelId});
          dataArrayDnr[index] = {
               'eventData':dnrData[index],
               guestDataDnr,
               hotelDataDnr
          } 
     }
    
    let contactData = await Settings.findOne();
    responseType.contactData = contactData;
    responseType.dnrList = dataArrayDnr;
    responseType.liveEvents = dataArray;    
    responseType.totalLiveEvents = totalLiveEvents;
    responseType.totalDnrList = totalDnrList;
    responseType.totalMyHotels = totalMyHotels;
    responseType.statusText = "success";
    res.status(200).json(responseType);

}


module.exports.myAccount = async (req,res,next)=>{
    responseType = {};
    let userInfo = await User.findOne({_id:req._id});
    let infoUser = _.pick(userInfo,['_id','hotelname','email','user_type','phonenumber']);
    let hotelData = await Hotels.find({owner_id:req._id});
    
    const dataArrayDnr =[];
    for (let index=0; index < hotelData.length; index++ ) {
         let checkSubscription = await Payment.findOne({hotelId:hotelData[index]._id}).sort({_id:-1});         

         if(checkSubscription){
               let currentDate = new Date();
               var expiryDate = new Date(checkSubscription.expiryDate);

               if(currentDate.getTime() > expiryDate.getTime()){
                    subscriptionStatus = "INACTIVE";
               }else{
                    subscriptionStatus = "ACTIVE";
               }
              
         }else{
               subscriptionStatus = "PENDING";
         }
         dataArrayDnr[index] = {
              "hotelname":hotelData[index].hotelname,
              "hotelId":hotelData[index]._id,
               subscriptionStatus,
               checkSubscription
           } 
    }

    responseType.userInfo = infoUser;
    responseType.hotelData = dataArrayDnr;
    responseType.statusText = "success";
    res.status(200).json(responseType); 
}


module.exports.getDnrReasonList = async (req,res,next)=>{
     responseType = {};
     let dnrReasonList = await Dnr.find();
     responseType.dnrReasonList = dnrReasonList;
     responseType.statusText = "success";
     res.status(200).json(responseType); 
}


module.exports.getDnrTitle = async (req,res,next)=>{
     responseType = {};
     let dnrDetails = await Dnr.findOne({_id:req.params.id});
     if(dnrDetails){
          responseType = dnrDetails.Dnr_title;
     }else{
          responseType = "NA";
     }
     res.status(200).json(responseType); 
}


module.exports.subscriptionList = async (req,res,next)=>{
     responseType = {};
     let subscriptionList = await Subcription.find();
     responseType.subscriptionList = subscriptionList;
     responseType.statusText = "success";
     res.status(200).json(responseType); 
}


module.exports.getContactInfo = async (req,res,next)=>{
     responseType = {};
     try{
          let contactData = await Settings.findOne();
          responseType.contactData = contactData;
          responseType.statusText = "success";
     }catch(err){
          responseType.contactData = 'Something Went Wrong!';
          responseType.statusText = "error";
     }
     res.status(200).json(responseType);      
}