var mongoose = require('mongoose')
var Schema = mongoose.Schema
var slugit = require('slug')

var articleSchema = new Schema({
    slug:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required:true,
        
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }],
    authorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    taglist:[{
        type:String,

    }],
    favourite:{
        type:Boolean,
        default:false,
    }
    
})
articleSchema.pre('save',async function(next){
    
    var slug  = await slugit(this.title)
    this.slug = slug;
})

module.exports = mongoose.model('Article',articleSchema)