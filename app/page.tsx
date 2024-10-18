import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Fitness Tracker</h1>
      <SignedIn>
        <nav className="space-x-4 mb-8">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/workouts">Workouts</Link>
          </Button>
          <Button asChild>
            <Link href="/chat">AI Chatbot</Link>
          </Button>
        </nav>
      </SignedIn>
      <SignedOut>
        <div className="space-y-4">
          <SignIn />
          <SignUp />
        </div>
      </SignedOut>
    </div>
  );
}