"use client"

import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import { verifyEmailMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ConfirmAccount = () => {
  const router = useRouter();
  const params = useSearchParams();

  const code = params.get("code");

  const { mutate, isPending } = useMutation({
    mutationFn: verifyEmailMutationFn,
  });

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!code) {
      toast.error("Error", {
        description: "Confirmation code is not found",
        duration: 5000,
      });
      return;
    }
    mutate(
      { code },
      {
        onSuccess: () => {
          toast.success("Success", {
            description: "Email verified successfully",
            duration: 5000,
          });
          router.replace("/");
        },
        onError: (error) => {
          toast.error("Error", {
            description: error.message,
            duration: 5000,
          });
        },
      }
    );
  };

  return (
    <>
      <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center ">
        <div className="w-full h-full p-5 rounded-md">
          <Logo />

          <h1
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-4 mt-8
        text-center sm:text-left"
          >
            Account confirmation
          </h1>
          <p className="mb-6 text-center sm:text-left text-[15px] dark:text-[#f1f7feb5] font-normal">
            To confirm your account, please follow the button below.
          </p>
          <form onSubmit={handleSubmit}>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full text-[15px] h-[40px] text-white font-semibold"
            >
              {isPending && <Loader className="animate-spin" />}
              Confirm account
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            If you have any issue confirming your account please, contact{" "}
            <a
              className="outline-none transition duration-150 ease-in-out 
            focus-visible:ring-2 text-primary hover:underline focus-visible:ring-primary"
              href="#"
            >
              support@moko.please
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
};

export default ConfirmAccount;
