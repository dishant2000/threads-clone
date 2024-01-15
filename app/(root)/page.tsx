import { fetchThreads } from "@/lib/actions/thread.action";
import { UserButton, currentUser } from "@clerk/nextjs";
import '../globals.css' 
import ThreadCard from "@/components/cards/ThreadCard";
export default async function Home() {
  const user = await currentUser();
  const res = await fetchThreads({page : 1, pageSize : 30});
  return (
    <div>
      {/* {console.log("community", res)} */}
      <h1 className="head-text">Home</h1>
      <section>
        {res?.posts.length == 0 ? <p className="no-result text-light-1">No threads yet Create a new Thread !</p> : 
          res?.posts.map((post)=>{
            return(
              <ThreadCard
                key = {post._id}
                id = {post._id}
                message = {post.message}
                currentUserId = {user?.id}
                community = {post.community}
                comments = {post.children}
                createdAt = {post.createdAt}
                author={post.author}
                parentId = {post.parentId}
              />
            )
          })
        }
      </section>
    </div>
  )
}