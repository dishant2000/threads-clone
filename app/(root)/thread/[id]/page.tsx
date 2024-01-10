import ThreadCard from "@/components/cards/ThreadCard";
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
                
            </div>
        </section>
    )
}

export default ThreadDetails;