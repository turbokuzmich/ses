import { auth } from "@/lib/auth";
import { fetchMe, updateMe } from "@/lib/api";
import { updateMeSchema } from "@/lib/schemas";

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

export async function POST(request: Request) {
  const [session, data] = await Promise.all([auth(), request.json()]);

  if (!session?.user?.token) {
    return Response.json({ error: "not authorized" }, { status: 401 });
  }

  const validation = updateMeSchema.safeParse({
    token: session.user.token,
    ...data,
  });

  if (!validation.success) {
    return Response.json({ error: "invalid data" }, { status: 400 });
  }

  const me = await updateMe(validation.data);

  if (!me) {
    return Response.json({});
  }

  return Response.json(me);
}
