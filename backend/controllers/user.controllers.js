const mongoose = require('mongoose');
const User = mongoose.model('User');
const Hotels = mongoose.model('Hotels');
const Payment = mongoose.model('Payment');
const Settings = mongoose.model('Settings');
const Otp = mongoose.model('Otp')
var AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
const _ = require('lodash');
require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcryptjs');

module.exports.register = async (req,res,next)=>{
	var timestamp = Number(new Date());
	const responseType = {};
	var user = new User();
	user.hotelname = req.body.hotelname;
	user.phonenumber = req.body.phonenumber;
	user.email = req.body.email;
	user.address = req.body.address;
	user.city = req.body.city;
	user.state = req.body.state;
	user.zipcode = req.body.zipcode;
	user.password = req.body.password;
	user.frontDeskUserName=timestamp;
	user.latitude = req.body.latitude;
	user.longitude = req.body.longitude;
	user.loc = {
		"type" : "Point",
		"coordinates" : req.body.loc
	};
	user.tax_filename = req.body.tax_filename;
	user.bill_filename = req.body.bill_filename;
	user.is_active = req.body.is_active || 'ACTIVE';
	user.is_approved = req.body.is_active || 'PENDING';
	user.user_type = req.body.user_type || 'HOTEL_OWNER';
	user.added_by = req.body.added_by || '';
	//console.log(user);
	
	try {
		let userData = await user.save();
		var hotels = new Hotels();
		hotels.hotelname = userData.hotelname;
		hotels.phonenumber = userData.phonenumber;
		hotels.email = userData.email;
		hotels.address = userData.address;
		hotels.city = userData.city;
		hotels.state = userData.state;
		hotels.zipcode = userData.zipcode;
		hotels.latitude = userData.latitude;
		hotels.longitude = userData.longitude;
		hotels.loc = req.body.loc;
		hotels.tax_filename = userData.tax_filename;
		hotels.bill_filename = userData.bill_filename;
		hotels.is_approved =  'PENDING';
		hotels.owner_id = userData._id || '';
		try {
			let hotelData = await hotels.save();
			responseType.statusText = "success";
			responseType.message = "Please wait for the admin approval";
		}
		catch(err){
			let deletUser =	await User.findByIdAndRemove({_id:userData._id});		
			responseType.statusText = "error";
			responseType.message = "Something went wrong. Please contact admin!";
		}
		
	}
	catch (err) {
		if(err.code = 11000){
			responseType.statusText = "error";
			responseType.message = "User already registered with the provided phone number or Email-id.";				
		}else{
			responseType.statusText = "error";
			responseType.message = "Something went wrong. Please contact admin!";
		}
		
	}	

	res.status(200).json(responseType);

}

module.exports.authenticate = (req,res,next)=>{
	passport.authenticate('local',(err,user,info)=>{
		if(err) {
			return res.status(400).json(err);
		}else if(user){
			return res.status(200).json({"token": user.generateJwt(),'user_type':user.user_type});
		}else{
			 return res.status(404).json(info);
		}
	})(req,res);	
}

module.exports.authenticateFrontDesk = async (req,res,next)=>{
	
	try {
		const { username, password } = req.body;
		//Finding user's email.
		const user = await User.findOne({ frontDeskUserName: username });
		if (!user) {
			return res.status(400).json({ message: "Wrong Username or Password!" });
		}

		if (!user.verifyPassword(password)) {
			return res.status(400).json({ message: "Wrong Password!" });
		}

		if(user){
			return res.status(200).json({"token": user.generateJwt(),'user_type':user.user_type});
		}
		
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}


module.exports.getUserRole = async (req,res,next)=>{
	try{
		let userData = await User.findOne({_id:req._id});
		return res.status(200).json({'UserType':userData.user_type});
	}
	catch(error){
		return res.status(500).json({ msg: error.message });
	}
	

}


module.exports.userDetails = (req,res,next)=>{
	User.findOne({_id:req._id},
		(err,user)=>{
				if(!user)
				return res.status(404).json({ status:false , message:"User not found!"});
				else
				return res.status(200).json({ status:true,user:_.pick(user,['_id','hotelname','email','user_type']) });
			}
		);
}


module.exports.verifyEmail = async (req,res,next)=>{	
	let data = await User.findOne({email:req.body.email});
	const responseType = {};
	if(data){
		let otpCode = Math.floor(100000 + Math.random() * 900000);
		let otpData = new Otp({
			email:req.body.email,
			code:otpCode,
			expireIn: new Date().getTime()+300*1000
		})
		
		let otpResponse = await otpData.save();

		/**************E-mail OTP *********/

		var transporter = nodemailer.createTransport({
				host: process.env.HOST_EMAIL_SMTP,
				port: process.env.PORT_EMAIL_SMTP,
				secure: true, // secure:true for port 465, secure:false for port 587
				auth: {
					user: process.env.USER_EMAIL_SMTP,
					pass: process.env.PASSWORD_EMAIL_SMTP,
				}
		  });
		  
		  var mailOptions = {
			from: 'donot@trigma.in',
			to: req.body.email,
			subject: 'OTP Verification',
			text: 'Your one time verification code is: '+otpCode
		  };
		  
		  transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log('Error: ' +error);
				responseType.statusText = "err";
				responseType.message = "Something Went Wrong. Please try again!";
				res.status(404).json(responseType);
			} else {
				console.log('Email sent: ' + info.response);
				responseType.statusText = "success";
				responseType.message = "Please check your email id for otp";
				res.status(200).json(responseType);
			}
		  });

		/*********E-mail OTP*********/

		
	}else{
		responseType.statusText = "success";
		responseType.message = "E-mail ID does not exist";
		res.status(200).json(responseType);
	}	
}


