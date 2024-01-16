
"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
function UserCard({
    id,
    name, 
    image,
    username
} : {
    id: string;
    name: string;
    image: string;
    username: string;
}): JSX.Element {
  const router = useRouter();
  return (
    <section className="flex items-center justify-between gap-4 my-4">
        <div className="flex items-center gap-4">
            <div className="rounded-full fill object-contain">
                <Image
                    src={image}
                    alt={name}
                    width={45}
                    height={45}
                    className="rounded-full object-fill"
                />
            </div>
            <div className="flex flex-col text-ellipsis">
                <h1 className="text-xl font-bold">{name}</h1>
                <p className="text-sm text-light-3">@ {username}</p>
            </div>
        </div>
        <div className="">
            <Button onClick = {()=> {router.push(`/profile/${id}`)}} className="rounded-xl px-4 py-2 bg-primary-500">View</Button>
        </div>
    </section>
  )
}

export default UserCard
