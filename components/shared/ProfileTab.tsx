import { fetchUserThreads } from "@/lib/actions/thread.action";
import ThreadCard from "../cards/ThreadCard";
import { redirect } from "next/navigation";

interface profileTabProps{
    userId : string;
    tab: {
        label: string;
        icon: string;
        value: string;
    }
}
const ProfileTab = async ({
    userId,
    tab
}: profileTabProps)=>{
    const userWithPosts = await fetchUserThreads(userId);
    if(!userWithPosts) redirect('/');
    return(
        <section>
            {   
                tab.label == "Threads" && <>
                    {userWithPosts.threads.length == 0 ? 
                    <p>
                        No THread !
                    </p> : 
                    userWithPosts.threads.map((thread : any)=>{
                        // console.log("profileTabProps",tab.label);
                        return <ThreadCard 
                            key={thread._id}
                            id={thread._id}
                            message={thread.message}
                            currentUserId={userId}
                            community={null}
                            parentId={userId}
                            createdAt={thread.createdAt}
                            author={userWithPosts}
                            comments={thread.children}
                        />
                    })}
                </>
            }
        </section>
    )
}

export default ProfileTab;