module.exports.verifyOtp= async (req,res,next)=>{
	let data = await Otp.find({email:req.body.email,code:req.body.otp});	
	const response = {};
	if(data.length != 0){
		let currentTime = new Date().getTime();
		let diff	= data.expireIn - currentTime;
		if(diff < 0){
			response.message = "Token Expired";
			response.statusText = "error";
			res.status(404).json(response);
		}else{			
			response.message = "OTP Verified Successfully";
			res.statusText = "success";
			res.status(200).json(response);
		}		
	}else{
		response.message = "Invalid OTP";
		response.statusText = "error";
		res.status(404).json(response);
	}	
}

module.exports.sendContactInfo = async (req, res, next) =>{
	const response = {};
	try{
		var transporter = nodemailer.createTransport({
			host: process.env.HOST_EMAIL_SMTP,
			port: process.env.PORT_EMAIL_SMTP,
			secure: true, // secure:true for port 465, secure:false for port 587
			auth: {
				user: process.env.USER_EMAIL_SMTP,
				pass: process.env.PASSWORD_EMAIL_SMTP,
			}
	  	});

		let getEmail = await Settings.findOne();

		var mailOptions = {
			from: 'donot@trigma.in',
			to: getEmail.contact_us_email,
			subject: 'New Query Front Desk',
			text: req.body.heading+": "+ req.body.message
		  };
		  
		  transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log('Error: ' +error);
				response.statusText = "errEmail";
				response.message = "Something Went Wrong. Please try again!";
				
			} else {
				console.log('Email sent: ' + info.response);
				response.statusText = "success";
				response.message = "We have recived your query. We will get back to you soon.";
				
			}
			res.status(200).json(response);
		  });
	}catch(err){
		response.statusText = "err";
		response.message = "Something Went Wrong. Please try again!";
		res.status(200).json(response);
	}
	
}

module.exports.resetPassword = async (req,res,next) =>{
	let data = await Otp.find({email:req.body.email,code:req.body.otp});
	const response = {};
	if(data.length == 0){
		response.statusText = "error";	
		response.message = "Something went wrong. Please contact admin.";		
		res.status(404).json(response);
	}

	req.body.password = await bcrypt.hash(req.body.password, 8);	
	let update = await User.findOneAndUpdate({email:req.body.email},{$set: req.body},{upsert : true});
	if(update){
		response.statusText = "success";	
		response.message = "Password Updated successfully.";		
		res.status(200).json(response);
	}else{
		response.statusText = "error";	
		response.message = "Something went wrong. Please contact admin.";		
		res.status(404).json(response);
	}
}


module.exports.changePassword = async (req,res,next) =>{
	const response = {};
	try{
		req.body.password = await bcrypt.hash(req.body.password, 8);	
		let update = await User.findOneAndUpdate({_id:req._id},{$set: req.body},{upsert : true});
		response.statusText = "success";	
		response.message = "Password Updated successfully.";		
		res.status(200).json(response);
	}
	catch(error){
		response.statusText = "error";	
		response.message = "Something went wrong. Please contact admin.";		
		res.status(200).json(response);
	}
}


module.exports.changePasswordFront = async (req,res,next) =>{
	const response = {};
	try{
		let checkOld = await User.findOne({_id:req._id});
		if(checkOld){
			let isValidPassword = await bcrypt.compare(req.body.oldPassword, checkOld.password);
			
			if (!isValidPassword) {
				response.statusText = "error";	
				response.message = "Invalid Old Password";
			}else{
				req.body.password = await bcrypt.hash(req.body.password, 8);	
				await User.findOneAndUpdate({_id:req._id},{$set: req.body},{upsert : true});
				response.statusText = "success";	
				response.message = "Password Updated successfully.";
			}
			
		}
	}
	catch(error){
		response.statusText = "error";	
		response.message = "Something went wrong. Please contact admin.";
	}
	res.status(200).json(response);
}


module.exports.myAccountFrontDesk = async (req,res,next) =>{
	const response = {};
	try{
		let userData = await User.findOne({_id:req._id});
		let infoUser = _.pick(userData,['_id','frontDeskFullName','frontDeskUserName','frontDeskPosition','frontDeskEmpSince','date','hotelname','address']);
		response.statusText = "success";	
		response.userData = infoUser;	
		response.message = "Front desk profile info";
	}catch(error){
		response.statusText = "error";	
		response.message = "Something went wrong. Please contact admin.";		
	}			
	res.status(200).json(response);
}




