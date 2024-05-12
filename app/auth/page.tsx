import { auth } from "@/lib/auth";
import Forms from "./_components/forms";
import { redirect } from "next/navigation";

export default async function Auth() {
  const session = await auth();

  if (session) {
    redirect("/feed");
  }

  return <Forms />;
}
