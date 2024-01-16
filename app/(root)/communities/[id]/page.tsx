import ProfileHeader from "@/components/shared/ProfileHeader";
import UserProfiler from "@/components/shared/UserProfiler";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import ProfileTab from "@/components/shared/ProfileTab";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import UserCard from "@/components/cards/UserCard";

const CommunityPage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const communityDetails = await fetchCommunityDetails(params.id);
  return (
    <>
      <ProfileHeader
        name={communityDetails.name}
        username={communityDetails.username}
        image={communityDetails.image}
        bio={communityDetails.bio}
        type="community"
      />
      <div className="flex flex-col items-start gap-8 w-full mt-8">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => {
              return (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>

                  {tab.label === "Threads" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails?.threads?.length}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="threads">
            {communityTabs.map((tab) => {
              return <ProfileTab key={tab.label} tab={tab} userId={communityDetails._id} accountType = "community"/>;
            })}
          </TabsContent>
          <TabsContent value="members">
            <section className="my-6">
            {
                communityDetails.members.map((member : any) => {
                    return <UserCard key={member.id} id={member._id} name={member.name} username={member.username} image={member.image}/>
                })
            }
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CommunityPage;
