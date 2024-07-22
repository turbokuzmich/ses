import { fetchMyPosts } from "@/lib/api";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.token) {
    return Response.json({ error: "not authorized" }, { status: 401 });
  }

  const posts = await fetchMyPosts({ token: session.user.token });

  return Response.json(posts);
}
