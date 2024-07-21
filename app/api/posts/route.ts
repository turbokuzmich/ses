import { createPost } from "@/lib/api";
import { auth } from "@/lib/auth";
import { createPostSchema } from "@/lib/schemas";
import { type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const [session, data] = await Promise.all([auth(), request.json()]);

  if (!session?.user?.token) {
    return Response.json({ error: "not authorized" }, { status: 401 });
  }

  const validation = createPostSchema.safeParse({
    token: session.user.token,
    ...data,
  });

  if (!validation.success) {
    return Response.json({ error: "invalid data" }, { status: 400 });
  }

  const post = await createPost(validation.data);

  if (!post) {
    return Response.json({});
  }

  return Response.json(post);
}
