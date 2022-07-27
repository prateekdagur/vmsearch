const { response } = require('express');
const mongoose = require('mongoose');
const Guest = mongoose.model('Guest');
const User = mongoose.model('User');
const Feedback = mongoose.model('Feedback');
const Notification = mongoose.model('Notification');
const Hotels = mongoose.model('Hotels');
const Settings = mongoose.model('Settings');
const commonHelper = require('../lib/commonHelper');
require('dotenv').config();
const _ = require('lodash');

module.exports.readNotificationUpdate = async (req,res,next)=>{ 
     ////console.log(req._id);
     const paramsArray = {
          status: 'read',
     }

     let eventData = await Notification.find({userId: req._id});

     for(index=0;index<eventData.length;index++){
          await Notification.findOneAndUpdate({_id:eventData[index]._id},{$set: paramsArray},{upsert : true});	
     }
     
}


module.exports.notificationList = async (req,res,next)=>{ 

     responseType = {};
     
     const pageOptions = {
          page: req.params.page || 0,
          limit: req.query.limit || 10
      }

      let userData = await User.findOne({_id:req._id});    

      let maxDistanceData = await Settings.findOne();
      if(maxDistanceData){
          maxDistance = maxDistanceData.nearby_distance*1000
      }else{
          maxDistance = 5000;
      }
      ////console.log(maxDistance);
     //let eventDataCount = await Notification.find({userId:req._id});
     
     let unReadEventDataCount = await Notification.find({ 
          $and: [
              {"userId": req._id,'status':'unread','is_approved':'APPROVED'},
              {
               "$geoNear": {
                   "near": {
                       "type": "Point",
                       "coordinates": [ userData.latitude, userData.longitude]
                   },
                   "spherical": true,
                   "distanceField": "distance",
                   "maxDistance": maxDistance,
               }
           }
          ]
      });  

     let eventDataCount = await Notification.find({ 
          $and: [
              {"userId": req._id},
              {
               "$geoNear": {
                   "near": {
                       "type": "Point",
                       "coordinates": [ userData.latitude, userData.longitude]
                   },
                   "spherical": true,
                   "distanceField": "distance",
                   "maxDistance": maxDistance,
               }
           }
          ]
      });  

    // let eventData = await Notification.find({userId:req._id}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).sort({_id:-1}).exec();

     let eventData = await Notification.find({ 
          $and: [
              {"userId": req._id},
              {
               "$geoNear": {
                   "near": {
                       "type": "Point",
                       "coordinates": [ userData.latitude, userData.longitude]
                   },
                   "spherical": true,
                   "distanceField": "distance",
                   "maxDistance": maxDistance,
               }
           }
          ]
      }).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).sort({_id:-1}).exec();  

     const dataArray =[];
     for ( let index=0; index < eventData.length; index++ ) {
          let canView = false;
          if(eventData[index].ownerId == req._id){
               canView = true;
          }

          if(eventData[index].added_by == req._id){
               canView = true;
          }

          let guestData = await Guest.findOne({_id:eventData[index].guestId});
          dataArray[index] = {
               'eventData':eventData[index],
               guestData,
               canView
          } 
     }

     if(eventData.length != 0){
          responseType.data = dataArray;
          responseType.notificationCount = unReadEventDataCount.length;
          responseType.totalData = eventDataCount.length;
          responseType.message = "notification event list";
          responseType.statusText = "success";
     }else{
          responseType.message = "No record found";
          responseType.statusText = "error";
     }
     res.status(200).json(responseType);
}


module.exports.editGuest = async (req,res,next)=>{
     responseType = {};
    try{       
          const paramsArray = {
               firstName:  req.body.firstName,
               lastName:  req.body.lastName,
               dlImage:  req.body.dlImage,
               dob: req.body.dob,
               dlNumber:  req.body.dlNumber,
               dlExpiryDate:  req.body.dlExpiryDate,
               dlState: req.body.dlState,
               address: req.body.address,
               city:  req.body.city,
               state:  req.body.state,
               zipCode:  req.body.zipCode, 
          } 
          ////console.log(paramsArray);
         let updateGuest = await  Guest.findOneAndUpdate({_id:req.params.id},{$set: paramsArray},{upsert : true});
         responseType.statusText = "success";
         responseType.message = "Information updated successfully";
     }
     catch(err){
          responseType.statusText = "error";
          responseType.message = "Something went wrong. Please try again lator";
     }
     res.status(200).json(responseType);
}


