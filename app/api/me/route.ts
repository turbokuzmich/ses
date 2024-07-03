import { auth } from "@/lib/auth";
import { fetchMe } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.token) {
    return Response.json({ error: "not authorized" }, { status: 401 });
  }

  const me = await fetchMe({ token: session.user.token });

  if (!me) {
    return Response.json({});
  }

  return Response.json(me);
}
