
"use client"

import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordMutationFn } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader, MailCheckIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const params = useSearchParams()

  const email = params.get("email")
  
  const { mutate, isPending} = useMutation({
    mutationFn: forgotPasswordMutationFn,
  });



  const formSchema = z.object({
    email: z.string().email().trim().min(1, {
      message: "Email is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast.error('Error',{
            description: error.message,
            duration: 5000,
        });
      }
    })
  }

  return (
    <>
       <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center ">
      {!isSubmitted ? (
        <div className="w-full h-full p-5 rounded-md">
          <Logo />

          <h1
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8
        text-center sm:text-left"
          >
            Reset password
          </h1>
          <p className="mb-6 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal">
            Include the email address associated with your account and we’ll
            send you an email with instructions to reset your password.
          </p>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="mb-0">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isPending}
                className="w-full text-[15px] h-[40px] text-white font-semibold"
              >
                {isPending && <Loader className="animate-spin" />}
                Send reset instructions
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Check your email
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            We just sent a password reset link to {form.getValues().email}.
          </p>
          <Link href="/">
            <Button className="h-[40px]">
              Go to login
              <ArrowRight />
            </Button>
          </Link>
        </div>
      )}
    </main>
    </>
  )
}