module.exports.addGuest = async (req,res,next)=>{
    responseType = {};
    try{
        let hotelData = await Hotels.findOne({_id:req.body.hotelId});
        if(hotelData){
            ownerId = hotelData.owner_id;
        }
        let userType = await commonHelper.checkUserType(req._id);
        if(userType.user_type == "HOTEL_OWNER"){
             is_approved = "APPROVED";
        }else{
             is_approved = "PENDING";
        }
        
        var guest = new Guest();
        guest.firstName = req.body.firstName;
        guest.lastName = req.body.lastName;
        guest.dlImage = req.body.dlImage;
        guest.dob = req.body.dob;
        guest.dlNumber = req.body.dlNumber;
        guest.dlExpiryDate = req.body.dlExpiryDate;
        guest.dlState = req.body.dlState;
        guest.address = req.body.address;
        guest.city = req.body.city;
        guest.state = req.body.state;
        guest.zipCode = req.body.zipCode;       
        try {
               var feedback = new Feedback();
               let checkGuestExist = await Guest.findOne({dlNumber:req.body.dlNumber});
               //console.log(checkGuestExist);
              	
               let guestId = '';
               if(checkGuestExist != null){
                    guestId = checkGuestExist._id;
               }else{
                   // //console.log(guest);
                    let guestData = await guest.save();
                    guestId  = guestData._id;
               }
               //console.log(guestId);
              	
               if(guestId){                   
                    feedback.guestId = guestId;
                    feedback.hotelId = req.body.hotelId;
                    feedback.photos = req.body.photos;
                    feedback.videos = req.body.videos;
                    feedback.dnrReason = req.body.dnrReason;
                    feedback.comments = req.body.comments;
                    feedback.is_approved = is_approved;
                    feedback.added_by = req._id ;
                    feedback.ownerId = ownerId ;
                    try {
                         let lastId = await feedback.save();

                         let allUsers = await User.find({is_approved:'APPROVED'});
                         for (let index=0; index < allUsers.length; index++ ) {
                              if(allUsers[index]._id == req._id){
                                   continue;
                              }
                              var notification = new Notification();  
                              notification.feedbackId = lastId._id; 
                              notification.guestId = guestId;
                              notification.hotelId = req.body.hotelId;
                              notification.photos = req.body.photos;
                              notification.videos = req.body.videos;
                              notification.dnrReason = req.body.dnrReason;
                              notification.comments = req.body.comments;
                              notification.is_approved = is_approved;
                              notification.added_by = req._id ;
                              notification.ownerId = ownerId ;
                              notification.latitude = hotelData.latitude;
                              notification.longitude = hotelData.longitude;
                              notification.userId = allUsers[index]._id;
                              notification.status = 'unread';
                              await notification.save();
                         }

                         responseType.statusText = "success";
                         responseType.message = "Guest Added Successfully!";
                    }
                    catch(err){
                         let guestDelete =	await User.findByIdAndRemove({_id:guestData._id});		
                         responseType.statusText = "error";
                         responseType.message = "Something went wrong. Please try again!"+err;
                    }
               }
		}
		catch(err){		
			responseType.statusText = "error";
			responseType.message = "Something went wrong. Please try again lator"+err;
		}
    }
    catch(err){
        responseType.statusText = "error";
		responseType.message = "Something went wrong. Please try again lator"+err;
    }

    res.status(200).json(responseType);
}


