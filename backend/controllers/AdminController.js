const mongoose = require("mongoose");
const { response } = require("express");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = mongoose.model("User");
const Dnr = mongoose.model("Dnr");
const Hotels = mongoose.model("Hotels");
const Guest = mongoose.model("Guest");
const Feedback = mongoose.model("Feedback");
const Payment = mongoose.model("Payment");
const Subcription = mongoose.model("Subcription");
const Settings = mongoose.model("Settings");

// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';
var nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");

const userController = {
	//Function to login user.
	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			//Finding user's email.
			const user = await User.findOne({ email: email });
			if (!user) {
				return res.status(400).json({ message: "Email does not exist" });
			}
			if (user.user_type === "HOTEL_OWNER") {
				return res.status(400).json({ msg: "Admin access denied" });
			}
			if (!user.verifyPassword(password)) {
				return res.status(400).json({ message: "Wrong Password!" });
			}
			const ide = user._id.toString();
			//Creating access token.
			const accesstoken = createAccessToken({ id: ide });
			res.json({
				msg: "Login Success",
				accesstoken,
				role: user.role,
				email: user.email,
				user: {
					...user._doc,
					password: " ",
				},
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},


getAdminGuestDetails: async (req,res)=>{   
		//  console.log(req.params.id);
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
	  },

	resetAdminPassword: async (req, res) => {
		try {
			let {email, oldPassword, newPassword, confirmPassword} = req.body
			const user = await User.findOne({ email: email });
			if(user.user_type === "HOTEL_OWNER"){
				return res.status(400).json({ msg: "Admin Denied!" });
			}
			if (!user.verifyPassword(oldPassword)) {
				return res.status(400).json({ message: "Old password does not match!" });
			}
			const salt = await  bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(newPassword, salt);
			console.log(hash, "hash")
			const updatePassword = await User.findOneAndUpdate({ email: email }, {password: hash});
			res.json({ msg: "Password is changed successfully"});
		} catch {
			return res.status(500).json({ msg: err.message });
		}
	},




	//Function to get the user
	getAdminHotels: async (req, res) => {
		try {
			const status = req.params.status
			
			if(status === "ALL"){

			const hotels = await Hotels.find({soft_delete_hotel: true}).sort({ $natural: -1 })
			if (!hotels) {
				return res
					.status(400)
					.json({ msg: "Hotels are not available right now!" });
			}
			res.json(hotels);
		} else {
			const hotels = await Hotels.find({is_approved: status, soft_delete_hotel:true}).sort({ $natural: -1 })
			if (!hotels) {
				return res
					.status(400)
					.json({ msg: "Hotels are not available right now!" });
			}
			res.json(hotels);
		}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAdminTransaction: async (req, res) => {
		try {
			const transaction = await Payment.find().sort({ $natural: -1 }).limit();
			if (!transaction) {
				return res
					.status(400)
					.json({ msg: "Transaction are not available right now!" });
			}
			res.json(transaction);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	updateHotelStatus: async (req, res) => {
		try {
			let ide = req.params.id;
			let status = req.body.is_approved;
			const hotel_status = await Hotels.findOneAndUpdate(
				{ _id: ide },
				{
					is_approved: status,
				},
			);
			if (!hotel_status) {
				return res.status(400).json({ msg: "Hotels is not updated!" });
			}

			res.json(hotel_status);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	updateUserStatus: async (req, res) => {
		try {
			let ide = req.params.id;
			let status = req.body.is_approved;
			statusCheck = await User.findById(ide);
			if (statusCheck.is_approved === "REJECTED") {
				return res.status(400).json({ msg: "This User has been Rejected" });
			}
			const user_status = await User.findOneAndUpdate(
				{ _id: ide },
				{
					is_approved: status,
				},
			);
			// if (user_status) {
			// 	const hotel_status = await Hotels.findOneAndUpdate(
			// 		{ owner_id: ide },
			// 		{
			// 			is_approved: status,
			// 		},
			// 	);
			// }
			if (!user_status) {
				return res.status(400).json({ msg: "User is not updated!" });
			}

			res.json(user_status);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminUsers: async (req, res) => {
		try {
			const status = req.params.status
			if(status === "ALL"){
				const allUser = await User.find();
				if (!allUser) {
					return res.status(400).json({ msg: "No users Exist!" });
				}
	
				for (i = 0; i < allUser.length; i++) {
					let idd = await allUser[i]._id;
					const user_count = await Hotels.count({ owner_id: idd });
	
					const updateHotelCounts = await User.findOneAndUpdate(
						{ _id: idd },
						{
							counts: user_count,
						},
					);
				}
	
				const users = await User.find({user_type: "HOTEL_OWNER", soft_delete_user: true}).sort({ $natural: -1 });
				console.log(allUser, "hhhhhhhhhhh")
				res.json({ users });
			} else {
				const allUser = await User.find({soft_delete_user: true});
				if (!allUser) {
					return res.status(400).json({ msg: "No users Exist!" });
				}
	
				for (i = 0; i < allUser.length; i++) {
					let idd = await allUser[i]._id;
					const user_count = await Hotels.count({ owner_id: idd });
	
					const updateHotelCounts = await User.findOneAndUpdate(
						{ _id: idd },
						{
							counts: user_count,
						},
					);
				}
	
				const users = await User.find({is_approved: status, user_type: "HOTEL_OWNER"}).sort({ $natural: -1 });
			
				res.json({ users });
			}
			
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	softDeleteUser: async (req, res) => {
		try {
			let ide = req.params.id;
			const status = req.body.deleteStatus
			const update_user_status = await User.findOneAndUpdate({ _id: ide }, {soft_delete_user: status});
			if (update_user_status) {
				return res.status(201).json({ msg: "User Status is updated successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	}, 
	softDeleteHotel: async (req, res) => {
		try {
			
            let ide = req.params.id;
			const status = req.body.deleteStatus
			const update_user_status = await Hotels.findOneAndUpdate({ _id: ide }, {soft_delete_hotel: status});
			if (update_user_status) {
				return res.status(201).json({ msg: "Hotel Status is updated successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	}, 
	softDeleteFrontdeskMan: async (req, res) => {
		try {
			console.log("11111111111")
            let ide = req.params.id;
			const status = req.body.deleteStatus
			console.log(ide, status, "ssssssssssss>>>>>>>")
			console.log(typeof(ide), typeof(status), "ssssssssssss>>>>>>>")
			const update_user_status = await User.findOneAndUpdate({ _id: ide }, {soft_delete_user: status});
			console.log(update_user_status, "uuuuuuuuuuu>>>>>>>")
			if (update_user_status) {
				return res.status(201).json({ msg: "User Status is updated successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminUserByEmail: async (req, res) => {
	try {
		const email = req.query.searchKey
		console.log(email, "????")
		const allUser = await User.find();
		if (!allUser) {
			return res.status(400).json({ msg: "No users Exist!" });
		}

		for (i = 0; i < allUser.length; i++) {
			let idd = await allUser[i]._id;
			const user_count = await Hotels.count({ owner_id: idd });

			const updateHotelCounts = await User.findOneAndUpdate(
				{ _id: idd },
				{
					counts: user_count,
				},
			);
		}

		const users = await User.find({user_type: "HOTEL_OWNER", soft_delete_user: true, email: {$regex: email,$options:'i'}});
		console.log(users, "uuuuusersssssssssss????")
		res.json({ users });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},

getAdminHotelByEmail: async (req, res) => {
	try {
		const email = req.query.searchKey
		console.log(email, "ssssssssssss")
		const hotels = await Hotels.find({soft_delete_hotel: true,  email: {$regex: email,$options:'i'}}).sort({ $natural: -1 })
		if (!hotels) {
			return res
				.status(400)
				.json({ msg: "Hotels are not available right now!" });
		}
		res.json(hotels);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},

getAdminHotelByName: async (req, res) => {
	try {
		const name = req.query.searchKey
		console.log(name, "ssssssssssss")
		const hotels = await Hotels.find({soft_delete_hotel: true, hotelname: {$regex: name,$options:'i'}}).sort({ $natural: -1 })
		if (!hotels) {
			return res
				.status(400)
				.json({ msg: "Hotels are not available right now!" });
		}
		res.json(hotels);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},


getAdminHotelByAddress: async (req, res) => {
	try {
		const address = req.query.searchKey
		console.log(address, "ssssssssssss")
		const hotels = await Hotels.find({soft_delete_hotel: true, address: {$regex: address,$options:'i'}}).sort({ $natural: -1 })
		if (!hotels) {
			return res
				.status(400)
				.json({ msg: "Hotels are not available right now!" });
		}
		res.json(hotels);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},



getAdminHotelByNumber: async (req, res) => {
	try {
		const number = req.query.searchKey
		console.log(number, "hotels111111")
		const hotels = await Hotels.find({soft_delete_hotel: true, phone: {$regex: number,$options:'i'}}).sort({ $natural: -1 })
		if (!hotels) {
			return res
				.status(400)
				.json({ msg: "Hotels are not available right now!" });
		}
		//console.log(hotels, "hotels2222222222")

		res.json(hotels);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},

getAdminHotelByZip: async (req, res) => {
	try {
		const number = req.query.searchKey
		console.log(number, "hotels111111")
		const hotels = await Hotels.find({soft_delete_hotel: true, zipcode: {$regex: number,$options:'i'}}).sort({ $natural: -1 })
		if (!hotels) {
			return res
				.status(400)
				.json({ msg: "Hotels are not available right now!" });
		}
		//console.log(hotels, "hotels2222222222")

		res.json(hotels);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},

getAdminDnrByName: async (req, res) => {
	try {
		console.log("oooooooo")
		const dnr_name = req.query.searchKey
		console.log(dnr_name, "hotels111111")
		const dnr = await Dnr.find({Dnr_title: {$regex: dnr_name,$options:'i'}}).sort({ $natural: -1 })
		if (!dnr) {
			return res
				.status(400)
				.json({ msg: "Dnr are not available right now!" });
		}
		//console.log(hotels, "hotels2222222222")

		res.json(dnr);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},


getAdminUserByNumber: async (req, res) => {
	try {
		const number = req.query.searchKey
		console.log(number, "name>>>>>>>>>>>")
		const allUser = await User.find();
		//console.log(allUser, "nnnnnnnnnnnnnnnn>>>>>>>>>>>")
		if (!allUser) {
			return res.status(400).json({ msg: "No users Exist!" });
		}

		for (i = 0; i < allUser.length; i++) {
			let idd = await allUser[i]._id;
			const user_count = await Hotels.count({ owner_id: idd });

			const updateHotelCounts = await User.findOneAndUpdate(
				{ _id: idd },
				{
					counts: user_count,
				},
			);
		}

		const users = await User.find({soft_delete_user: true, user_type: "HOTEL_OWNER", phone: {$regex: number}});
		//console.log(users, "nnnnnnnnnnnn11111111111")
		res.json({ users });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
},



	createAdminDnr: async (req, res) => {
		try {
			const { dnr_title } = req.body;
			if (!dnr_title) {
				return res.status(400).json({ msg: "Please fill the dnr title" });
			}
			const dnr = await Dnr.findOne({ Dnr_title: dnr_title });
			if (dnr) {
				return res.status(400).json({ msg: "This Dnr is already exists." });
			}
			//Saving user.
			const newDnr = new Dnr({
				Dnr_title: dnr_title,
			});
			await newDnr.save();
			if (newDnr) {
				res.json({
					msg: "DNR is added successfully",
				});
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	createAdminSettings: async (req, res) => {
		try {
	
			const {
				nearby_distance,
				introduction_video_url,
				contact_us_name,
				contact_us_email,
				contact_us_phone_number,
				contact_us_address,
			} = req.body;
			const settings = new Settings({
				nearby_distance: nearby_distance,
				introduction_video_url: introduction_video_url,
				contact_us_name: contact_us_name,
				contact_us_email: contact_us_email,
				contact_us_phone_number: contact_us_phone_number,
				contact_us_address: contact_us_address,
			});
			await settings.save();
			if (settings) {
				res.json({
					msg: "Settings are added successfully",
				});
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	createAdminSubscription: async (req, res) => {
		try {
			const { title, month, price, benefit_title, benefits } = req.body;

			const dnr = await Subcription.findOne({ title: title });
			if (dnr) {
				return res.status(400).json({ msg: "This Subscription is already exists." });
			}
			//Saving user.
			const new_subs = await Subcription.create({
				title,
				month,
				price,
				benefit_title,
			});

			await new_subs.save();
			// if (benefits.length === 0) {
			// 	var newprac = await Subcription.updateOne(
			// 		{ _id: new_subs._id },
			// 		{ $push: { benefits: "Not Available" } },
			// 	);
			// }
			 for (i = 0; i < benefits.length; i++) {
				var newprac = await Subcription.updateOne(
					{ _id: new_subs._id },
					{$push: { benefits: benefits[i].benefit }})
			}
			// var newprac = await Subcription.updateOne(
			// 			{ _id: new_subs._id },
			// 			{ $set: { benefits: benefits[0].benefit } },
			// 		);
			
			res.json({
				msg: "Subscription is added successfully",
				practice: {
					new_subs,
				},
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAdminFrontDeskList: async (req,res)=>{ 
		try {
			const frontDesk = await User.find({user_type: 'FRONTDESK'});
			for(i=0; i< frontDesk.length; i++){
				if (!frontDesk[i].frontDeskHotelId) { continue; }
				// console.log(frontDesk[i].frontDeskHotelId, "id")
				const hotel = await Hotels.findById({_id: frontDesk[i].frontDeskHotelId});
				
				const update_hotel = await User.findOneAndUpdate({_id: frontDesk[i]._id }, {hotel: hotel.hotelname})
			}
			if (!frontDesk) {
				return res.status(400).json({ msg: "array is not available" });
			}
			const frontDeskman = await User.find({user_type:'FRONTDESK', soft_delete_user: true}).sort({_id:-1});

			// console.log(frontDeskman, "fffffffffffffffffffff")
			res.json(frontDeskman);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	

	getAdminFrontDeskByName: async (req,res)=>{ 
		console.log("1222212222212222")
		try {
		const name = req.query.searchKey
			console.log(name, "fffffffffffffffffffff")
			const frontDesk = await User.find({user_type: 'FRONTDESK'});
			for(i=0; i< frontDesk.length; i++){
				if (!frontDesk[i].frontDeskHotelId) { continue; }
				console.log(frontDesk[i].frontDeskHotelId, "id")
				const hotel = await Hotels.findById({_id: frontDesk[i].frontDeskHotelId});
				
				const update_hotel = await User.findOneAndUpdate({_id: frontDesk[i]._id }, {hotel: hotel.hotelname})
			}
			if (!frontDesk) {
				return res.status(400).json({ msg: "array is not available" });
			}
			const frontDeskman = await User.find({user_type:'FRONTDESK', soft_delete_user: true,  frontDeskFullName: {$regex: name,$options:'i'} })

			console.log(frontDeskman, "fffffffffffffffffffff")
			res.json(frontDeskman);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAdminFrontDeskByHotelName: async (req,res)=>{ 
		try {
		const hotelName = req.query.searchKey
			const frontDeskman = await User.find({user_type:'FRONTDESK', soft_delete_user: true, hotel: {$regex: hotelName, $options:'i'} })
			res.json(frontDeskman);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAdminFrontDeskByUserName: async (req,res)=>{ 
		try {
		const userName = req.query.searchKey
			
			const frontDeskman = await User.find({user_type:'FRONTDESK', soft_delete_user: true, frontDeskUserName: {$regex: userName, $options:'i'} })
            
			res.json(frontDeskman);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAdminFrontDeskByPosition: async (req,res)=>{ 
		console.log("1222212222212222")
		try {
		const position = req.query.searchKey
			console.log(position, "eeeeeeeeee>>>>>>>>>>>>>")
			const frontDeskman = await User.find({user_type:'FRONTDESK', soft_delete_user: true, frontDeskPosition: {$regex: position, $options:'i'} })
            console.log(frontDeskman, "fffffffffffffffffffff")
			res.json(frontDeskman);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminFrontDeskByEmpSince: async (req,res)=>{ 
		console.log("1222212222212222")
		try {
		const empSince = req.query.searchKey
			console.log(empSince, "fffffffffffffffffffff1111111111")
			const frontDeskman = await User.find({user_type:'FRONTDESK', soft_delete_user: true, frontDeskEmpSince: {$regex: empSince, $options:'i'} })
            console.log(frontDeskman, "fffffffffffffffffffff")
			res.json(frontDeskman);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	
		//let response = {};
		// let pageOptions = {
		// 	 page: parseInt(req.params.page, 10) || 0,
		// 	 limit: parseInt(req.query.limit, 10) || 10
		//  }
		
		//let frontDesk = await User.find({added_by:req._id,user_type:'FRONTDESK'}).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).sort({_id:-1}).exec();
	
		// const frontDesk = await User.find({user_type:'FRONTDESK'}).sort({_id:-1});
	
		// const dataArray =[];
		// for ( let index=0; index < frontDesk.length; index++ ) {
		// 	let infoUser = _.pick(frontDesk[index],['_id','frontDeskFullName','frontDeskUserName','frontDeskPosition','frontDeskEmpSince','date','hotelname','address']);
		// 	 dataArray[index] = {
		// 		infoUser
		// 	 } 
		// }
	
		// if(frontDesk.length != 0){
		// 	 response.data = dataArray;
		// 	 response.totalData = frontDeskDataCount.length;
		// 	 response.message = "Front Desk List";
		// 	 response.statusText = "success";
		// }else{
		// 	 response.message = "No record found";
		// 	 response.statusText = "error";
		// }
	// 	res.status(200).json(response);
	// },
	
	getAdminSubscription: async (req, res) => {
		try {
			const subs = await Subcription.find().sort({ $natural: -1 }).limit();
			if (!subs) {
				return res.status(400).json({ msg: "array is not available" });
			}
			res.json(subs);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminSubscriptionByTitle: async (req, res) => {
		try {
			const title = req.query.searchKey
	    	console.log(title, "title>>>>>>>>>>>")
			const subs = await Subcription.find({title: {$regex: title,$options:'i'}});
			if (!subs) {
				return res.status(400).json({ msg: "array is not available" });
			}
			res.json(subs);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAdminSubscriptionByMonth: async (req, res) => {
		try {
			const monthName = req.query.searchKey
			const subs = await Subcription.find({month: {$regex: monthName}})
			console.log(subs, "subs>>>>>>>>>>>>>>>>>>")
			if (!subs) {
				return res.status(400).json({ msg: "array is not available" });
			}
			res.json(subs);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAdminSubscriptionByBenefitTitle: async (req, res) => {
		try {
			const benefitTitle = req.query.searchKey
	    	console.log(benefitTitle, "benefitTitle>>>>>>>>>>>")
			const subs = await Subcription.find({benefit_title: {$regex: benefitTitle,$options:'i'}})
			if (!subs) {
				return res.status(400).json({ msg: "array is not available" });
			}
			res.json(subs);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminSubscriptionbyId: async (req, res) => {
		try {
			const id = req.params.id;
			console.log(id, "iiiiiiiiiiiiii");
			const subs = await Subcription.findById({ _id: id });
			if (!subs) {
				return res.status(400).json({ msg: "array is not available" });
			}
			console.log(subs, "subs>>>>>>>>>>>>>>>>>>");
			res.json(subs);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminDnr: async (req, res) => {
		try {
			const status = req.params.sortStatus
			console.log(status, "sssssssss>>>>>>>>>>>")
	if(status === "ALLcreated"){
		const dnr = await Dnr.find().sort({ $natural: -1 }).limit();
		if (!dnr) {
			return res.status(400).json({ msg: "No dnr Exist!" });
		}
		res.json({ dnr });
	} else if(status === "ASCcreated")	{
		const dnr = await Dnr.find().sort({ $natural: 1 }).limit();
		if (!dnr) {
			return res.status(400).json({ msg: "No dnr Exist!" });
		}
		res.json({ dnr });
	}else if(status === "DSCcreated")	{
		const dnr = await Dnr.find().sort({ $natural: -1 }).limit();
		if (!dnr) {
			return res.status(400).json({ msg: "No dnr Exist!" });
		}
		res.json({ dnr });
	} else if(status === "ALLmodified"){
		console.log("allmodi")
		const dnr = await Dnr.find().sort({ modifiedate: -1 }).limit();
		if (!dnr) {
			return res.status(400).json({ msg: "No dnr Exist!" });
		}
		res.json({ dnr });
	} else if(status === "ASCmodified")	{
		console.log("ascmodi")
		const dnr = await Dnr.find().sort({ modifiedate: 1 }).limit();
		if (!dnr) {
			return res.status(400).json({ msg: "No dnr Exist!" });
		}
		res.json({ dnr });
	}else if(status === "DSCmodified")	{
		console.log("dscmodi")
		const dnr = await Dnr.find().sort({ modifiedate: -1 }).limit();
		if (!dnr) {
			return res.status(400).json({ msg: "No dnr Exist!" });
		}
		res.json({ dnr });
	}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminDnrbyId: async (req, res) => {
		try {
			console.log("22222>>>>>>>>>>>>");
			const id = req.params.id;
			const dnr = await Dnr.findOne({ _id: id });
			if (!dnr) {
				return res.status(400).json({ msg: "No dnr Exist!" });
			}
			res.json({ dnr });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	// getAdminFeedback: async (req, res) => {
	// 	try {
	// 		console.log("feedback");
	// 		const feedback = await Feedback.find().sort({ $natural: -1 }).limit();
	// 		if (!feedback) {
	// 			return res.status(400).json({ msg: "No feedbacks!" });
	// 		}
	// 		res.json({ feedback });
	// 	} catch (err) {
	// 		return res.status(500).json({ msg: err.message });
	// 	}
	// },

	getAdminSettings: async (req, res) => {
		try {
			const settings = await Settings.find();
			if (!settings) {
				return res.status(400).json({ msg: "No settings!" });
			}
			res.json({
				settings,
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminSettingsId: async (req, res) => {
		try {
			const id = req.params.id;
			const settings = await Settings.findOne({ _id: id });
			if (!settings) {
				return res.status(400).json({ msg: "No settings!" });
			}
			res.json({
				settings,
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	//  getAdminTransaction: async (req, res) => {
	// 	try {
	// 	   const Transaction = await Payment.find();
	// 	   console.log(Transaction)
	// 		  if (!Transaction) {
	// 			 return res.status(400).json({ msg: "No transactions!"});
	// 		 }

	// 		 res.json({Transaction});
	// 	 } catch (err) {
	// 		 return res.status(500).json({ msg: err.message });
	// 	 }
	//  },

	getAdminViewUsers: async (req, res) => {
		try {
			user_id = req.params.id;
			const user = await User.findOne({ _id: user_id });
			if (!user) {
				return res.status(400).json({ msg: "No users!" });
			}
			const hotel = await Hotels.find({ owner_id: user_id });
			if (!hotel) {
				return res.status(400).json({ msg: "No hotels!" });
			}
			const transaction = await Payment.find({ userId: user._id });
			if (!transaction) {
				return res.status(400).json({ msg: "No transaction!" });
			}
			res.json({ user, hotel, transaction });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminViewHotels: async (req, res) => {
		try {
			hotel_id = req.params.id;
            const hotel = await Hotels.findById({_id: hotel_id });
			if (!hotel) {
				return res.status(400).json({ msg: "No hotels!" });
			}
			const transaction = await Payment.find({ hotelId: hotel_id });
			// if (!transaction) {
			// 	return res.status(400).json({ msg: "No transaction!" });
			// }
        console.log(transaction, "ttttttttt>>>>>>>>>.")
			res.json({ hotel, transaction});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},


   deleteAdminDnr: async (req, res) => {
		try {
			let ide = req.params.id;
			const dnr_delete = await Dnr.findOneAndDelete({ _id: ide });
			if (dnr_delete) {
				return res.status(201).json({ msg: "Dnr is deleted successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	deleteAdminFeed: async (req, res) => {
		try {
			console.log("api>>>")
			let ide = req.params.id;
			console.log(ide, "ide>>>")

			const guest_delete = await Guest.findOneAndDelete({ _id: ide });
			const feedback_delete = await Feedback.findOneAndDelete({ guestId: ide });
			if (guest_delete && feedback_delete) {
				return res.status(201).json({ msg: " Guest and Feedback are deleted successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}

	},

	deleteAdminSubs: async (req, res) => {
		try {
			let ide = req.params.id;
			const subs_delete = await Subcription.findOneAndDelete({ _id: ide });
			if (subs_delete) {
				return res.status(201).json({ msg: "Subscription is deleted successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	updateAdminDnrStatus: async (req, res) => {
		try {
			let ide = req.params.id;
			let re_status = req.body.status;
			console.log(ide, re_status);
			const dnr_status = await Dnr.findOneAndUpdate(
				{ _id: ide },
				{
					status: re_status,
				},
			);
			if (dnr_status) {
				return res
					.status(201)
					.json({ msg: "Dnr status is updated successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	updateAdminDnr: async (req, res) => {
		try {
			let ide = req.params.id;
			console.log(ide, "iiiiiiiiiiiiiiiiiii")
			let { dnr_title } = req.body;
			let now = new Date()
			const dnr_status = await Dnr.findOneAndUpdate(
				{ _id: ide },
				{
					Dnr_title: dnr_title,
					modifiedate: now
				},
			);
			if (dnr_status) {
				return res
					.status(201)
					.json({ msg: "DNR is updated successfully!" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	updateAdminSettings: async (req, res) => {
		try {
			console.log("111111111");
			const {
				nearby_distance,
				introduction_video_url,
				contact_us_name,
				contact_us_email,
				contact_us_phone_number,
				contact_us_address,
			} = req.body;
			const settings = await Settings.findOneAndUpdate({
				nearby_distance: nearby_distance,
				introduction_video_url: introduction_video_url,
				contact_us_name: contact_us_name,
				contact_us_email: contact_us_email,
				contact_us_phone_number: contact_us_phone_number,
				contact_us_address: contact_us_address,
			});
			if (settings) {
				res.json({
					msg: "Settings are updated successfully",
				});
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	updateAdminSubscription: async (req, res) => {
		try {
			const { title, month, price, benefit_title, benefits, } = req.body;
			const id = req.params.id;
			//Saving user.
			const new_subs = await Subcription.findByIdAndUpdate(
				{ _id: id },
				{
					title,
					month,
					price,
					benefit_title
				},
			);

			await new_subs.save();
			for (i = 0; i < benefits.length; i++) {
				var newprac = await Subcription.updateOne(
					{ _id: new_subs._id },
					{$addToSet: {benefits: [benefits[i].benefit]}})
				}
			res.json({
				msg: "Subscription is updated successfully",
				practice: {
					new_subs,
				},
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminLiveEventList: async (req,res)=>{ 
       responseType = {};
	   let eventDataCount = await Feedback.aggregate([
			 {"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) }}},
			 {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
			 {"$replaceRoot":{"newRoot":"$doc"}}
		]);
		eventData = await Feedback.aggregate([
			 {"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) }}}, 
			 { $sort: {_id:-1, date: -1} },       
			 {"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
			 {"$replaceRoot":{"newRoot":"$doc"}}
		]).sort({date: -1}).exec();
   
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
			 if(!guestData){
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
			//responseType.data = dataArray;
			 responseType.message = "No record found";
			 responseType.statusText = "error";
		}
		res.status(200).json(responseType);
		
   },


   getAdminLiveEventsByName: async (req,res)=>{ 
	const name = req.query.searchKey
    console.log("start111111111111")
	responseType = {};
	let eventDataCount = await Feedback.aggregate([
		{"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) }}},
		{"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
		{"$replaceRoot":{"newRoot":"$doc"}}
   ]);
 
   eventData = await Feedback.aggregate([
		{"$match":{"date":{ $gte: new Date((new Date().getTime() - (2 * 24 * 60 * 60 * 1000))) }}}, 
		{ $sort: {_id:-1, date: -1} },       
		{"$group":{"_id":"$guestId", "doc":{"$first":"$$ROOT"}, "sum":{"$sum":1}}},
		{"$replaceRoot":{"newRoot":"$doc"}}
   ]).sort({date: -1}).exec();

var dataArray =[];
	for ( let index=0; index < eventData.length; index++ ) {
		let canView = false;
		if(eventData[index].ownerId == req._id){
			 canView = true;
		}

		if(eventData[index].added_by == req._id){
			 canView = true;
		}
       
		let guestData = await Guest.findOne({_id:eventData[index].guestId, firstName: {$regex: name,$options:'i'}});
		if(!guestData){
			continue;
		}
		
		dataArray[index] = {
			 'eventData':eventData[index],
			  guestData,
			  canView
		} 
		// eventData[index], 
		// guestData,
		// canView
   
}
  
   if(eventData.length != null){
		responseType.data = dataArray;
		//responseType.data = eventData[index], guestData, canView
		// responseType.guest = guestData;
		// responseType.view = canView;
        responseType.totalData = eventDataCount.length;
		responseType.message = "live event list";
		responseType.statusText = "success";
   }else{
	    responseType.data = dataArray;
		responseType.message = "No record found";
		responseType.statusText = "error";
   }
   res.status(200).json(responseType);
   
},

// getAdminliveEventListByHotelName: async (req,res)=>{ 
// 	const hotelName = req.query.searchKey
//     console.log("start111111111111")
// 	let eventDataCount = await Feedback.find();
// 	let eventData = await Feedback.find().sort({ $natural: -1 })
// 	const dataArray =[];
// 	for ( let index=0; index < eventData.length; index++ ) {
// 		 let canView = false;
// 		 if(eventData[index].ownerId == req._id){
// 			  canView = true;
// 		 }

// 		 if(eventData[index].added_by == req._id){
// 			  canView = true;
// 		 }

// 		 let guestData = await Guest.findOne({_id:eventData[index].guestId, firstName: {$regex: hotelName,$options:'i'}});
// 		 dataArray[index] = {
// 			  'eventData':eventData[index],
// 			  guestData,
// 			  canView
// 		 } 
// 	}


// 	if(eventData.length != 0){
// 		 response.data = dataArray;
// 		 response.totalData = eventDataCount.length;
// 		 response.message = "live event list";
// 		 response.statusText = "success";
// 	}else{
// 		 response.message = "No record found";
// 		 response.statusText = "error";
// 	}
// 	res.status(200).json(response);
// },


	getAdminHotelDetails: async (req, res) => {
		try {
			const doc = await Hotels.findOne({ _id: req.params.id });
			if (!doc) {
				return res.status(400).json({ msg: "No users!" });
			}
			res.json({ doc });
		} catch {
			return res.status(500).json({ msg: err.message });
		}
	},

	getAdminFeedbackSingle: async (req,res)=>{   
		console.log("gggggggggggggg")
		var response = {};
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
	},
	
	editAdminFeedback: async (req,res)=>{  
		var response = {};
	
		const paramsArray = {
			dnrReason:  req.body.dnrReason,
			comments: req.body.comments,
			photos: req.body.photos,
			videos: req.body.videos
		}
		console.log(paramsArray, "hhhhhhhhhhhhhhhhhhhh");
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

};





//Function to to create access token.
const createAccessToken = (user) => {
	return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = userController;