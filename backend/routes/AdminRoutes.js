const router = require("express").Router();
const adminAuth = require('../config/adminAuth')
 const adminRole = require('../config/adminrole')
const userController = require("../controllers/AdminController");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const { uploadFile,uploadFileLoggedUser } = require('../s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)
const mongoose = require('mongoose');
const Hotels = mongoose.model('Hotels');


//Route url to register user.
// router.post("/register", userController.register);
//Route url to login user.
router.post("/loginAdmin", userController.login);
router.post("/createAdminDnr", userController.createAdminDnr);
router.post("/createAdminSubscription", userController.createAdminSubscription);
router.post("/createAdminSettings", userController.createAdminSettings);
router.post("/resetAdminPassword", userController.resetAdminPassword);

  
router.get("/getAdminGuestDetails/:id", userController.getAdminGuestDetails);
router.get("/getAdminDnrByName", userController.getAdminDnrByName);
router.get("/getAdminHotelByName", userController.getAdminHotelByName);
router.get("/getAdminHotelByAddress", userController.getAdminHotelByAddress);
router.get("/getAdminHotelByEmail", userController.getAdminHotelByEmail);
router.get("/getAdminUserByEmail", userController.getAdminUserByEmail);
router.get("/getAdminHotelByNumber", userController.getAdminHotelByNumber);
router.get("/getAdminHotelByZip", userController.getAdminHotelByZip);
router.get("/getAdminSubscriptionByTitle", userController.getAdminSubscriptionByTitle);
router.get("/getAdminSubscriptionByMonth", userController.getAdminSubscriptionByMonth);
router.get("/getAdminSubscriptionByBenefitTitle", userController.getAdminSubscriptionByBenefitTitle);
router.get("/getAdminFrontDeskByName", userController.getAdminFrontDeskByName);
router.get("/getAdminFrontDeskByHotelName", userController.getAdminFrontDeskByHotelName);
router.get("/getAdminFrontDeskByUserName", userController.getAdminFrontDeskByUserName);
router.get("/getAdminFrontDeskByPosition", userController.getAdminFrontDeskByPosition);
router.get("/getAdminFrontDeskByEmpSince", userController.getAdminFrontDeskByEmpSince);

router.get("/getAdminLiveEventsByName", userController.getAdminLiveEventsByName);
//router.get("/getAdminliveEventListByHotelName", userController.getAdminliveEventListByHotelName);



router.get("/getAdminUserByNumber", userController.getAdminUserByNumber);
router.get("/getAdminSubscription", userController.getAdminSubscription);
router.get("/getAdminHotels/:status",   userController.getAdminHotels);
router.get("/getAdminDnr/:sortStatus",  userController.getAdminDnr);
router.get('/adminfrontDeskList', userController.getAdminFrontDeskList);
router.get('/getAdminFeedbackSingle/:id', userController.getAdminFeedbackSingle);


router.post('/editAdminFeedback/:id', userController.editAdminFeedback);
router.patch("/updateHotelStatus/:id",  userController.updateHotelStatus);
router.delete("/deleteAdminDnr/:id",   userController.deleteAdminDnr);
router.delete("/deleteAdminFeed/:id",   userController.deleteAdminFeed);
router.delete("/deleteAdminSubs/:id",   userController.deleteAdminSubs);
router.patch("/updateAdminDnrStatus/:id",   userController.updateAdminDnrStatus);
router.patch("/updateAdminDnr/:id",   userController.updateAdminDnr);
router.patch("/updateAdminSettings",   userController.updateAdminSettings);
router.patch("/updateAdminSubscription/:id",   userController.updateAdminSubscription);
router.patch("/updateAdminUserDeleteStatus/:id",   userController.softDeleteUser);
router.patch("/updateAdminHotelDeleteStatus/:id",   userController.softDeleteHotel);
router.patch("/updateAdminFrontDeskManDeleteStatus/:id",   userController.softDeleteFrontdeskMan);

router.patch("/updateUserStatus/:id", userController.updateUserStatus);

router.get("/getAdminUsers/:status",  userController.getAdminUsers);
router.get("/getAdminViewUser/:id",  userController.getAdminViewUsers);
router.get("/getAdminViewHotel/:id",  userController.getAdminViewHotels);

router.get("/getAdminliveEventList",  userController.getAdminLiveEventList);
router.get("/getAdminSettings",  userController.getAdminSettings);
router.get("/getAdminSettingsId/:id",  userController.getAdminSettingsId);
router.get("/getAdminSubscription/:id",   userController.getAdminSubscriptionbyId);
router.get("/getAdminDnrbyId/:id",   userController.getAdminDnrbyId);


router.get("/getAdminTransaction",  userController.getAdminTransaction);
// router.get("/getAdminFeedback",  userController.getAdminFeedback);
router.get("/getAdminHotelDetails/:id",  userController.getAdminHotelDetails);


router.post('/uploadAdminFileLoggedUser', upload.single('file'), async function (req, res, next) {    
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


//router.get('/admin/dashboard', verifyJwtToken, ctrlCommon.dashboard);
// //Route url to logout user.
// router.post("/logout", userController.logout);
// //Route url to refresh the token.
// router.post("/refresh_token", userController.refreshToken);
// //Route url to get user.
// router.get("/infor", userController.getUser);

module.exports = router;