import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import DepositMoneyForm from "./DepositMoneyForm";

export default function ProfileDropdown() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full font-bold tracking-wide dark:bg-green-600 dark:border-green-700 dark:hover:bg-green-700 bg-green-400 border-green-500 hover:bg-green-500"
        >
          ${user?.balance.toFixed(2)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DepositMoneyForm />
        <DropdownMenuSeparator className="bg-slate-400 dark:bg-slate-700" />
        <Link href="/bets">
          <DropdownMenuItem className="font-semibold tracking-tight cursor-pointer">
            My Bets
          </DropdownMenuItem>
        </Link>
        <Link href="/profile">
          <DropdownMenuItem className="font-semibold tracking-tight cursor-pointer">
            Account
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="font-semibold tracking-tight cursor-pointer"
          onClick={handleLogout}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
