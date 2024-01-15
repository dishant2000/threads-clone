import UserCard from "@/components/shared/UserCard";
import UserProfiler from "@/components/shared/UserProfiler";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import {currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

const Search = async ()=>{
    // const pathname = usePathname();
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser({userId : user.id});
    if(!userInfo.onboarded) redirect("/onboarding");
    
    const fetchedUsers = await fetchUsers({
        userId : user.id,
        pageNo : 1,
        sortBy : "desc",
        pageSize : 10,
        searchStr  :" ",
    })
    return <section>
        <h1 className="head-text mb-4">Search</h1>
        <div className="flex flex-col gap-4">
           {
            fetchedUsers.users.map((user)=>{
                return(<UserCard
                id={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
            />)
            })
           }
        </div>
    </section>
}
export default Search;