import mongoose from 'mongoose';


const threadSchema = new mongoose.Schema({
    message : {
        type : String,
        required : true
    },
    author :{ 
     type : mongoose.Schema.Types.ObjectId,
     ref : "Thread",
     required : true   
    },
    community : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Community"
    },
    parent : {
        type : String
    },
    children : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Thread"
        }
    ]
},{timestamps : true});


const Thread =  mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;