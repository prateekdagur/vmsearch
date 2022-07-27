const mongoose = require('mongoose');
const Hotels = mongoose.model('Hotels');
const Guest = mongoose.model('Guest');
const Notification = mongoose.model('Notification');
const User = mongoose.model('User');
const Feedback = mongoose.model('Feedback');
const _ = require('lodash');
const commonHelper = require('../lib/commonHelper');

module.exports.addFeedback = async (req,res,next)=>{
    responseType = {};

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
        
    try {
        var feedback = new Feedback();  
        feedback.guestId = req.params.id;
        feedback.hotelId = req.body.hotelId;
        feedback.photos = req.body.photos;
        feedback.videos = req.body.videos;
        feedback.dnrReason = req.body.dnrReason;
        feedback.comments = req.body.comments;
        feedback.is_approved = is_approved;
        feedback.added_by = req._id ;
        feedback.ownerId = ownerId ;
        let lastId = await feedback.save();       

        let allUsers = await User.find({is_approved:'APPROVED'});
       
        
        for (let index=0; index < allUsers.length; index++ ) {
            if(allUsers[index]._id == req._id){
                continue;
            }
            var notification = new Notification(); 
            notification.feedbackId = lastId._id; 
            notification.guestId = req.params.id;
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
        responseType.message = "Feedback added successfully.";
    }
    catch(err){		
        responseType.statusText = "error";
        responseType.message = "Something went wrong. Please try again lator"+err;
    }

    res.status(200).json(responseType);
}


module.exports.getFeedbackSingle = async (req,res,next)=>{   
    response = {};
    let feedbackData = await Feedback.findOne({_id:req.params.id});  
   
    if(feedbackData){
         response.feedback = feedbackData;
         response.message = "Guest Details"; 
         response.statusText = "success";
    }else{
         response.message = "No record found";
         response.statusText = "error";
    }
    res.status(200).json(response);
}


module.exports.editFeedback = async (req,res,next)=>{  
    response = {};

    const paramsArray = {
        hotelId: req.body.hotelId,
        photos:  req.body.photos,
        videos:  req.body.videos,
        dnrReason:  req.body.dnrReason,
        comments: req.body.comments,
    }
    ////console.log(paramsArray);
   let updateFeedback = await Feedback.findOneAndUpdate({_id:req.params.id},{$set: paramsArray},{upsert : true});
   if(updateFeedback){
        response.message = "Record Updated Successfully!"; 
        response.statusText = "success";
    }else{
        response.message = "No record found";
        response.statusText = "error";
    }
    res.status(200).json(response);

}


module.exports.feedbackApprovalList = async (req,res,next)=>{
    try{
        response = {};
        let feedbackData = await Feedback.find({ownerId:req._id,'is_approved':'PENDING'});  
        const dataArrayDnr =[];

        for ( let index=0; index < feedbackData.length; index++ ) {
            let guestData = await Guest.findOne({_id:feedbackData[index].guestId});
            let hotelData = await Hotels.findOne({_id:feedbackData[index].hotelId});
            dataArrayDnr[index] = {
                'eventData':feedbackData[index],
                guestData,
                hotelData
            } 
        }
        
        if(feedbackData){
            response.feedback = dataArrayDnr;
            response.message = "Feedback Approval List"; 
            response.statusText = "success";
        }else{
            response.message = "No record found";
            response.statusText = "error";
        }
       
    }catch(err){
        response.message = "Something Went Wrong!";
        response.statusText = err;
    }
    res.status(200).json(response);
}

module.exports.approveFeedback = async (req, res, next)=>{
    response = {};
    try{
        //console.log(req.params.id);
        const paramsArray = {
            is_approved: 'APPROVED',
        }

        let result = await Feedback.findOneAndUpdate({_id:req.params.id},{$set: paramsArray},{upsert : true});
        response.message = "Feedback Approved Successfully!"; 
        response.statusText = "success";
    }catch(error){
        response.message = "Something Went Wrong!";
        response.statusText = err;
    }
    res.status(200).json(response);
}

module.exports.rejectFeedback = async (req, res, next)=>{
    response = {};
    try{
        //console.log(req.params.id);
        const paramsArray = {
            is_approved: 'REJECTED',
        }

        let result = await Feedback.findOneAndUpdate({_id:req.params.id},{$set: paramsArray},{upsert : true});
        response.message = "Feedback Rejected Successfully!"; 
        response.statusText = "success";
    }catch(error){
        response.message = "Something Went Wrong!";
        response.statusText = err;
    }
    res.status(200).json(response);
}

module.exports.getFeedbackRejected =async(req,res,next)=>{
    response = {};
    let guestFeedbackList = await Feedback.find({ownerId:req._id,is_approved:'REJECTED'}).sort({_id:-1});
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
         response.guestFeedbackList = dataArray;
         response.message = "Rejected Feedabck List"; 
         response.statusText = "success";
    }else{
         response.message = "No record found";
         response.statusText = "error";
    }
    res.status(200).json(response);
}
