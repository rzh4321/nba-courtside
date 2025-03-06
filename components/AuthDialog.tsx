import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useState } from "react";

export default function AuthDialog() {
  const [displayLoginForm, setDisplayLoginForm] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="text-white font-semibold tracking-tight"
          variant="link"
          id="logInButton"
        >
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-800">
        {displayLoginForm ? <LoginForm /> : <SignupForm />}
        <DialogFooter>
          <div
            onClick={() => setDisplayLoginForm(!displayLoginForm)}
            className="flex cursor-pointer mx-auto flex-row gap-1 text-sm text-zinc-400"
          >
            {displayLoginForm ? "No account yet? " : "Have an account? "}
            <div className="font-semibold underline">
              {displayLoginForm ? "Sign up" : "Log in"}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
