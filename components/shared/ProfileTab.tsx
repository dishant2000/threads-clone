import { fetchUserThreads } from "@/lib/actions/thread.action";
import ThreadCard from "../cards/ThreadCard";
import { redirect } from "next/navigation";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

interface profileTabProps{
    userId : string;
    tab: {
        label: string;
        icon: string;
        value: string;
    },
    accountType ?: "community" | "user" 
}
interface Result {
    name: string;
    image: string;
    id: string;
    threads: {
      _id: string;
      text: string;
      parentId: string | null;
      author: {
        name: string;
        image: string;
        id: string;
      };
      community: {
        id: string;
        name: string;
        image: string;
      } | null;
      createdAt: string;
      children: {
        author: {
          image: string;
        };
      }[];
    }[];
  }
const ProfileTab = async ({
    userId,
    tab,
    accountType
}: profileTabProps)=>{
    let result : Result;
    if(!accountType || accountType === 'user' )
        result = await fetchUserThreads(userId);
    else 
        result = await fetchCommunityPosts(userId);
    if(!result) redirect('/');
    return(
        <section>
            {   
                tab.label == "Threads" && <>
                    {result.threads.length == 0 ? 
                    <p>
                        No THread !
                    </p> : 
                    result.threads.map((thread : any)=>{
                        // console.log("profileTabProps",tab.label);
                        return <ThreadCard 
                            key={thread._id}
                            id={thread._id}
                            message={thread.message}
                            currentUserId={userId}
                            community={
                                accountType === "community"
                                  ? { name: result.name, id: result.id, image: result.image }
                                  : thread.community
                              }
                            parentId={userId}
                            createdAt={thread.createdAt}
                            author={
                                accountType === "user"
                                  ? { name: result.name, image: result.image, id: result.id }
                                  : {
                                      name: thread.author.name,
                                      image: thread.author.image,
                                      id: thread.author.id,
                                    }
                              }
                            comments={thread.children}
                        />
                    })}
                </>
            }
        </section>
    )
}

export default ProfileTab;