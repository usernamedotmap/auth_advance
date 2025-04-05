"use client";

import { Button } from "@/components/ui/button";
import { revokeMfaMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";

const RevokeMfa = () => {
  const querlyClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: revokeMfaMutationFn,
    onSuccess: (response: any) => {
      querlyClient.invalidateQueries({
        queryKey: ["mfa-user"],
      });
      toast.success("Success", {
        description: "Revoke MFA successfully",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.message,
        duration: 5000,
      });
    },
  });

  const handleClick = useCallback(() => {
        mutate();
  }, [])

  return (
    <Button onClick={handleClick} disabled={isPending} className="h-[30    px] text-[#c40006d3] bg-red-100 shadow-none mr-1">
     {isPending && <Loader className="animate-spin" />}
      Revoke Access
    </Button>
  );
};

export default RevokeMfa;

