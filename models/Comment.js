var mongoose = require('mongoose')
var Schema = mongoose.Schema
var commentSchema = new Schema({
    content: {
        type: String,

    },
    articleId : {
        type : Schema.Types.ObjectId,
        ref : 'Article',

    },
    authorId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true,
    }  
},
{
    timestamps:true
})

module.exports = mongoose.model('Comment',commentSchema)