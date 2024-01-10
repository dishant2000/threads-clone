"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

interface params {
  message: string;
  author: string;
  communityId: string | null;
  path: string;
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
  } catch (err: any) {
    console.log(`Error while creating thread ${err.message}`);
  }
};

export const fetchThreads = async ({ page = 1, pageSize = 20 }) => {
  try {
    await connectToDb();
    const offset = (page - 1)*pageSize;
    const threadQuery = Thread.find({
      parentId: { $in: [null, "undefined"] },
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
            select : "_id name parentId image"
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
            select : "_id id name parentId image"
          },
          {
            path : 'children',
            populate : {
              path : "author",
              model : User,
              select : "_id id name parentId image"
            }
          }
        ]
      })

     return await threadQuery.exec();
  }catch(err : any){
    console.log(`Error while fetching thread ${err.message}`);
  }
}