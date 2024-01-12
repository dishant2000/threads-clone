import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
interface userProfilerProps {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  threads: any[]
}
const UserProfiler = ({
  id,
  name,
  username,
  image,
  bio,
  threads
}: userProfilerProps) => {
  return (
    <div className="flex flex-col items-start gap-8">
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
      <div className="w-full"> 
      <Tabs defaultValue="account" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) =>{
                return <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {threads.length}
                  </p>
                )}
              </TabsTrigger>
            })}
          </TabsList>
          <TabsContent value="threads">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfiler;