module.exports.liveEventList = async (req,res,next)=>{ 
    
     responseType = {};
     const pageOptions = {
          page: req.params.page || 0,
          limit: req.query.limit || 10
      }

     let eventDataCount = await Feedback.aggregate([
          {"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) },"is_approved":'APPROVED'}},
          {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
          {"$replaceRoot":{"newRoot":"$doc"}}
     ]);
    // let eventData = await Feedback.find().skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).sort({_id:-1}).exec();

     eventData = await Feedback.aggregate([
          {"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) },"is_approved":'APPROVED'}}, 
          { $sort: {_id:-1, date: -1} },       
          {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
          {"$replaceRoot":{"newRoot":"$doc"}}
     ]).sort({date: -1}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).exec();
     
     const dataArray =[];
     for ( let index=0; index < eventData.length; index++ ) {
          let canView = false;
          if(eventData[index].ownerId == req._id){
               canView = true;
          }

          if(eventData[index].added_by == req._id){
               canView = true;
          }

          let guestData = await Guest.findOne({_id:eventData[index].guestId});
          
          if(guestData.length == 0){
               continue;
          }
          dataArray[index] = {
               'eventData':eventData[index],
               guestData,
               canView
          } 
     }

     if(eventData.length != 0){
          responseType.data = dataArray;
          responseType.totalData = eventDataCount.length;
          responseType.message = "live event list";
          responseType.statusText = "success";
     }else{
          responseType.message = "No record found";
          responseType.statusText = "error";
     }
     res.status(200).json(responseType);
}



module.exports.dnrList = async (req,res,next)=>{

     let userdata = await User.findOne({_id:req._id});
     let user_type = "";

     if(userdata){
          user_type = userdata.user_type;
     }

     if(user_type == 'FRONTDESK'){
          getFrontdeskDnrList(req,res);
     }else{
          getHotelOwnerDnrList(req,res);
     }

}


getFrontdeskDnrList= async (req,res)=>{
     responseType = {};
     let selectedhotelId = req.params.hotelId;
     const pageOptions = {
          page: req.params.page || 0,
          limit: req.query.limit || 10
      }

     let eventDataCount = [];
     if(selectedhotelId === 'all'){
          eventDataCount = await Feedback.aggregate([
               {"$match":{"added_by":req._id}}, 
               { $sort: {_id:-1, date: -1} },            
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}},
          ]);
     }else{
          eventDataCount = await Feedback.aggregate([
               {"$match":{"added_by":req._id,"hotelId":selectedhotelId}},  
               { $sort: {_id:-1, date: -1} },     
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}}
          ]);
     }
    
     let eventData = [];
     if(selectedhotelId === 'all'){
          eventData = await Feedback.aggregate([
               {"$match":{"added_by":req._id}},  
               { $sort: {_id:-1, date: -1} },           
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}}
          ]).sort({date: -1}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).exec();
          
     }else{
          eventData = await Feedback.aggregate([
               {"$match":{"added_by":req._id,'hotelId':selectedhotelId}},  
               { $sort: {_id:-1, date: -1} },           
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}}
          ]).sort({date: -1}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).exec();
     }
     
      
     const dataArray =[];
     for ( let index=0; index < eventData.length; index++ ) {
          let guestData = await Guest.findOne({_id:eventData[index].guestId});
          if(guestData.length == 0){
               continue;
          }
          dataArray[index] = {
               'eventData':eventData[index],
               guestData
          } 
     }
   // //console.log(eventData);
     if(eventData.length != 0){
          responseType.dataDnrList = dataArray;
          responseType.totalData = eventDataCount.length;
          responseType.message = "DNR event list";
          responseType.statusText = "success";
     }else{
          responseType.message = "No record found";
          responseType.statusText = "error";
     }
    // //console.log(responseType);
     res.status(200).json(responseType);
}


getHotelOwnerDnrList= async (req,res)=>{
     responseType = {};
     let selectedhotelId = req.params.hotelId; 
     const pageOptions = {
          page: req.params.page || 0,
          limit: req.query.limit || 10
      }

     let eventDataCount = [];
     if(selectedhotelId === 'all'){
          eventDataCount = await Feedback.aggregate([
               {"$match":{"ownerId":req._id,"is_approved":'APPROVED'}},            
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}},
          ]);
     }else{
          eventDataCount = await Feedback.aggregate([
               {"$match":{"ownerId":req._id,"hotelId":selectedhotelId,"is_approved":'APPROVED'}},      
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}}
          ]);
     }
    
     let eventData = [];
     if(selectedhotelId === 'all'){
          eventData = await Feedback.aggregate([
               { $sort: {_id:-1, date: -1} },
               {"$match":{"ownerId":req._id,"is_approved":'APPROVED'}},            
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}}
          ]).sort({date: -1}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).exec();
          
     }else{
          eventData = await Feedback.aggregate([
               { $sort: {_id:-1, date: -1} },
               {"$match":{"ownerId":req._id,'hotelId':selectedhotelId,"is_approved":'APPROVED'}},            
               {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
               {"$replaceRoot":{"newRoot":"$doc"}}
          ]).sort({date: -1}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).exec();
     }
     
      
     const dataArray =[];
     for ( let index=0; index < eventData.length; index++ ) {
          let guestData = await Guest.findOne({_id:eventData[index].guestId});
          if(guestData.length == 0){
               continue;
          }
          dataArray[index] = {
               'eventData':eventData[index],
               guestData
          } 
     }
    // //console.log(eventData.length);
     if(eventData.length != 0){
          responseType.dataDnrList = dataArray;
          responseType.totalData = eventDataCount.length;
          responseType.message = "DNR event list";
          responseType.statusText = "success";
     }else{
          responseType.message = "No record found";
          responseType.statusText = "error";
     }
     //console.log(responseType);
     res.status(200).json(responseType);
}


