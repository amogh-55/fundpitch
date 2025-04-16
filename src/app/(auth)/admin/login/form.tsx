"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { Mail, Lock } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface LoginFormValues {
  password: string;
  email: string;
}

const Adminform = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const { toast } = useToast();

  const { mutate, isPending } = api.admin.login.useMutation({
    onSuccess: ({ user }) => {
      if (user) router.push("/admin");
      toast({
        description: "Logged in",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message ?? "Login failed",
      });
    },
  });
  const onSubmit = (data: LoginFormValues) => {
    try {
      mutate(data);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Login failed",
      });
    }
  };

  return (
    <form
      className="w-full space-y-6 rounded-lg md:w-2/3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            id="email"
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email Address is required",
            })}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            id="password"
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center justify-center">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            <span>Logging in...</span>
          </div>
        ) : (
          <span>Login</span>
        )}
      </Button>
    </form>
  );
};

export default Adminform;
