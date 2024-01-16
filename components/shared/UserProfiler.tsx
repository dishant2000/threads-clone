import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import ProfileTab from "./ProfileTab";
interface userProfilerProps {
  id: string;
  threads: any[]
}
const UserProfiler = ({
  id,
  threads
}: userProfilerProps) => {
  return (
    <div className="flex flex-col items-start gap-8 w-full mt-8">
      <Tabs defaultValue="threads" className="w-full">
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
           {profileTabs.map((tab) => {
            return <ProfileTab
              key = {tab.label}
              tab = {tab}
              userId = {id}
            />
           })}
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default UserProfiler;
