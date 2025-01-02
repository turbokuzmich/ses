import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { ReadableStream } from "stream/web";
import { auth } from "@/lib/auth";
import { join } from "path";
import { fetchMusicById } from "@/lib/api";

async function fileExists(path: string) {
  try {
    const fileStat = await stat(path);

    return fileStat.isFile();
  } catch (_) {
    return false;
  }
}

export async function GET(
  _: Request,
  { params: { id } }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.token) {
    return Response.json({ error: "not authorized" }, { status: 401 });
  }

  const music = await fetchMusicById(id, session.user.token);

  if (music === null) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  if (music.status !== "PROCESSED") {
    return Response.json({ error: "not processed" }, { status: 500 });
  }

  const path = join(
    process.env.UPLOAD_PATH ?? join(process.cwd(), "uploads"),
    music.path
  );

  if (!(await fileExists(path))) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const fileStream = ReadableStream.from(createReadStream(path));

  return new Response(fileStream as BodyInit, {
    headers: {
      "content-type": "audio/mpeg",
    },
  });
}
