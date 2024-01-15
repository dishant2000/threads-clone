import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return <section className="flex w-full items-center justify-center h-screen">
          <SignUp />;
        </section>
}