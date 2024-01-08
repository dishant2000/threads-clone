"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

export async function updateUser({
    userId, 
    username,
    name,
    bio,
    image, 
    path

}: {
    userId : string,
    username :string,
    name : string,
    bio : string,
    image : string, 
    path : string
}) : Promise<void>{
    try{
        connectToDb();
        await User.findOneAndUpdate({
            id : userId
        }, {
            username : username.toLocaleLowerCase(),
            name, 
            bio, 
            image, 
            onboarded : true,

        },{
            upsert : true // update if present if not insert it.
        })

        if(path == '/profile/edit'){
            revalidatePath(path);
        }

    }catch(err :any){
        throw new Error (`Failed to create User ${err.message}`,)
    }

}


export async function fetchUser({
    userId
}:{
    userId : string
}){
    try{
        await connectToDb();
        return await User.findOne({id : userId});
        
    }catch(err:any){
        throw new Error(`Error fetching user ${err.message}`)
    }
}