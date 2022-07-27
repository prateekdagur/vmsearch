const mongoose = require('mongoose');
const Hotels = mongoose.model('Hotels');
const Guest = mongoose.model('Guest');
const User = mongoose.model('User');
const Feedback = mongoose.model('Feedback');
const _ = require('lodash');
const commonHelper = require('../lib/commonHelper');

module.exports.addFrontDeskManager = async (req,res,next)=>{
    responseType = {};        
    try {

        let hotelData = await Hotels.findOne({_id:req.body.frontDeskHotelId});
        
        var user = new User();  
        user.frontDeskHotelId = req.body.frontDeskHotelId;
        user.frontDeskFullName = req.body.frontDeskFullName;
        user.frontDeskUserName = req.body.frontDeskUserName;
        user.frontDeskPosition = req.body.frontDeskPosition;
        user.frontDeskEmpSince = req.body.frontDeskEmpSince;
        user.user_type =  'FRONTDESK';
        user.hotelname = hotelData.hotelname;        
        user.address = hotelData.address;
        user.state = hotelData.state;
        user.city = hotelData.city;
        user.zipcode = hotelData.zipcode;
        user.phonenumber = Date.now();
        user.added_by = req._id;
        user.is_approved = 'APPROVED';
        user.email = Date.now()+"@vmsearch.com";
        user.password = req.body.password;

        let userData = await User.findOne({frontDeskUserName:req.body.frontDeskUserName});
        if(userData){
            responseType.statusText = "error";
            responseType.message = "Username already exist!";
        }else{
            await user.save();
            responseType.statusText = "success";
            responseType.message = "Front Desk Manager added successfully.";
        }
        ////console.log(user);
        
    }
    catch(err){		
        responseType.statusText = "error";
        responseType.message = "Something went wrong. Please try again lator"+err;
    }

    res.status(200).json(responseType);
}


module.exports.frontDeskList = async (req,res,next)=>{ 
    response = {};
    const pageOptions = {
         page: parseInt(req.params.page, 10) || 0,
         limit: parseInt(req.query.limit, 10) || 10
     }

    let frontDeskDataCount = await User.find({added_by:req._id,user_type:'FRONTDESK'});
    
    //let frontDesk = await User.find({added_by:req._id,user_type:'FRONTDESK'}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).sort({_id:-1}).exec();

    let frontDesk = await User.find({added_by:req._id,user_type:'FRONTDESK'}).sort({_id:-1});

    const dataArray =[];
    for ( let index=0; index < frontDesk.length; index++ ) {
        let infoUser = _.pick(frontDesk[index],['_id','frontDeskFullName','frontDeskUserName','frontDeskPosition','frontDeskEmpSince','date','hotelname','address']);
         dataArray[index] = {
            infoUser
         } 
    }

    if(frontDesk.length != 0){
         response.data = dataArray;
         response.totalData = frontDeskDataCount.length;
         response.message = "Front Desk List";
         response.statusText = "success";
    }else{
         response.message = "No record found";
         response.statusText = "error";
    }
    res.status(200).json(response);
}


module.exports.getFrontDeskDetails = async (req,res,next)=>{
        response = {};
        let frontDeskDetails = await User.findOne({_id:req.params.id});
        let infoUser = _.pick(frontDeskDetails,['_id','frontDeskFullName','frontDeskUserName','frontDeskPosition','frontDeskEmpSince','date','hotelname','address','frontDeskHotelId']);
        if(frontDeskDetails){  
            response.data = infoUser;
            response.message = "Front Desk details";
            response.statusText = "success";
       }else{
            response.message = "No record found";
            response.statusText = "error";
       }
       res.status(200).json(response);
}



module.exports.editFrontDeskManager = async (req,res,next)=>{
    responseType = {};
   try{ 
        let hotelData = await Hotels.findOne({_id:req.body.frontDeskHotelId}); 
      
        const paramsArray = {
            frontDeskHotelId :req.body.frontDeskHotelId,
            frontDeskFullName :req.body.frontDeskFullName,
            frontDeskUserName : req.body.frontDeskUserName,
            frontDeskPosition:req.body.frontDeskPosition,
            frontDeskEmpSince: req.body.frontDeskEmpSince,
            user_type : 'FRONTDESK',
            hotelname : hotelData.hotelname,      
            address : hotelData.address,
            state :hotelData.state,
            city:hotelData.city,
            zipcode :hotelData.zipcode,
            phonenumber: Date.now(),
            added_by: req._id,
            is_approved :'APPROVED',
            email: Date.now()+"@vmsearch.com",

       } 

        if(req.body.password){            
            paramsArray["password"] = req.body.password;
        }

        let frontDeskdata = await User.findOne({_id:req.params.id});
        let userData = {};
        if(frontDeskdata.frontDeskUserName != req.body.frontDeskUserName){
             userData = await User.findOne({frontDeskUserName:req.body.frontDeskUserName});
             if(userData){
                responseType.statusText = "error";
                responseType.message = "Username already exist!";
                res.status(200).json(responseType);
             }else{
                let updateFrontDeskData = await  User.findOneAndUpdate({_id:req.params.id},{$set: paramsArray},{upsert : true});
                responseType.statusText = "success";
                responseType.message = "Information updated successfully";
             }
        }else{
            let updateFrontDeskData = await  User.findOneAndUpdate({_id:req.params.id},{$set: paramsArray},{upsert : true});
            responseType.statusText = "success";
            responseType.message = "Information updated successfully";
        }
        
        
    }
    catch(err){
         responseType.statusText = "error";
         responseType.message = "Something went wrong. Please try again lator"+err;
    }
    res.status(200).json(responseType);
}


module.exports.deleteFrontdesk=(req,res,next)=>{
    responseType= {};
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            responseType.statusText = "success";
            responseType.message = "Information updated successfully";
        } else {
            responseType.statusText = "error";
            responseType.message = "Something went wrong. Please try again lator"+err;
        }
        res.status(200).json(responseType);

    });
}

