"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import userAccountFormSchema from "@/lib/validations/user";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { redirect, usePathname, useRouter } from "next/navigation";
import createThreadFormSchema from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.action";
import { useOrganization } from "@clerk/nextjs";
  
function CreateThreadForm({userId} : {userId: string}) {
  const pathname = usePathname();
  const router = useRouter();
  const {organization} = useOrganization();
  const form = useForm<z.infer<typeof createThreadFormSchema>>({
    resolver: zodResolver(createThreadFormSchema),
    defaultValues: {
      thread : "",
      accountId : userId
    },
  });
  const onSubmit = async (values : z.infer<typeof createThreadFormSchema>)=>{
    await createThread({
      message : values.thread,
      author : userId,
      communityId : organization ? organization.id : null,
      path : pathname
    })
    form.reset();
    router.push('/');
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                lets post a thread !
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 text-base-medium">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">Create Thread</Button>
      </form>
    </Form>
  )
}

export default CreateThreadForm