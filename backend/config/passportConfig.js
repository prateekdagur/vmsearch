const password = require('passport');
const localStrategies = require('passport-local').Strategy;
const mongoose = require('mongoose');
var User = mongoose.model('User');

password.use(
    new localStrategies({usernameField:'email'},
    (username,password,done)=>{
        User.findOne({email:username},
            (err,user)=>{
                if(err)
                    return done(err);
                else if(!user)
                    return done(null,false,{message:'E-mail is not registered!'});
                else if(!user.verifyPassword(password))
                    return done(null,false,{message:'Wrong Password!'});
                else
                    return done(null,user);                
            }
        )
    })

);