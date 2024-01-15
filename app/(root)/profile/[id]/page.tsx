import ProfileHeader from "@/components/shared/ProfileHeader";
import UserProfiler from "@/components/shared/UserProfiler";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";


const Profile = async ({params} : {params : {id : string}})=>{
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser({userId : params.id});
    if(!userInfo.onboarded) redirect("/onboarding");
    return(
        <>
            <ProfileHeader
                name={userInfo.name}
                username={userInfo.username}
                image={userInfo.image}
                bio={userInfo.bio}
            />
            <UserProfiler 
                id={userInfo._id}
                threads={userInfo.threads}
            />
        
        </>
    )
}

export default Profile;