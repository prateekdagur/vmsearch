const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var userSchema = new mongoose.Schema({
	hotelname:{
		type:String,
		required:'hotel name is required'
	},
	phonenumber:{
		type:String,
		required:'phone number is required',
		unique:true
	},
	email:{
		type:String,
		required:'email is required',
		unique:true
	},
	address:{
		type:String,
		required:'address is required'	
	},
	city:{
		type:String,
		default: 'NA'		
	},
	state:{
		type:String,
		required:'state is required',
		default: 'NA'			
	},
	zipcode:{
		type:String,
		required:'zip code is required'		
	},
	latitude:{
		type:String,
	},
	loc:{
        type:{
            type:String,
            default:'Point'
        },
        coordinates: { 
			type: [Number], 
			index: '2dsphere'
		}
    },
	longitude:{
		type:String,
	},
	password:{
		type:String,
		required:'password is required',
		minlength:[4,'password required minimum 6 digit']
	},
	tax_filename:{
		type:String,
	},
	bill_filename:{
		type:String,
	},	
	is_active:{
		type:String,
		default: 'ACTIVE'
	},
	is_approved:{
		type:String,
		default: 'PENDING'
	},
	user_type:{
		type:String,
		default: 'HOTEL_OWNER'
	},
	added_by:{
		type:String,
		default: ''
	},
	date: {
		type: Date,
		default: Date.now
	},
	frontDeskHotelId:{
		type:String,
	},
	frontDeskFullName:{
		type:String,
	},
	frontDeskUserName:{
		type:String,
		unique:true
	},
	frontDeskPosition:{
		type:String,
	},
	frontDeskEmpSince:{
		type:String,
	},
	counts:{
		type:Number,
		default: 0
	},
	hotel:{
		type:String,
		default:""
	},
	soft_delete_user: {
		type:Boolean,
		default: true
	}
	
});


userSchema.pre('save',function(next){
	bcrypt.genSalt(10,(err,salt)=>{
		bcrypt.hash(this.password,salt,(err,hash)=>{
			this.password = hash;
			this.saltSecret = salt;
			next();
		});
	});
});



userSchema.methods.verifyPassword = function(password){
	return bcrypt.compareSync(password,this.password);
};

userSchema.methods.generateJwt = function(){
	return jwt.sign({_id:this._id},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXP		
		});
};




mongoose.model('User',userSchema);