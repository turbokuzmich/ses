import Forms from "./_components/forms";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/feed");
  }

  return <Forms />;
}
