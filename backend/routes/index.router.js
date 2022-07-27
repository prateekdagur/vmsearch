const express = require("express");
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const { uploadFile,uploadFileLoggedUser } = require('../s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)
const ctrlUser = require('../controllers/user.controllers');
const ctrlHotel = require('../controllers/hotel.controllers');
const ctrlGuest = require('../controllers/guest.controllers');
const ctrlPayment = require('../controllers/payment.controllers');
const ctrlCommon = require('../controllers/common.controllers');
const ctrlFeedback = require('../controllers/feedback.controllers');
const ctrlFrontdesk = require('../controllers/frontdesk.controllers');
const {verifyJwtToken} = require('../config/jwtHelper');
const mongoose = require('mongoose');
const Hotels = mongoose.model('Hotels');


/*******************Front Desk ******************************/
router.post('/editFrontDeskManager:id', verifyJwtToken, ctrlFrontdesk.editFrontDeskManager);
router.post('/addFrontDeskManager', verifyJwtToken, ctrlFrontdesk.addFrontDeskManager);
router.get('/frontDeskList', verifyJwtToken, ctrlFrontdesk.frontDeskList);
router.get('/getFrontDeskDetails/:id', verifyJwtToken, ctrlFrontdesk.getFrontDeskDetails);
router.delete('/deleteFrontdesk/:id', verifyJwtToken, ctrlFrontdesk.deleteFrontdesk);


/**************************feedback*************** */
router.get('/getFeedbackRejected',verifyJwtToken,ctrlFeedback.getFeedbackRejected)
router.get('/approveFeedback/:id', verifyJwtToken, ctrlFeedback.approveFeedback);
router.get('/rejectFeedback/:id', verifyJwtToken, ctrlFeedback.rejectFeedback);
router.post('/addFeedback/:id', verifyJwtToken, ctrlFeedback.addFeedback);
router.post('/editFeedback/:id', verifyJwtToken, ctrlFeedback.editFeedback);
router.get('/getFeedbackSingle/:id', verifyJwtToken, ctrlFeedback.getFeedbackSingle);
router.get('/feedbackApprovalList', verifyJwtToken, ctrlFeedback.feedbackApprovalList);


/***************common controller*************/
router.get('/getContactInfo',verifyJwtToken,ctrlCommon.getContactInfo);
router.get('/subscriptionList', verifyJwtToken, ctrlCommon.subscriptionList);
router.get('/getDnrTitle/:id', verifyJwtToken, ctrlCommon.getDnrTitle);
router.get('/getDnrReasonList', verifyJwtToken, ctrlCommon.getDnrReasonList);
router.get('/dashboard', verifyJwtToken, ctrlCommon.dashboard);
router.get('/myAccount', verifyJwtToken, ctrlCommon.myAccount);


/**********************payment controllers******************/
router.post('/makePayment', verifyJwtToken, ctrlPayment.makePayment);
router.get('/checkSubscriptionStatus', verifyJwtToken, ctrlPayment.checkSubscriptionStatus);


/**************Guest controller */
router.get('/readNotificationUpdate/', verifyJwtToken, ctrlGuest.readNotificationUpdate);
router.get('/notificationList/:page', verifyJwtToken, ctrlGuest.notificationList);
router.get('/searchGuestLiting/:data', verifyJwtToken, ctrlGuest.searchGuestLiting);
router.get('/searchGuest/:data', verifyJwtToken, ctrlGuest.searchGuest);
router.get('/getGuestDetails/:id', verifyJwtToken, ctrlGuest.getGuestDetails);
router.get('/dnrList/:page/:hotelId', verifyJwtToken, ctrlGuest.dnrList);
router.post('/editGuest/:id', verifyJwtToken, ctrlGuest.editGuest);
router.post('/addGuest', verifyJwtToken, ctrlGuest.addGuest);
router.get('/liveEventList/:page', verifyJwtToken, ctrlGuest.liveEventList);
router.get('/getFeedbackDetails/:id', verifyJwtToken, ctrlGuest.getFeedbackDetails);
router.get('/getFeedbackDetailsById/:id', verifyJwtToken, ctrlGuest.getFeedbackDetailsById);


/**************User controller */
router.post('/sendContactInfo',verifyJwtToken,ctrlUser.sendContactInfo);
router.get('/myAccountFrontDesk',verifyJwtToken,ctrlUser.myAccountFrontDesk);
router.post('/changePassword',verifyJwtToken,ctrlUser.changePassword);
router.post('/changePasswordFront',verifyJwtToken,ctrlUser.changePasswordFront);
router.post('/resetPassword',ctrlUser.resetPassword);
router.post('/verifyOtp',ctrlUser.verifyOtp);
router.post('/verifyEmail',ctrlUser.verifyEmail);
router.post('/register',ctrlUser.register);
router.post('/authenticate',ctrlUser.authenticate);
router.post('/authenticateFrontDesk',ctrlUser.authenticateFrontDesk);
router.get('/userDetails', verifyJwtToken, ctrlUser.userDetails);
router.get('/getUserRole', verifyJwtToken, ctrlUser.getUserRole);



/**************hotel controller */
router.put('/editHotel/:id', verifyJwtToken, ctrlHotel.editHotel);
router.get('/getHotelDetails/:id', verifyJwtToken, ctrlHotel.getHotelDetails);
router.delete('/deleteHotel/:id', verifyJwtToken, ctrlHotel.deleteHotel);
router.post('/addHotel', verifyJwtToken, ctrlHotel.addHotel);
router.get('/getMyHotels', verifyJwtToken, ctrlHotel.getMyHotels);
router.get('/getActiveHotels', verifyJwtToken, ctrlHotel.getActiveHotels);


router.post('/uploadfile', upload.single('file'), async function (req, res, next) { 
  //console.log(req._id);
    const result = await uploadFile(req.file)
    await unlinkFile(req.file.path);
    res.send({'file_location':result.Location});
  })

router.post('/uploadFileLoggedUser', verifyJwtToken, upload.single('file'), async function (req, res, next) {    
      let hotelData = await Hotels.findOne({owner_id:req._id});      
      if(hotelData){
        let result = await uploadFileLoggedUser(req.file,hotelData._id)
        await unlinkFile(req.file.path);
        res.send({'file_location':result.Location});
      }else{
        const result = await uploadFile(req.file)
        await unlinkFile(req.file.path);
        res.send({'file_location':result.Location});
      }           
})


module.exports = router;