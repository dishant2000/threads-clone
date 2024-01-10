import { fetchThreads } from "@/lib/actions/thread.action";
import { UserButton, currentUser } from "@clerk/nextjs";
import '../globals.css' 
import ThreadCard from "@/components/cards/ThreadCard";
export default async function Home() {
  const res = await fetchThreads({page : 1, pageSize : 30});
  const user = await currentUser();
  return (
    <div>
      <h1 className="head-text">Home</h1>
      <section>
        {res?.posts.length == 0 ? <p className="no-result">No threads yet !</p> : 
          res?.posts.map((post)=>{
            return(
              <ThreadCard
                key = {post._id}
                id = {post._id}
                content = {post.message}
                currentUserId = {user?.id}
                community = {post.communityId}
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