"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";

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
        await connectToDb();
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
        console.log(`Failed to create User ${err.message}`,)
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
        console.log(`Error fetching user ${err.message}`)
    }
}

export const fetchUsers = async ({
    userId,
    pageNo,
    pageSize,
    sortBy = "desc",
    searchStr,
    
}:{
    pageNo : number,
    pageSize : number,
    userId : string,
    sortBy : SortOrder,
    searchStr : string,
   
})=>{
    try{
        await connectToDb();
        const offset = (pageNo - 1) * pageSize;
        const query : FilterQuery<typeof User> = {
            id : {$ne : userId}
        }
        const regex = new RegExp(searchStr, "i");

        if(searchStr.trim() !== ""){
            query.$or = [
                {username : {$regex : regex}},
                {name : {$regex : regex}}
            ];

        }
        const sortQuery = {
            createdAt : sortBy
        }
        const userQuery = User.find(query).sort(sortQuery).skip(offset).limit(pageSize); 
        const totalDoc = await User.countDocuments(query);
        const res = await userQuery.exec();
        const isNext = totalDoc > offset + res.length;
        // revalidatePath(path)
        return {
            users : res,
            isNext : isNext,
        }
    }catch(err : any){
        throw new Error(`error while fetching users ${err.message}`)
    }
}

export const fetchComments = async (userId : string)=>{
    try{
        await connectToDb();
        const userThreads = await Thread.find({author : userId});
        const userChildIds = userThreads.reduce((acc, thread)=>{
            return acc.concat(thread.children);
        },[]);

        const replies = await Thread.find({
            _id : {$in : userChildIds},
            author : {$ne : userId}
        }).populate({
            path : "author",
            model : User,
            select : "name username image _id"
        })
        return replies;
    }catch(err : any){
        throw new Error(`error fetching comment ${err.message}`)
    }
}