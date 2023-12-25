import mongoose from "mongoose";

const ChatSchema=mongoose.Schema({

    prompt:{type:String,required:true},
    botResponse:{type:String,required:true},
    userId: {
      type: String,
      ref: 'User',
      required: true,
      unique:true,
    },
      timestamp: {
        type: Date,
        default: Date.now,
      },
  
})
export default mongoose.model("Chats", ChatSchema);
