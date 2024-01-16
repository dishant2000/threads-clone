import AccountProfile from '@/components/forms/AccountProfile';
import '../../globals.css'
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
async function Onboarding(){
    const user = await currentUser();
    // console.log("this is user",user);
    if(!user) redirect('/sign-in');
    const userInfo = await fetchUser({userId: user.id});
    const userData = {
        id: user.id,
        objectId: userInfo?._id,
        username: userInfo ? userInfo?.username : user?.username ?? "",
        name: userInfo ? userInfo?.name : user?.firstName ?? "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user?.imageUrl,
      };
    return (
        <main className='mx-auto flex flex-col justify-start px-10 py-20 max-w-3xl'>
           <h1 className='head-text'>
                Onboarding
            </h1> 
            <p className='mt-3 text-base-regular text-light-2'>Complete your profile to use threads now !</p>
            <section className='mt-3 bg-dark-2 p-10'>
                <AccountProfile user = {userData} btnTitle = "continue"/>
            </section>
        </main>
    ) 
}

export default Onboarding;