"use client";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
    const router = useRouter();

    const { toast } = useToast();
    const { mutate, isPending } = api.user.logout.useMutation({
        onSuccess: () => {
            toast({
                description: "Logged out successfully",
            });
            window.history.replaceState(null, "", "/login");
            router.push("/login");
        },
    });

    return (


        <button disabled={isPending}
            onClick={() => {
                mutate();
            }} className='flex flex-row items-center gap-2 bg-red-100 text-red-500 p-2 rounded-lg text-sm'>
            <LogOut size={18} />
            <p>Logout</p>
        </button>
    );
};

export default LogoutButton;
