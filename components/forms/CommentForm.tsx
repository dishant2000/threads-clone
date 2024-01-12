"use client"

import commentFormSchema from "@/lib/validations/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from 'zod';
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
import Image from "next/image";
import { createComment } from "@/lib/actions/thread.action";

interface commentFormProps{
    threadId : string, 
    userImg : string, 
    userId : string,
}

const CommentForm = ({threadId, userImg, userId} : commentFormProps)=>{
    
    const pathname = usePathname();
  const router = useRouter();
  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      message : "",
    },
  });
  const onSubmit = async (values : z.infer<typeof commentFormSchema>)=>{
    await createComment({
      message : values.message,
      threadId : threadId,
      author : userId,
      path : pathname,
      communityId : null
    });
    form.reset();
  }
  return (
    <Form {...form}>
      <form
        className="flex items-center justify-start gap-10 border-t border-b border-gray-600 py-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
                <FormLabel >
                    <Image className="rounded-full" src={userImg} alt="user profile" width={42} height={42}/>
                </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 text-base-medium">
                <Input className="border-none bg-transparent" placeholder="Comment ..." {...field}/>
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 rounded-3xl">Post</Button>
      </form>
    </Form>
  )
}

export default CommentForm;