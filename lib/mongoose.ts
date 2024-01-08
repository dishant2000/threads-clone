import mongoose from 'mongoose';

let isConnected : boolean = false;

export const connectToDb = async ()=>{
    if(isConnected){
        console.log('mongoose connection is already established');
        return ;
    }

    mongoose.set("strictQuery", true);
    if(!process.env.MONGO_URL){
        console.error("Mongo db url not found !");
        return;
    }
    try{
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log('mongodb connected!');
        return;
    }catch(err){
        console.log("error connection to db", err);
        return;
    }
}