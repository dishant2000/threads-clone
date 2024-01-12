// "use client"
import ThreadCard from "@/components/cards/ThreadCard";
import CommentForm from "@/components/forms/CommentForm";
import { fetchThreadByID } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function ThreadDetails ({params} : {params : {id : string}}){
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser({userId : user.id});

    if(!userInfo?.onboarded) redirect('/onboarding');
    
    const thread = await fetchThreadByID(params.id);
    return(
        <section className="relative">
            <div>
            <ThreadCard
                key = {thread._id}
                id = {thread._id}
                content = {thread.message}
                currentUserId = {user?.id}
                community = {thread.communityId}
                comments = {thread.children}
                createdAt = {thread.createdAt}
                author={thread.author}
                parentId = {thread.parentId}
                />
            </div>
            <div>
            <CommentForm userId={userInfo._id} threadId={thread._id} userImg={userInfo.image}/>
            </div>
            <div>
                {thread.children.map((child : any) => {
                    return(
                        <ThreadCard
                            key = {child._id}
                            id = {child._id}
                            content = {child.message}
                            currentUserId = {user?.id}
                            community = {child.communityId}
                            comments = {child.children}
                            createdAt = {child.createdAt}
                            author={child.author}
                            parentId = {child.parentId}
                            isComment = {true}
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default ThreadDetails;