const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{ 
        type: String,
        required: true
    },
    otp: {
        code:  Number ,
        verify: { type: Boolean, default: false },
        otpExpires: { type: Number },
    },
    chats:{
        type: [
            {   
                title:{
                    type:String,
                    default:'New Chat'
                },
                conversation: {
                    type: Schema.Types.ObjectId,
                    ref: 'Conversation'
                }
            }
        ]
    }
})

const conversationSchema = new Schema({
    
    messages:[
        {
            msg:String,
            sender:{type:String,enum:['user','bot']}
        }
    ]
})

module.exports.User = mongoose.model("User",userSchema);
module.exports.Conversation = mongoose.model("Conversation",conversationSchema);