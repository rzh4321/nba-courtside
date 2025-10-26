import { API_URL } from "@/config";
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
import DollarInput from "./DollarInput";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "./ui/button";

const formSchema = z.object({
  amount: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Required",
  }),
});

const DepositMoneyForm = () => {
  const [amount, setAmount] = useState<undefined | string>();
  const [pending, setPending] = useState(false);
  const { deposit } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/user/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: +values.amount,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      if (!res.success) {
        toast.error("Something went wrong. Please try again later.");
        setPending(false);
        return;
      }
      console.log(res);
      deposit(+values.amount);
      toast.success(
        `Successfully deposited $${parseFloat(values.amount).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}!`,
      );
    } else {
      const { detail } = await response.json();
      toast.error(detail);
    }
    setPending(false);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "0",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2 w-full ">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-4/5">
                <FormControl>
                  <DollarInput
                    field={field}
                    setAmount={setAmount}
                    label="Deposit"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className={`h-14 p-0 rounded-sm self-start flex w-1/5 flex-row items-center justify-center ${pending || amount === undefined || +amount <= 0 ? "dark:bg-slate-500 bg-slate-400 text-black font-light" : "bg-green-600/80 hover:bg-green-800 text-white"} text-sm shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`}
            aria-disabled={pending || amount === undefined || +amount <= 0}
            disabled={pending || amount === undefined || +amount <= 0}
          >
            {pending ? (
              <div className="animate-spin rounded-full h-8 border-b-2 border-gray-900 dark:border-white" />
            ) : (
              <div className="">+</div>
            )}
          </Button>{" "}
        </div>
      </form>
    </Form>
  );
};

export default DepositMoneyForm;
