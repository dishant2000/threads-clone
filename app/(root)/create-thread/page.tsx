import React from 'react'
import { currentUser } from '@clerk/nextjs'
import CreateThreadForm from '@/components/forms/CreateThreadForm';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect, useRouter } from 'next/navigation';
async function CreateThread() {
  const user = await currentUser();
  if(!user) return null;
  const userInfo = await fetchUser({userId : user.id});

  if(userInfo.onboarded === false) redirect('/onboarding'); 
  return (
    <>
        <h1 className="head-text">Create Thread</h1>
        <CreateThreadForm userId={userInfo._id}/>
    </>
  )
}

export default CreateThread