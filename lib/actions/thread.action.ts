"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";
import mongoose from "mongoose";

interface params {
  message: string;
  author: string;
  communityId: string | null;
  path: string;
}
interface commentParams extends params {
  threadId : string,
}
export const createThread = async ({
  message,
  author,
  communityId,
  path,
}: params) => {
  try {
    await connectToDb();
    const createdThread = await Thread.create({
      message,
      author,
      communityId: communityId || null,
    });
    // update the corresponding user

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
    return createdThread._id;
  } catch (err: any) {
    console.log(`Error while creating thread ${err.message}`);
  }
};

export const fetchThreads = async ({ page = 1, pageSize = 20 }) => {
  try {
    await connectToDb();
    const offset = (page - 1)*pageSize;
    const threadQuery = Thread.find({
      parent: { $in: [null, "undefined"] },
    })
    .sort({createdAt : 'desc'})
    .skip(offset)
    .limit(pageSize)
    .populate({
        path : 'author',
        model : User
    })
    .populate({
        path : 'children',
        populate : {
            path : 'author',
            model : User,
            select : "_id name parent image"
        }
    })
    const totalPost = await Thread.countDocuments({parentId : {$in : [null, 'undefined']}});
    const posts = await threadQuery.exec();
    const isNext = totalPost > offset + posts.length;
    return {posts, totalPost, isNext};
  } catch (err: any) {
    console.log(`Error fetching threads ${err.message}`);
  }
};


export const fetchThreadByID = async (id : string) =>{
  try{
    await connectToDb();

    const threadQuery = Thread.findById(
      id)
      .populate({
        path : 'author',
        model : User,
        select : "_id id name image"
      })
      .populate({
        path : 'children',
        populate : [
          {
            path : 'author',
            model : User,
            select : "_id id name parent image"
          },
          {
            path : 'children',
            populate : {
              path : "author",
              model : User,
              select : "_id id name parent image"
            }
          }
        ]
      })

     return await threadQuery.exec();
  }catch(err : any){
    console.log(`Error while fetching thread ${err.message}`);
  }
}

export const createComment = async ({
  message,
  author,
  communityId,
  path,
  threadId,
}:commentParams) => {
  try{
    await connectToDb();
    
    const originalThread = await Thread.findById(threadId); 
    if(!originalThread) throw new Error(`Could not find Thread ${author}`);
    const createComment = new Thread({
      message,
      author,
      communityId: communityId || null,
      parent : threadId
    })
    const savedComment = await createComment.save();
    originalThread.children.push(savedComment._id);
    await originalThread.save();
    revalidatePath(path);
  }catch(err:any){
    throw new Error(`Error while creating comment ${err.message}`);
  }
}

export const fetchUserThreads = async (userId : string)=>{
  try{
    await connectToDb();
    const fetchThreadQuery = User.findOne({
      _id : userId
    }).populate({
      path : 'threads',
      model: Thread,
      populate : {
        path : 'children',
        model : Thread,
        populate : {
          path : 'author',
          model : User,
          select : "_id id name parent image"
        }
      }
    });
    return await fetchThreadQuery.exec();
  }catch(err :any) {
    throw new Error(`Error while fetching user Threads : ${err.message}`);
  }
}