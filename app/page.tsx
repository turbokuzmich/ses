import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import A from "@mui/material/Link";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/feed");
  }

  return (
    <A href="/auth" component={Link}>
      Войти
    </A>
  );
}
