import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return <section className="flex w-full items-center justify-center h-screen"><SignIn /></section>;
}