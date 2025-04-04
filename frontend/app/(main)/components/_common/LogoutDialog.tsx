"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { logoutMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { toast } from "sonner";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      router.replace("/");
      toast.success("Success", {
        description: "Logout successfully",
        duration: 5000,
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        duration: 5000,
        
      });
    },
  });

  const handleLogout = useCallback(() => {
    mutate()
  }, [])
  return (
    <>
      <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are u sure u want to log me out?</DialogTitle>
            <DialogDescription>
              This is your last chance, ur current session will be ended and try
              to gain access again if u can
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isPending} type="button" onClick={handleLogout}>
              {isPending && <Loader className="animate-spin" />}
              Yes, please.</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
