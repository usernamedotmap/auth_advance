"use client";

import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginMutationFn } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function Login() {


  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const loginFormSchema = z.object({
    email: z.string().trim().email().min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    mutate(values, {
      onSuccess: (response) => {
        if (response.data.mfaRequired) {
          router.replace(`/verify-mfa?email=${values.email}`);
          return;
        }
        router.replace("/home");
      },
      onError: (error) => {
        toast.error("Error", {
          description: error.message,
          duration: 5000,
        });
      },
    });
  };

  return (
    <>
      <main className="w-full min-h-[590px] h-auto max-w-full pt-10">
        <div className="w-full p-5 rounded-md">
          <Logo />

          <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
            Welcome back totoy
          </h1>
          <p className="mb-6 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal">
            Don't Have an Account?{" "}
            <Link className="text-blue-500" href={"/signup"}>
              Sign Up
            </Link>
            .
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6+4">
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm mt-2">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="off"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full flex justify-end items-center my-4">
                  <Link href={`/forgot-password?email=${form.getValues("email")}`}>
                    <p className="dark:hover:text-blue-500 dark:text-primary text-sm">
                      Forgot Password?
                    </p>
                  </Link>
                </div>
              </div>
              <Button
                className="w-full text-[15px] h-[40px] !bg-blue-500 text-white font-semibold cursor-pointer"
                disabled={isPending}
                type="submit"
              >
                {isPending && <Loader className="animate-spin" />}
                Login to my heart
              </Button>

              <div className="mb-4 mt-4 flex items-center justify-center">
                <div
                  aria-hidden="true"
                  className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                  data-orientation="horizontal"
                  role="seperator"
                ></div>
                <span className="mx-4 text-sm dark:text-[#f1f7feb5] font-normal">
                  OR
                </span>
                <div
                  aria-hidden="true"
                  className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                  data-orientation="horizontal"
                  role="seperator"
                ></div>
              </div>
            </form>
          </Form>
          <Button
            variant={"outline"}
            className="w-full h-[40px] cursor-pointer"
          >
            Email magic Link
          </Button>
          <p className="text-xs font-normal mt-4">
            By signing up, you agree to our{" "}
            <a className="text-primary hover:underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}
