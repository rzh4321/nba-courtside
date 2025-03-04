import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { API_URL } from "@/config";
import useAuth from "@/hooks/useAuth";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Required",
  }),
  password: z.string().min(1, {
    message: "Required",
  }),
});

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });
    if (response.ok) {
      const { token, user } = await response.json();
      toast(`Welcome back, ${user.username}`, {
        type: "success",
        description: ``,
        duration: 1000,
      });
      console.log("TOKEN IS ", token);
      login(token);
    } else {
      const { message } = await response.json();
      toast("Log in failed", {
        description: message,
      });
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 items-center"
      >
        <DialogHeader className="">
          <DialogTitle className="text-2xl font-bold">
            Log in to NBA Courtside
          </DialogTitle>
          <DialogDescription>
            Log in to start placing mock bets.
          </DialogDescription>
        </DialogHeader>

        <div className="w-4/5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="username"
                  className="mb-3 mt-5 block text-xs font-medium"
                >
                  Username
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      className="peer text-base w-full block rounded-md border bg-zinc-50 px-2 py-[9px] sm:text-sm outline-none placeholder:text-zinc-500"
                      id="username"
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem style={{ marginTop: "16px" }}>
                <FormLabel
                  htmlFor="password"
                  className="mb-3 mt-5 block sm:text-xs font-medium text-zinc-400"
                >
                  Password
                </FormLabel>
                <FormControl>
                  <div style={{ position: "relative" }}>
                    <Input
                      {...field}
                      className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] sm:text-sm text-base outline-none placeholder:text-zinc-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="my-6 flex sm:h-10 border-blue-600 w-full flex-row items-center justify-center rounded-md bg-[#6366f1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            aria-disabled={pending}
            disabled={pending}
          >
            {pending ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
            ) : (
              "Log in"
            )}
          </Button>{" "}
        </div>
      </form>
    </Form>
  );
}