module.exports.getFeedbackDetails = async (req,res,next)=>{   

    let guestData = await Guest.findOne({_id:req.params.id});    
    let guestFeedbackList = await Feedback.find({guestId:guestData._id}).sort({_id:-1});
    const dataArray =[];
    
    for ( let index=0; index < guestFeedbackList.length; index++ ) {
           hotelData = await Hotels.findOne({_id:guestFeedbackList[index].hotelId});

           let canView = false;
          if(guestFeedbackList[index].ownerId == req._id){
               canView = true;
          }

          if(guestFeedbackList[index].added_by == req._id){
               canView = true;
          }

          dataArray[index] = {
               'guestDetails':guestFeedbackList[index],
               hotelData,
               canView
          } 
     }
    // //console.log(dataArray);
    if(guestFeedbackList){
         response.user = guestData;
         response.guestFeedbackList = dataArray;
         response.message = "Guest Details"; 
         response.statusText = "success";
    }else{
         response.message = "No record found";
         response.statusText = "error";
    }
    res.status(200).json(response);
}

module.exports.getGuestDetails = async (req,res,next)=>{   
   //  //console.log(req.params.id);
     let guestData = await Guest.findOne({_id:req.params.id});  
    
     if(guestData){
          response.user = guestData;
          response.message = "Guest Details"; 
          response.statusText = "success";
     }else{
          response.message = "No record found";
          response.statusText = "error";
     }
     res.status(200).json(response);
 }



 module.exports.searchGuest = async (req,res,next)=>{   
     let searchTerm = req.params.data;
     let guestData = await Guest.find({ 
          $or: [
              {"firstName": {$regex: searchTerm, $options: "i"}},
              {"lastName": {$regex: searchTerm, $options: "i"}},
              {"dlNumber": {$regex: searchTerm, $options: "i"}}
          ]
      });  

     ////console.log(guestData);
     //let guestDataFinal = _.pick(guestData,['_id','firstName','lastName']);
     if(guestData){
          response.user = guestData;
          response.message = "Search Result"; 
          response.statusText = "success";
     }else{
          response.message = "No record found";
          response.statusText = "error";
     }
     res.status(200).json(response);
}



module.exports.searchGuestLiting = async (req,res,next)=>{
    
     let searchTerm = req.params.data;
  
     let guestData = await Guest.find({ 
          $or: [
              {"firstName": {$regex: searchTerm, $options: "i"}},
              {"lastName": {$regex: searchTerm, $options: "i"}},
              {"dlNumber": {$regex: searchTerm, $options: "i"}}
          ]
      });
     
      const pageOptions = {
          page: req.params.page || 0,
          limit: req.query.limit || 10
      }

    
     guestDataCount = await Guest.find({ 
          $or: [
               {"firstName": {$regex: searchTerm, $options: "i"}},
               {"lastName": {$regex: searchTerm, $options: "i"}},
               {"dlNumber": {$regex: searchTerm, $options: "i"}}
          ]
     });


     guestData =  await Guest.find({ 
          $or: [
               {"firstName": {$regex: searchTerm, $options: "i"}},
               {"lastName": {$regex: searchTerm, $options: "i"}},
               {"dlNumber": {$regex: searchTerm, $options: "i"}}
          ]
     }).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).sort({_id:-1}).exec();
    
      
      
     const dataArray =[];
     for ( let index=0; index < guestData.length; index++ ) {
          let eventData = await Feedback.findOne({guestId:guestData[index]._id});
          if(eventData === null){
               continue; 
          }
          dataArray[index] = {
               'guestData':guestData[index],
               eventData
          } 
     }
    // //console.log(dataArray);
     if(guestData.length != 0){
          response.data = dataArray;
          response.totalData = guestDataCount.length;
          response.message = "Search result list";
          response.statusText = "success";
     }else{
          response.message = "No record found";
          response.statusText = "error";
     }
     res.status(200).json(response);
}


module.exports.getFeedbackDetailsById = async (req,res,next)=>{ 
     let response = {};
     let feedbackdata = await Feedback.findOne({_id:req.params.id}); 
     let guestData = await Guest.findOne({_id:feedbackdata.guestId}); 
     let hotelData = await Hotels.findOne({_id:feedbackdata.hotelId});
     
     if(feedbackdata){
          response.user = guestData;
          response.hotelData = hotelData;
          response.feedbackdata = feedbackdata;
          response.message = "Guest Details"; 
          response.statusText = "success";
     }else{
          response.message = "No record found";
          response.statusText = "error";
     }
     res.status(200).json(response);
 }

