import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Calendar } from 'lucide-react';

export default function Home() {

  // if userId: redirect to /events 
  const { userId } = auth()
  if (userId != null) redirect("/events")
    
  return (
    <div className="container w-screen h-screen flex flex-col justify-center items-center
    gap-4">
      <div className="flex flex-col justify-center items-center gap-4 sm:w-1/2 lg:w-1/3">
        <div className="flex justify-center items-center gap-4">
          <h1 className="text-3xl">Home Page</h1>
          <Calendar />
        </div>
        <p className="text-center">Login to create and manage schedules, to book an event use the link provided</p>
      </div>
      <div className="flex gap-4 justify-center">
        <Button asChild 
          className="w-32 btn-blue"
          size="lg">
          <SignInButton />
        </Button>
        
        <Button asChild variant="outline" size="lg" className="w-32">
          <SignUpButton />
        </Button>
        
        <Button asChild variant="ghost" size="lg" className="w-32">
          <UserButton />
        </Button>
      </div>
    </div>
  );
}
