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
import Image from "next/image";
import { fileURLToPath } from "url";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface accountProfilePropsType {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}
import { useUploadThing } from "@/lib/uploadThing";
import { isBase64Image } from "@/lib/utils";
import { BlockList } from "net";
import { start } from "repl";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";


function AccountProfile({ user, btnTitle }: accountProfilePropsType) {
  const pathname = usePathname();
  const router = useRouter();
  const { startUpload }  = useUploadThing("media",{
    onUploadError : ()=>{
      console.log("erorr uploading")
    }
  });

  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<z.infer<typeof userAccountFormSchema>>({
    resolver: zodResolver(userAccountFormSchema),
    defaultValues: {
      profile_photo: user?.image || '',
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  async function onSubmit(values: z.infer<typeof userAccountFormSchema>) {
    try{

      let blob = values.profile_photo;
      // console.log(blob)
      if(isBase64Image(blob)){
        let res = await startUpload(files);
        if (res && res[0].url) {
        values.profile_photo = res[0].url;
        
      }
      
    }
    await updateUser({
      userId : user.id,
      username : values.username,
      name : values.name,
      bio : values.bio,
      image : values.profile_photo,
      path : pathname
    });
    if(pathname === '/profile/edit'){
      router.back();
    }
    else{
      router.push('/');
    }
  }catch(err){
    console.log(err);
  }
}
  function handleImage(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) {
    e.preventDefault();
    let file = e.target.files ? e.target.files[0] : null;
    if(file){
      // update the files state
      if (!file.type.includes("image")) return;
      setFiles(Array.from(e.target.files || []));
      let fileReader = new FileReader();
      fileReader.onload = (event)=>{
        // update the react-form-hook state
        fieldChange(event.target?.result?.toString() || "");
      }
  
      fileReader.readAsDataURL(file)

    }
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    priority
                    alt="Profile Photo"
                    width={96}
                    height={96}
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a Photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl className="">
                <Input type="text" className="account-form_input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl className="">
                <Input type="text" className="account-form_input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl className="">
                <Textarea rows={10} className="account-form_input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">Submit</Button>
      </form>
    </Form>
  );
}

export default AccountProfile;
