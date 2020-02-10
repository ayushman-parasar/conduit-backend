var mongoose = require('mongoose')
var Schema = mongoose.Schema
var User = require('../models/User')
var bcrypt = require('bcryptjs')
var userSchema = new Schema({
    email:{
        type:String,
        required: true,
    },
    username:{
        type:String,
        
    },
    password:{
        type:String,
        required: true,

    },
    image:{
        type:String,
    },
    following:{
        type:Boolean,
        default:false
    },
    followingArr:[{
        type:Schema.Types.ObjectId,
        ref:"User"
        
    }],
    favouriteArticles:[{
        type:Schema.Types.ObjectId,
        ref:"Article"
    }],
    articlesCreated:[{
        type:Schema.Types.ObjectId,
        ref:"Article"
    }]
    
},{
    timestamps:true
})


userSchema.pre('save', async function(next){
    if(this.password && this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
        next();
    }
    next();
})
userSchema.methods.verifyPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}
module.exports = mongoose.model('User',userSchema)

