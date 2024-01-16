import Image from "next/image";

const ProfileHeader = async({
    image, 
    username,
    name, 
    bio,
    type
}:{
    image : string, 
    username : string, 
    name : string, 
    bio : string,
    type ?: "community" | "user"
})=>{
    return (
        <div>
        <div className="flex items-start gap-6">
          <div className="relative w-20 h-20 object-cover">
            <Image
              src={image}
              alt={name}
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex flex-col items-start ">
            <h2 className="text-heading2-semibold text-light-2">{name}</h2>
            <p className="text-base-regular text-light-3">@{username}</p>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-base1-medium text-light-2">{bio}</p>
        </div>
      </div>
    )
}

export default ProfileHeader;